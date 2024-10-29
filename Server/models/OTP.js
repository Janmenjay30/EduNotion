const mongoose=require("mongoose");
const mailSender=require("../utils/mailSender");
const emailTemplate=require("../mail/templates/emailVerificationTemplate");
const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        requires:true
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});

//  a function->to send mail

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse= await mailSender(email," Verification Email from Janmenjay ", emailTemplate(otp));
        console.log("mail sent succefully ",mailResponse);

    }catch(error){
        console.log("error occured whle sending mail:",error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next){
    if(this.isNew){
        await sendVerificationEmail(this.email,this.otp);
        next();
    }
    
})


module.exports=mongoose.model("OTP",OTPSchema);


