import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {GiNinjaStar} from "react-icons/gi"
import ReactStars from "react-rating-stars-component";
import {RiDeleteBin6Line} from "react-icons/ri"
import { removeFromCart } from '../../../../slices/cartSlice';


function RenderCartCourses() {

    const {Cart} = useSelector((state)=>state.cart);
    const dispatch=useDispatch();

  return (
    <div>
      {
        Cart.map((courses,index)=>(
            <div>
                <div>
                    <img src={courses?.thumbnail} alt="" />
                
                <div>
                    <p>
                        {courses?.courseName}
                    </p>
                    <p>{courses?.Category?.name}</p>
                    <div>
                            <span>4.8</span>
                            <ReactStars
                                count={5}
                                size={20}
                                edit={false}
                                activeColor="#ffd700"
                                emtpyIcon={<GiNinjaStar />}
                                fullIcon={<GiNinjaStar />}
                            /> 

                            <span>{courses?.ratingAndReviews?.length} Ratings</span>

                        </div>
                </div>
                </div>

                <div>
                    <button
                    onClick={() => dispatch(removeFromCart(courses._id))}
                    >
                        <RiDeleteBin6Line/>
                        <span>Remove</span>
                    </button>

                    <p>Rs {courses?.price} </p>
                </div>
            </div>
        ))
      }
    </div>
  )
}

export default RenderCartCourses
