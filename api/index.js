import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import {fileURLToPath} from 'url';
import {register} from "./controllers/auth.js"
import authRoutes from './routes/auth.js'
import usersRoutes from './routes/usersRoutes.js'
import postsRoutes from './routes/postsRoutes.js'
import { verifyToken } from './middleware/authMiddleware.js';
import { createPost } from './controllers/postsController.js';
import User from './models/User.js'
import PostModel from './models/PostModel.js';
import {users, posts} from './data/index.js';


/* Middleware and packages configuration */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, 'public/assets')))



/* File strage configuration */
const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, "public/asstest")
    },
    filename: (req, file, cd) => { 
        cb(null, file.originalname + Date.now())
    }
})

const upload = multer({storage})

/* Routes with files */
app.post("/auth/register", upload.single("picture"), register)
app.post('/posts', verifyToken, upload.single("picture"), createPost)

/* Routes */
app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/posts', postsRoutes)

/* Mongoose setup */
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => {console.log('Server port:' + PORT)})
    /* Add data one time */
   /*  User.insertMany(users)
    PostModel.insertMany(posts) */
}).catch((err) => {console.log(err + ' did not connect')})