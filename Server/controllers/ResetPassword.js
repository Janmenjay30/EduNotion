
const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt");


// reset password token 
exports.resetPasswordToken= async (req,res)=>{
   try{
     // get email from req body 
     const email=req.body.email;
     // check user for this email
     const user= await User.findOne({email:email});
     if(!User){
         return res.json({
             success:false,
             message:"Your email is not registered with us"
         });
     }
     // generate token 
     const token=crypto.randomUUID();
     // update user by adding token and expiraion time 
     const updatedDetails=await User.findOneAndUpdate({email:email},{
         token:token,
         resetPasswordExpires:Date.now()+5*60*1000,
     },{new:true});
     // create url
     const url=`http://localhost:3000/update-password/${token}`;
     // send mail containing the url
     await mailSender(email,"Password reset link",`Password reset Link: ${url} ` );
 
     // return reponse
     return res.json({
         success:true,
         message:"emial sent successfully, please check email and change password"
     });
   }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reseting password "
        })
   }
    
}


// reset password
exports.resetPassword=async (req,res)=>{
    try{
        // data fetch
        const {password, confirmPassword,token}=req.body;
        // validation
        if(password != confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching ",
            });
        }
        // get user details 
        const userDetails= await User.findOne({token:token});
        // if no entry -invalid token 
        if(!userDetails){
            return res,json({
                success:false,
                message:"Token is invalid ",
            });
        }

        //  token time expired
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token is expired please regenrate the token"
            });
        }
        // hash password 
        const hashedPassword=await bcrypt.hash(password,10);

        // password update
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true} 
        );

        // return response 
        return res.json({
            success:true,
            message:'Password reset successfully',
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reseting password "
        });
    }
}
