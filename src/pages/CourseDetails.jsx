import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { courseEndpoints, studentEndpoints } from "../services/apis";
import { useSelector } from "react-redux";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await apiConnector("POST", courseEndpoints.COURSE_DETAILS_API, { courseId });
      if (response.data.success) {
        setCourse(response.data.courseDetails);
      }
    } catch (error) {
      // ...existing code...
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCourse = async () => {
    try {
      const response = await apiConnector("POST", studentEndpoints.COURSE_PAYMENT_API, { courses: [courseId] });
      // TODO: Integrate Razorpay/Stripe payment gateway here
      alert("Payment flow would start here!");
      // On success, redirect to enrolled courses
      navigate("/dashboard/enrolled-courses");
    } catch (error) {
      alert("Payment failed!");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="p-8">
      <img src={course.thumbnail} alt={course.courseName} className="w-full h-64 object-cover rounded" />
      <h1 className="text-2xl font-bold mt-4">{course.courseName}</h1>
      <p className="mt-2 text-gray-700">{course.courseDescription}</p>
      <div className="mt-4 font-bold text-xl">₹{course.price}</div>
      <button onClick={handleBuyCourse} className="mt-6 px-6 py-3 bg-yellow-400 rounded font-semibold">Buy Now</button>
    </div>
  );
};

export default CourseDetails;
