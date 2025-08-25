const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");


// Fix the auth middleware
exports.auth = async (req, res, next) => {
    try {
        // Extract token - FIX: Add null check for Authorization header
        const token = req.cookies.token ||
                     req.body.token || 
                     (req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null);

        // If token is missing 
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        // Verify the token 
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid'
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token"
        });
    }
};

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



// Admin authentication middleware
exports.adminAuth = async (req, res, next) => {
    try {
        // Extract admin token
        const token = req.cookies.adminToken || 
                     req.body.token || 
                     req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Admin token is missing"
            });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            
            // Check if it's an admin token
            if (decode.accountType !== "Admin" || decode.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. Admin privileges required."
                });
            }

            req.admin = decode;
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin token"
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating admin token"
        });
    }
};
