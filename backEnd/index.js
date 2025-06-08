import express, { urlencoded } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./Utils/DB.js"
import userRoutes from "./Routes/User.route.js"
import postRoutes from "./Routes/Post.route.js"
import messageRoutes from "./Routes/Message.route.js"
import { app,server,io } from "./Socket/socket.js";

dotenv.config({});
const PORT = process.env.PORT||3000;

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"I'm coming from Backend",
        success:true
    })
})

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corseOption ={
    origin:"http://localhost:5173",
    credentials:true
}
app.use(cors(corseOption))


// Routes
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/post",postRoutes)
app.use("/api/v1/message",messageRoutes)

server.listen(PORT,()=>{   
    connectDb()
    console.log(`Server listen at port ${PORT}`)
})