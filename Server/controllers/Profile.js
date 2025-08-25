const Profile=require("../models/Profile");
const {uploadImageToCloudinary}=require("../utils/imageUploader");

const User=require("../models/User");
const { findById } = require("../models/section");

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, dateOfBirth, about, contactNumber, gender } = req.body;
        const id = req.user.id;

        console.log("🔍 Update Profile Debug:");
        console.log("User ID:", id);
        console.log("Request Data:", { firstName, lastName, dateOfBirth, about, contactNumber, gender });

        // Find user and populate profile
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const user = userDetails;
        let profile = userDetails.additionalDetails;

        console.log("🔍 Profile exists:", profile ? "✅ Yes" : "❌ No");

        // FIX: Create profile if it doesn't exist
        if (!profile) {
            console.log("🔧 Creating new profile for user");
            profile = await Profile.create({
                gender: null,
                dateOfBirth: null,
                about: null,
                contactNumber: null,
            });
            
            // Link the new profile to user
            user.additionalDetails = profile._id;
        }

        // Update user fields
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;

        // Update profile fields safely
        if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
        if (about !== undefined) profile.about = about;
        if (contactNumber !== undefined) profile.contactNumber = contactNumber;
        if (gender !== undefined) profile.gender = gender;

        // Save both documents
        await user.save();
        await profile.save();

        // Return updated user with populated profile
        const updatedUserDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();

        console.log("🔍 Profile updated successfully");

        return res.json({
            success: true,
            message: "Profile updated successfully",
            updatedUserDetails,
        });
        
    } catch (error) {
        console.error("🔍 Profile update error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update profile",
            error: error.message,
        });
    }
};

// how can we schedule the delete op[ration 
exports.deleteAccount=async (req,res)=>{
        try{
            //  get id 
            const id=req.user.id;

            // vallidation
            console.log("printing ID: ",id);
            const userDetails=await User.findById({_id:id});
            if(!userDetails){
                return res.status(404).json({
                    success:false,
                    message:"User not found "
                });
            }
            //delete profile
            await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
            // delete user  
            await User.findByIdAndDelete({_id:id});
            return res.status(200).json({
                success:true,
                message:"user deleted successfully ",
                profileDetails,
            });
        }catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to delete profile ",
            error:error.message, 
        })
    }
}

exports.getAllUserDetails= async(req,res)=>{
    try{

        // get id
        const id=req.user.id;
        // validation and get userDetails
        const userDetails=await User.findById(id).populate("additionalDetails").exec();
        console.log(userDetails);
        // return response
        return res.status(200).json({
            success:true,
            message:"user data fetched successfully ",
            data:userDetails,
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to fetch all user details ",
            error:error.message, 
        })
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};