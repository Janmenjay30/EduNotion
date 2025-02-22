import React from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import { useState } from 'react';
import { IoAddCircleOutline } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux';
import { MdKeyboardArrowRight } from "react-icons/md";
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';
import toast from 'react-hot-toast';
import NestedView from './NestedView';


function CourseBuilderForm() {
    

    const {register,handleSubmit,setValue,formState:{errors}} = useForm();
    const [editSectionName,setEditSectionName]=useState(null);
    const {course}=useSelector((state)=>state.course);
    const dispatch=useDispatch();
    const [loading,setLoading]=useState(false);
    const {token}=useSelector((state)=>state.auth);

    const onSubmit = async (data) => {
        setLoading(true);
        let result;
     
        if(editSectionName) {
          //we are editing the secgtion name
          result = await updateSection(
            {
              sectionName: data.sectionName,
              sectionId: editSectionName,
              courseId: course._id,
            }, token
          )
        }
        else {
          result = await createSection({
            sectionName: data.sectionName,
            courseId: course._id,
          },token)
        }
    
        //update values
        if(result) {
          dispatch(setCourse(result));
          setEditSectionName(null);
          setValue("sectionName", "")
           
        }
    
        //loading false
        setLoading(false);
      }



    const goBack=()=>{
        dispatch(setStep(1));
        dispatch(setEditCourse(true));
    }
    const goToNext = () => {
      console.log('Current Course Content:', course.courseContent); // Debugging log
      if (course.courseContent.length === 0) {
          toast.error("Please add at least 1 section");
          return;
      }
      
      const hasEmptySections = course.courseContent.some((section) => section.subSection.length === 0);
      
      if (hasEmptySections) {
          toast.error("Please add at least 1 lecture in each section");
          return;
      }
  
      dispatch(setStep(3));
  }
    const cancelEdit=()=>{
        setEditSectionName(null);
        setValue("sectionName","");
    }
    
    const handleChangeEditSectionName=(sectionId,sectionName)=>{
        if(editSectionName===sectionId){
            cancelEdit();
            return;
        }
        setEditSectionName(sectionId);
        setValue("sectionName",sectionName);
    }
    

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form  onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
            <input id='sectionName'
            placeholder='Add a section to build your course'
            {...register("sectionName",{required:true})}
            className="form-style w-full"/>

            {
                errors.sectionName &&(
                  <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Section name is required
                </span>
                )
            }
        </div>

        <div  className="flex items-end gap-x-4">
            <IconBtn type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"} 
            outline={true}>
              <IoAddCircleOutline size={20} className="text-yellow-50" /> </IconBtn>
            {
                editSectionName && (
                    <button 
                    type='button'
                    onClick={cancelEdit}
                    className="text-sm text-richblack-300 underline">
                        Cancel Edits
                    </button>
                )
            }
        </div>

      </form>
      {
        course.courseContent.length>0 && (
            
                
            <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>

           

        )
      }

      <div className='flex justify-end gap-x-3'>
        <button onClick={goBack} className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
            Back
        </button>
        
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
        <MdKeyboardArrowRight />
        </IconBtn>
        
      </div>


    </div>
  )
}

export default CourseBuilderForm
