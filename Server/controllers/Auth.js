const User=require("../models/User");
const {passwordUpdated}=require("../mail/templates/passwordUpdate");
const bcrypt=require("bcrypt");
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator");
const Profile=require("../models/Profile");
const jwt=require("jsonwebtoken");
require("dotenv").config();





// sign up

exports.signUp=async (req,res)=>{
    try{
         // data fetch from req ki body
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    }= req.body; 
    // validate karo 
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(403).json({
            success:false,
            message:"All fields are required",
        })
    }
    // 2 password match karlo 
    if(password!= confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password and Confirm Password does not match,please try again! ",

        });
    }

    // check user already exist or not 
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User is already registered ",
        });
    }
    // find the most recent otp stored for the user
    const recentOTP=await OTP.find({email}).sort({createdAt:-1}).limit(1);
    // console.log(recentOTP," is the recent OTP");
    // validate otp
    if(recentOTP.length==0){
        // OTP not found 
        return res.status(400).json({
            success:false,
            message:"OTP not found",
        })
        // i have changed here @@@#####@@@@@@@@@@@@@@@@
    }else if(otp !== recentOTP[0].otp){
        // Invalid OTP
        // console.log("otp",otp);
        // console.log("recentotp.otp",recentOTP.otp)
        return res.status(400).json({
            success:false,
            message:"OTP not valid",
           
        });
    }


    // hash password 
    const hashedPassword=await bcrypt.hash(password,10);

    let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);


    // entry create in db 

    const profileDetails= await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    });


    const user= await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType:accountType,
        approved:approved,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/8.x/personas/svg?seed=Felix${firstName} `
    })
    // return response
    return res.status(200).json({
        success:true,
        message:"User is registered successfully",
        user,
    })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. please try again",
        });

    }

   
    

}
// login

exports.login=async (req,res)=>{
    try{
        // get data from req body
        const {email,password}=req.body;
        // validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }
        // check if user exist or not
        const user=await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, please signup first",
            });
        }
        // Generate JWT token and Compare Password
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{ email: user.email, id: user._id, accountType: user.accountType },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);
            user.token=token;
            user.password=undefined;
             // craete cookie and send response
        const options={
            expiresIn:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,

        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"Loggen In Successfully",
        })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            })
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failed"
        })
    }
}

// send otp
exports.sendOTP=async(req,res)=>{
    try{
         // fetch email from req body
    const {email}=req.body;

    // check if user already exist
    const checkUserPresent=await User.findOne({email});

    // if user already exist
    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"User already registered"
        })
    }

    // generate OTP
    var otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    // console.log("Otp generated: ",otp);


    //check unique otp or not
    const result = await OTP.findOne({otp:otp});
    while(result){
        otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            // lowerCaseAlphabets:false,
            // specialChars:false,
        });
        // result=await OTP.findOne({otp:otp});
    }
    const otpPayload={email,otp};

    // create an entry for otp 
    const otpBody=await OTP.create(otpPayload);
    // console.log(otpBody);
    
    // return successfull response

    res.status(200).json({
        success:true,
        message:"OTP sent successfully",
        otp,
    });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
   

}




// Controller for Changing Password
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			// console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};