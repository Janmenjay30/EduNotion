const {instance }=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail")
const mongoose=require("mongoose");


// capture the payment and initiate the razorpat order

exports.capturePayments= async(req,res)=>{
    // get course id and user id
    const {course_id}=req.body;
    const userId=req.user.id;
    // validation 
    // valid course id
    if(!course_id){
        return res.status.json({
            success:true,
            message:"Please Provide valid course ID ",
        })

    };
    // valid course details
    let course;
    try{
        course=await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:"could not find the course",
            })
            
            } 
        // user already pay for the same course

        const uid=new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.json({
                success:true,
                message:"Student is already enrolled",
            });
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
            
        })
    }
   
    // order create 
    const amount=course.price;
    const currency="INR";

    const options={
        amount:amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId,
        }

    };


    try{
        // initiate the payment using razorpay
        const paymentResponse=await instance.orders.create(options);
        console.log(paymentResponse);

        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.first_payment_min_amount,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"could not initiate order",
            
        })
    }
    // return response

};

// verify signature of razorpay and server

exports.verifySignature=async (req,res)=>{
    const webhooksecret="12345678";

    const signature=req.headers("x-razorpay-signature");

    const shasum= crypto.createHmac("sha256",webhooksecret);
    shasum.update(JSON.stringify(req.body));
    const digest=shasum.digest("hex");

    if(signature==digest){
        console.log("Payment is authorissed");

        const {courseId,userId}=req.body.payload.payment.entity.notes;

        try{
            // find the course and enroll the student in it

            const enrolledCourse=await Course.findOneAndUpdate(
                                                {id:courseId},
                                                {$push:{studentsEnrolled:userId}},
                                                {new:true},
            );
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found",
                });

            }
            
            console.log(enrolledCourse);

            // find the student and add the course in enrolled course

            const enrolledStudent= await User.findOneAndUpdate(
                                                {_id:userId},
                                                {$push:{courses:courseId}},
                                                {new:true},
            );
            console.log(enrolledStudent);

            // mail send karo confirmation ki
            const emailResponse=await mailSender(
                                enrolledStudent.email,
                                "Congratualation you are successfully enrolled into a new course"
            );
            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"Signature verified and course added"
            })

        }catch(error){
                console.log(error);
                return res.status(500).json({
                    success:false,
                    message:error.message,
                });
        }
    }
    else{
        return res.status(400).json({
            success:true,
            message:"invalid request",
        })
    }


};