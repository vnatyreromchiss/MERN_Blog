import express from 'express';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { handleValidationErrors, checkAuth} from './utils/index.js';

import {UserController, PostController} from './controllers/index.js';

mongoose
    .connect('mongodb+srv://Romchiss:Danyapopa2002@cluster0.p2gauvf.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DataBase OK'))
    .catch((err) => console.log('DataBase Error', err));

const app = express();

const storage = multer.diskStorage({
   destination: (__, _, cb) => {
        cb(null, 'uploads'); 
   },
   filename: (_, file, cb) => {
    cb(null, file.originalname); 
},
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login); 

app.post('/auth/register/', registerValidation, handleValidationErrors, UserController.register);

app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    console.log('chill')
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});



    // console.log(req.body);


    // if (req.body.email === 'test@test.ua') {
    //     const token = jwt.sign({
    //             email: req.body.email,
    //             fullName: 'Romchiss Chiller',
    //         },
    //         'secret123',
    //     );
    // }

    // res.json({
    //     success: true,
    //     token,
    // });




