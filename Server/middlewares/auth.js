const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");


// auth
exports.auth=async (req,res,next)=>{
    try{
        // extract token
        const token= req.cookies.token ||
        req.body.token || req.header("Authorization").replace("Bearer ","");

        // if token is missing 
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            })
        }
        // verify the token 
        try{
            const decode= jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        }catch(err){
            return res.status(401).json({
                success:false,
                message:'token is invalid'
            });
        }
        next();
    }catch(error){
         return res.status(401).json({
            success:false,
            message:"something went wrong while validating the token"
         })
    }
}

// isstudent
exports.isStudent= async(req,res,next)=>{
    try{
        if(req.user.accountType !=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Students Only",
            });
        }
        next();
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"user role connot be varified  "
        })
    }
}


// isInstructor
exports.isInstructor= async(req,res,next)=>{
    try{
        if(req.user.accountType !=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor Only",
            });
        }
        next();
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"user role connot be varified  "
        })
    }
}

// isAdmin

exports.isAdmin= async(req,res,next)=>{
    try{
        console.log("accountType: ",req.user.accountType);
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin Only",
            });
        }
        next();
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"user role connot be varified  "
        })
    }
}
