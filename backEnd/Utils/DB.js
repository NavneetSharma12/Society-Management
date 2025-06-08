import mongoose from "mongoose";

const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connect DB");
    } catch (error) {
        console.log("Error form DB",error);
    }
}

export default connectDb;