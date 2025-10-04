const express=require("express");
const app=express();

const userRoutes=require('./routes/User');
const paymentRoutes=require('./routes/Payments');
const courseRoutes=require('./routes/Course');
const profileRoutes=require('./routes/Profile');

const database=require("./config/database");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const {cloudinaryConnect}=require("./config/cloudinary");
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv").config();
const PORT=process.env.PORT || 4000;

database.connect();
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials:true,
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",

    })
)

// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);

// def route

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running......",
    })
})

app.listen(PORT,()=>{
    console.log(`APP is running at ${PORT}`);
})

