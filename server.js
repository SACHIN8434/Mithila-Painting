// Writter - Sachin Kumar(2026)

import express from "express";
import connectDB from "./config/db.js";
import "dotenv/config"

const app = express();


connectDB();

// This api used to verify the server is working or not
app.get("/api/test-server",(req,res)=>{
    res.send("Server is working...");
})



app.listen(process.env.PORT,()=>{
    console.log(`App is working on port ${process.env.PORT}`);
    
})