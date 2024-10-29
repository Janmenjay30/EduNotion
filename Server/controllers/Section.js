// const section = require("../models/section");
const Section=require("../models/section");
const Course=require("../models/Course");
const SubSection=require("../models/subSection");

exports.createSection = async(req,res)=>{
    try{
        // data fetch 
        const {sectionName,courseId}=req.body;
        // data validation 
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }
        // create section
        const newSection=await Section.create({sectionName});

        // update course with section ObjectId
        const updatedCourseDetails=await Course.findByIdAndUpdate(
                                                    courseId,
                                                {
                                                    $push:{
                                                        courseContent:newSection._id,
                                                    }
                                                },{new:true},)
                                                .populate({
                                                    path:"courseContent",
                                                    populate:{
                                                        path:"subSection"
                                                    },
                                                })
                                                .exec();
        
        //homeWork-use populate to replace section and subsection both in updatedCOurseDeils 
        // return response
        return res.status(200).json({
            success:true,
            message:"Section created successfully", 
            updatedCourseDetails,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to craete section ",
             
        })
    }
}

exports.updateSection=async(req,res)=>{
    try{
        
        // data input
        const {sectionName,sectionId,courseId}=req.body;

        // data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }

        // data update
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec() 
      // console.log(course, " is course");
        // return response
        return res.status(200).json({
            success:true,
            message:"Section updated  successfully", 
            data:course,
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to update section ", 
        })
    }
}

exports.deleteSection= async(req,res)=>{
    try {
        const { sectionId, courseId } = req.body
        await Course.findByIdAndUpdate(courseId, {
          $pull: {
            courseContent: sectionId,
          },
        })
        const section = await Section.findById(sectionId)
        console.log(sectionId, courseId)
        if (!section) {
          return res.status(404).json({
            success: false,
            message: "Section not found",
          })
        }
        // Delete the associated subsections
        await SubSection.deleteMany({ _id: { $in: section.subSection } })
    
        await Section.findByIdAndDelete(sectionId)
    
        // find the updated course and return it
        const course = await Course.findById(courseId)
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()
    
        res.status(200).json({
          success: true,
          message: "Section deleted",
          data: course,
        })
      } catch (error) {
        console.error("Error deleting section:", error)
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        })
      }
}