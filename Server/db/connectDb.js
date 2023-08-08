import dotenv from 'dotenv';
dotenv.config()

import mongoose from "mongoose";

const connectDb = async (DATABASE_URL)=>{
    try{
        const DB_OPTION = {
            dbName:process.env.DB_NAME
        }
        await mongoose.connect(DATABASE_URL,DB_OPTION)
        console.log("DATABASE CONNECTED SUCCESSFULLY")
    }catch(err){
        console.log(err)
    }
}

export default connectDb;