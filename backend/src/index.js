import express from 'express';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/message.route.js';
import cors from 'cors';
import { server, app} from './lib/socket.js'; 

import path from 'path'; 

dotenv.config();

app.use(cors({                        //enable CORS for all routes basically cross url resource sharing from backend to frontend
    origin: 'http://localhost:5173',  // frontend url
    credentials: true,                // allow credentials (cookies) to be sent
}))

app.use(express.json({limit:'10mb'}))
app.use(cookieParser()) 

const PORT = process.env.PORT;

const __dirname = path.resolve(); // get the current directory

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '/frontend/dist'))); // serve static files from the frontend build folder
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html")); // send the index.html file for all other routes
    })
}

server.listen(PORT, () => {
    console.log("Server is running on port:"+ PORT);
    connectDB()
})  