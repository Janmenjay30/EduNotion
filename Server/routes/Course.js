// Import the required modules
const express = require("express")
const router = express.Router()

const {
    getCourseDetails,
    showAllCourses,
    createCourse,
    editCourse,
    getInstructorCourses,
    deleteCourse,
}=require("../controllers/Course");

const {
    createCategory,
    
    categoryPageDetails,
    showAllCategories,
    

}=require("../controllers/Category");



const {
    updateSection,
    createSection,
    deleteSection,

}=require("../controllers/Section");

const {
    createSubSection,
    deleteSubSection,
    updateSubSection,

}=require("../controllers/Subsection");

const {
    createRating,
    getAverageRating,
    getAllRating,
  } = require("../controllers/RatingAndReview")


//   middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// routes
// course routes
// courses can only be created by instructor
router.post("/createCourse",auth,isInstructor,createCourse);
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
router.post("/addSection",auth,isInstructor,createSection);
router.post("/updateSection",auth,isInstructor,updateSection);
router.post("/deleteSection",auth,isInstructor,deleteSection);
router.post("/updateSubSection",auth,isInstructor,updateSubSection);
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection);
router.post("/addSubSection",auth,isInstructor,createSubSection);

// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)


router.get("/getAllCourses",showAllCourses);
router.post("/getCourseDetails",getCourseDetails);

// Delete a Course
router.delete("/deleteCourse", deleteCourse)

// Category details 
// category can only be created by admin
router.post("/createCategory",auth,isAdmin,createCategory);
router.get("/showAllCategories",showAllCategories);
router.post("/getCategoryPageDetails",categoryPageDetails);

// Rating and reviews

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews",getAllRating);

module.exports=router;


