// Writter - Sachin Kumar(2026)

import express from "express";
import connectDB from "./config/db.js";
import connectCloudinary from './config/cloudinary.js';


import "dotenv/config"
import User from "./routes/User.js";
import admin from './routes/admin.js';
import Product from "./routes/Product.js";

const app = express();
app.use(express.json())

connectDB();
 connectCloudinary();


// //routes
app.use("/api/user",User);
app.use("/api/admin",admin)
app.use("/api/product",Product)

// This api used to verify the server is working or not
app.get("/api/test-server",(req,res)=>{
    res.send("Server is working...");
})



app.listen(process.env.PORT,()=>{
    console.log(`App is working on port ${process.env.PORT}`);
    
})