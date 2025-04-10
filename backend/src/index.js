import express from 'express';  // set type = module in package.json to use ES6 import syntax
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/message.route.js';
import cors from 'cors';
dotenv.config();
const app = express();

app.use(cors({                        //enable CORS for all routes basically cross url resource sharing from backend to frontend
    origin: 'http://localhost:5173',  // frontend url
    credentials: true,                // allow credentials (cookies) to be sent
}))

app.use(express.json({limit:'10mb'}))
app.use(cookieParser()) 

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

app.listen(PORT, () => {
    console.log("Server is running on port:"+ PORT);
    connectDB()
})  