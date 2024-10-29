import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../services/operations/authAPI';
import { useLocation } from 'react-router-dom';
import { FaEyeSlash , FaEye } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { BiArrowBack } from "react-icons/bi";



function UpdatePassword() {
    const {loading} =useSelector((state)=>state.auth);
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);
    const dispatch=useDispatch();
    const location=useLocation();
    const [formData,setFormData]=useState(
        {
            password:"",
            confirmPassword:"",
        }
    );
    const handleOnChange=(e)=>{
        setFormData((prevData)=>(
            {
                ...prevData,
                [e.target.name]:e.target.value,
            }
            
        ))
    }
    const {password,confirmPassword}=formData;
    const handleOnSubmit=(e)=>{
        e.preventDefault();
        const token=location.pathname.split("/").at(-1);
        dispatch(resetPassword(password,confirmPassword,token));
    }


  return (
    <div className='text-white grid min-h-[calc(100vh-3.5rem)] place-items-center'>
        {
            loading ? (
                <div className='spinner'>Loading...</div>
            ):(
                <div className='max-w-[500px] p-4 lg:p-8'>
                    <h1 className='text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5'>Choose New Password</h1>
                    <p className='my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100'>Almost done. Enter your new password and you are all set</p>
                    <form onSubmit={handleOnSubmit}>
                        <label className='relative mt-3 block'>
                            <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>New Password</p>
                            <input className='form-style text-black w-full placeholder-gray-400 focus:placeholder-blue-500 !pr-10' type={showPassword ? "text" : "password"} name='password' value={password} onChange={handleOnChange}
                            placeholder='New Password' required />
                            <span className="absolute right-3 top-[32px] z-10 cursor-pointer text-black" onClick={()=>setShowPassword((prev)=>!prev)}>
                                {
                                    showPassword ? <FaEyeSlash /> : <FaEye />
                                }
                            </span>
                        </label>
                        <label className='relative mt-3 block'>
                            <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>Confirm New Password</p>
                            <input className='form-style text-black w-full placeholder-gray-400 focus:placeholder-blue-500 !pr-10' type={showConfirmPassword ? "text" : "password"} name='confirmPassword' value={confirmPassword} onChange={handleOnChange}
                            placeholder=' Confirm New Password' required />
                            <span className="absolute right-3 top-[32px] z-10 cursor-pointer text-black" onClick={()=>setShowConfirmPassword((prev)=>!prev)}>
                                {
                                    showConfirmPassword ? <FaEyeSlash /> : <FaEye />
                                }
                            </span>
                        </label>
                        <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              Reset Password
            </button>
                    </form>
                    <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
                </div>
            )
        }
      
    </div>
  )
}

export default UpdatePassword;
