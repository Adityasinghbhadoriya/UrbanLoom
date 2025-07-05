import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import mongoose from "mongoose";
import clothRoutes from './Routes/cloth.router.js';
import userRoutes from "./Routes/user.router.js";
import adminRoutes from "./Routes/admin.route.js";
import orderRoutes from "./Routes/order.route.js"
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from 'cloudinary';
import cors from "cors";
const DB_URI = process.env.MONGO_URI;
const app = express()
const port = process.env.PORT|| 3000;
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    
}))
app.use(express.json());
app.use(cookieParser())

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/v1/cloth", clothRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/order", orderRoutes);


 //Cloudinary Configuration
 cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret 
});

try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB");
} catch (error) {
    console.log(error);
}

app.listen(port, () => {
    console.log(`Server is Running on port ${port}`)
})
