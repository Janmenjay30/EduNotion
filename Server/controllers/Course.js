const Course=require("../models/Course");
const Tag=require("../models/Category");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../utils/imageUploader");
const Category = require("../models/Category");
const Section=require("../models/section");
const SubSection = require("../models/subSection");
const CourseProgress = require("../models/courseProgress");

// Function to convert seconds to duration string
function convertSecondsToDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let duration = '';
  if (hours > 0) duration += `${hours}h `;
  if (minutes > 0) duration += `${minutes}m `;
  if (seconds > 0) duration += `${seconds}s`;

  return duration.trim();
}

// craeteCourse handller function
exports.createCourse=async(req,res)=>{
    try{
        // fetch data
        let {courseName,courseDescription,whatYouWillLearn,price,tag,category
            ,status,instructions,
        }=req.body;
        
        // get thumbnail
        const thumbnail= req.files.thumbnailImage;

        // validation
        if(!courseName?.trim() || !courseDescription?.trim() || !whatYouWillLearn?.trim() || !price || !tag || !thumbnail
            || !category)
            {
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        // Validate price
        if(price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Course price must be greater than 0",
            });
        }
        if (!status || status === undefined) {
			status = "Draft";
		}
        // check for instructor
        const userId=req.user.id;
        
        const instructorDetails=await User.findOne({
            _id: userId,
            accountType: "Instructor",
        });
        // console.log("instructor details: ",instructorDetails);
        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"instructor details not found", 

            });
        }

        // check tag is valid or not 
        const categoryDetails=await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"category details not found ",
            })
        }
        // console.log("category details: ",categoryDetails);

        // Upload image to cloudinary
        let thumbnailImage;
        try {
            thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        } catch (error) {
            console.log("Error uploading thumbnail:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to upload thumbnail image",
                error: error.message,
            });
        }
        
        // create an entry for new course
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tag,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            status:status,
            instructions:instructions,
        }) 

        // add the new course to user schema of instructor

        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true},
        );
        // Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
		);
        
        return res.status(200).json(
            {
                success:true,
                message:"Course Created successfully",
                data:newCourse,
            }
        );
         



    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create course",
            error:error.message,
        })
    }
}

// Edit Course Details
exports.editCourse = async (req, res) => {
  console.log("🚀 EditCourse API is called")
  try {
    console.log("📋 Request Body:", req.body);
    console.log("📁 Files:", req.files);

    const { courseId } = req.body;
    
    if (!courseId) {
      console.log("❌ No courseId provided");
      return res.status(400).json({ 
        success: false, 
        error: "Course ID is required" 
      });
    }

    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      console.log("❌ Course not found for ID:", courseId);
      return res.status(404).json({ 
        success: false, 
        error: "Course not found" 
      });
    }

    console.log("✅ Course found, processing updates...");

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("🖼️ Processing thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      
      if (thumbnail) {
        console.log("📤 Uploading thumbnail to Cloudinary...");
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        );
        course.thumbnail = thumbnailImage.secure_url;
        console.log("✅ Thumbnail updated successfully");
      }
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();
    console.log("💾 Course saved successfully");

    const updatedCourse = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    console.log("✅ Edit course completed successfully");
    return res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("❌ Error updating course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// getAll Courses

exports.showAllCourses=async (req,res)=>{
    try{
        const allCourses=await  Course.find({},{courseName:true,price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentsEnrolled:true,
        }).populate("instructor")
        
        .exec();
        return res.status(200).json({
			success: true,
			data: allCourses,
		});
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to fetch course",
            error:error.message,
        })
    }
};

// getcourse details
exports.getCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
            select: "-videoUrl",
          },
        })
        .exec()
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  // Get a list of Course for a given Instructor
  exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }
  // Delete the Course
  exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }
