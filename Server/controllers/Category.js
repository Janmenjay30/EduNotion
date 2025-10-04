const Category=require("../models/Category");
const Course = require("../models/Course");
const { login } = require("./Auth");
// janmenjay



// create category handller

exports.createCategory=async (req,res)=>{
    try{
        const {name,description}=req.body;

        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            })
        }

        // create  entry in DB
        const categoryDetails=await Category.create({
            name:name,
            description:description,

        });
        // console.log(categoryDetails);

        return res.status(200).json({
            success:true,
            message:"category created Successfully",
        })
    }catch(error){

        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

exports.showAllCategories = async (req, res) => {
    try {
      const allCategories = await Category.find();// Populating courses if needed
      res.status(200).json({
        success: true,
        data: allCategories,
      });
      // console.log("allcategories : ", allCategories);
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required',
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if category has courses
    if (category.course && category.course.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing courses',
      });
    }

    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// category page details 
exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
  
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .exec()
  
      console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
      console.log()
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
  
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }
  