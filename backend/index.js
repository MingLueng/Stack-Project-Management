import cors from "cors"; // CORS (Cross-Origin Resource Sharing) giúp cho phép hoặc chặn request từ các domain khác.
import dotenv from "dotenv"; // Dotenv giúp đọc biến môi trường (.env) trong Node.js, bảo mật thông tin nhạy cảm.
import express from "express";
import mongoose from 'mongoose';
import morgan from "morgan";
import routes from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT || 5050;

console.log("Server running on port:", PORT);

const app = express(); // Khởi tạo ứng dụng Express

app.use(express.json());

app.use(cors({ // Mở API cho tất cả các domain, chỉ cho phép React frontend truy cập
    origin: process.env.FRONTEND_URL,
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:['Content-Type','Authorization'], 
    })
);  

app.use(morgan("dev")); //Middleware để log request vào console

//db Connection 
mongoose.connect(process.env.MONGODB_URI).then(()=> console.log("DB Connected Successfully")).catch((err)=> console.log("Failed to connect to DB:",err));

app.get("/", async(req,res)=>{
    res.status(200).json({
        message:"Welcome to TaskHub API",
    });
});


// http:localhosst:5050/api-v1/
app.use("/api-v1", routes)

// error middleware
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        message:"Internal server error"
    });
});

// not found middleware
app.use((req, res) => {
    res.status(404).json({
        message:"Not found"
    });
});

app.listen(PORT, ()=> {
    console.log(`Server listening on ${PORT}`); //Khởi động server và lắng nghe request từ client
});