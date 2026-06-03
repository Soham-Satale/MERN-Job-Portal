import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import connectDB from './config/db.js';
import { fileURLToPath } from 'url';
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import SavedJobRoutes from "./routes/savedJobRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app=express();

// Create __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middlewares to handle CORS
app.use(cors(
    {
        origin:'*',
        methods:['GET','POST','PUT','DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
));

//Connect Database
connectDB();

//Middlewares
app.use(express.json());

//Routes
app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/applications',applicationRoutes);
app.use('/api/save-jobs',SavedJobRoutes);
app.use('/api/analytics',analyticsRoutes);

//serve uploads folder
app.use('/uploads',express.static(path.join(__dirname,'/uploads'),{}));




//Start Server
const port=process.env.PORT || 5000;
app.listen(port,()=>console.log(`Server running on port ${port}`));