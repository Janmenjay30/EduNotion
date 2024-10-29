import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseCategories,editCourseDetails,addCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import ChipInput from './ChipInput';
import Upload from '../Upload';
import RequirementsField from './RequirementsField';
import {setStep,setCourse} from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import { MdNavigateNext } from "react-icons/md";
import toast from 'react-hot-toast';
import { COURSE_STATUS } from '../../../../../utils/constants';


function CourseInformationForm() {
    
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors},
    }=useForm();

    const dispatch=useDispatch();
    const { token } = useSelector((state) => state.auth)
    const {course,editCourse}=useSelector((state)=>state.course);
    const [loading,setLoading]=useState(false);
    const [courseCategories, setCourseCategories] = useState([]);

    useEffect(()=>{
        const getCategories=async()=>{
            setLoading(true);
            const Categories=await fetchCourseCategories();
            if(Categories.length>0){
              setCourseCategories(Categories);
            }
            setLoading(false);
        }

        console.log("course is " ,course);
        if(editCourse && course){
            setValue("courseTitle",course.courseName);
            setValue("courseShortDesc",course.courseDescription);
            setValue("coursePrice",course.price);
            setValue("courseTags",course.tag);
            setValue("courseBenefits",course.whatYouWillLearn);
            setValue("courseCategory",course.category);
            setValue("courseRequirements",course.instruction);
            setValue("courseImage",course.thumbnail);
            

        }

        getCategories();
    },[editCourse,course])

    const isFormUpdated=()=>{
      // if(!course) return false;
      const currentValues=getValues();
      if( currentValues.courseTitle!==course.courseName || 
          currentValues.courseShortDesc!==course.courseDescription || 
          currentValues.coursePrice!==course.price || 
          currentValues.courseTags.toString() !==course.tag.toString() || 
          currentValues.courseBenefits !== course.whatYouWillLearn ||  
          currentValues.courseCategory!==course.category._id || 
          currentValues.courseRequirements.toString() !== course.instructions.toString()|| 
          currentValues.courseImage !== course.thumbnail
      ){
        return true;
      }
      else{
        return false;
      }
    }

    // handle next button click
    const onSubmit = async (data) => {
      // console.log(data)
      if (loading) return;
  
      if (editCourse) {
        // const currentValues = getValues()
        // console.log("changes after editing form values:", currentValues)
        // console.log("now course:", course)
        // console.log("Has Form Changed:", isFormUpdated())
        if (isFormUpdated()) {
          const currentValues = getValues()
          const formData = new FormData()
          // console.log(data)
          formData.append("courseId", course._id)
          if (currentValues.courseTitle !== course.courseName) {
            formData.append("courseName", data.courseTitle)
          }
          if (currentValues.courseShortDesc !== course.courseDescription) {
            formData.append("courseDescription", data.courseShortDesc)
          }
          if (currentValues.coursePrice !== course.price) {
            formData.append("price", data.coursePrice)
          }
          if (currentValues.courseTags.toString() !== course.tag.toString()) {
            formData.append("tag", JSON.stringify(data.courseTags))
          }
          if (currentValues.courseBenefits !== course.whatYouWillLearn) {
            formData.append("whatYouWillLearn", data.courseBenefits)
          }
          if (currentValues.courseCategory._id !== course.category?._id) {
            formData.append("category", data.courseCategory)
          }
          if (
            currentValues.courseRequirements.toString() !==
            course.instructions.toString()
          ) {
            formData.append(
              "instructions",
              JSON.stringify(data.courseRequirements)
            )
          }
          if (currentValues.courseImage !== course.thumbnail) {
            formData.append("thumbnailImage", data.courseImage)
          }
          // console.log("Edit Form data: ", formData)
          setLoading(true)
          const result = await editCourseDetails(formData, token)
          setLoading(false)
          if (result) {
            dispatch(setStep(2))
            dispatch(setCourse(result))
          }
        } else {
          toast.error("No changes made to the form")
        }
        return
      }
  
      const formData = new FormData()
      formData.append("courseName", data.courseTitle)
      formData.append("courseDescription", data.courseShortDesc)
      formData.append("price", data.coursePrice)
      formData.append("tag", JSON.stringify(data.courseTags))
      formData.append("whatYouWillLearn", data.courseBenefits)
      formData.append("category", data.courseCategory)
      formData.append("status", COURSE_STATUS.DRAFT)
      formData.append("instructions", JSON.stringify(data.courseRequirements))
      formData.append("thumbnailImage", data.courseImage)
      setLoading(true)
      const result = await addCourseDetails(formData, token)
      if (result) {
        dispatch(setStep(2))
        dispatch(setCourse(result))
      }
      setLoading(false)
    }
  

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)} className='rounded-md border-r-richblue-700 bg-richblack-800 p-6 space-y-8' >
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseTitle">Course Title<sup>*</sup> </label>
            <input type="text" id='courseTitle' placeholder='Enter Course Title' 
            {
                ...register("courseTitle",{required:true})
            } className='w-full text-black form-style' />
            {
                errors.courseTitle&& (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is required*</span>
                )
            }
        </div>
        
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">Course Short Description<sup>*</sup></label>
            <textarea id='courseShortDesc' placeholder='Enter Description '
            {...register('courseShortDesc',{required:true})} className="form-style text-black resize-x-none min-h-[130px] w-full"/>

            {
                errors.courseShortDesc && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Description is required**</span>
                )
            }
        </div>

        <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full text-black !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2">
  <label className="text-sm text-richblack-5" htmlFor="courseCategory">
    Course Category<sup>*</sup>{" "}
  </label>
  <select
    className="form-style w-full text-black"
    id="courseCategory"
    {...register("courseCategory", { required: true })}
  >
    <option value="" disabled selected>
      Choose a Category
    </option>
    {courseCategories.length > 0 &&
      courseCategories.map((category) => (
        <option key={category?._id} value={category?._id}>
          {category?.name}
        </option>
      ))}
  </select>
  {errors.courseCategory && (
    <span className="ml-2 text-xs tracking-wide text-pink-200">
      Course Category is required
    </span>
  )}
</div>

        
        {/* Course Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />
      {/* Benefits of the course */}
      <div>
        <label htmlFor="">Benefits of the course</label>
        <textarea  id="coursebenefits" placeholder='Enter benefits of the course' 
        {...register("courseBenefits",{required:true})} className='min-h-[130px] w-full text-black ' ></textarea>


        {
            errors.courseBenefits && (
                <span>
                    Benefits of the course is required**
                </span>
            )
        }
      </div>
      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      <div className="flex justify-end gap-x-2">
        {
          editCourse && (
            <button onClick={()=>dispatch(setStep(2))} disabled={loading} className='flex items-center gap-x-2 bg-richblack-900'>
              Continue without saving
            </button>
          )
        }

        <IconBtn
        disabled={loading}
        text={!editCourse ? "Next" : "Save Changes"}>
        <MdNavigateNext />
        </IconBtn>
      </div>

    </form>
  )
}

export default CourseInformationForm
