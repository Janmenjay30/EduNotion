const mongoose=require("mongoose");


const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    // Define the email field with type String, required, and trimmed
		email: {
			type: String,
			required: true,
			trim: true,
		},

    password:{
        type:String,
        required:true,
        
    },
    accountType:{
        type:String,
        required:true,
        enum:["Admin","Student","Instructor"],
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile"
    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        },
    ],
    image:{
        type:String,
        required:true
    },
    token:{
        type:String,

    },
    resetPasswordExpires:{
        type:Date,
    },
    courseProgress:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"courseProgress"
    },
    ],
},
{timestamps:true},
);

module.exports=mongoose.model("User",userSchema);