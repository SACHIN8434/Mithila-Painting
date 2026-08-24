import mongoose from "mongoose"

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfully...");

    }catch(err){
        console.log("Error occured while connecting to Database...!");
    }
}

export default connectDB;