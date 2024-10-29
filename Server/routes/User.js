const express = require("express")
const router = express.Router()

const {
    signUp,
    login,
    sendOTP,
    changePassword,


}=require("../controllers/Auth");

const { resetPasswordToken,
    resetPassword,

}= require("../controllers/ResetPassword");

const { auth }= require("../middlewares/auth")

//  Authentication Routes

router.post("/login",login);

router.post("/signUp",signUp);

router.post("/sendotp",sendOTP);

router.post("/changePassword",auth,changePassword);

//  reset Password 

router.post("/reset-password",resetPassword);

router.post("/reset-password-token",resetPasswordToken);

module.exports=router;

