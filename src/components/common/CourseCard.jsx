import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiConnector } from "../../services/apiConnector";
import { profileEndpoints } from "../../services/apis";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);

  // Fallback data for better UI demonstration
  const courseData = {
    _id: course._id || "sample-id",
    courseName: course.courseName || "Complete Web Development Bootcamp",
    courseDescription: course.courseDescription || "Learn modern web development with React, Node.js, MongoDB, and Express. Build real-world projects and master full-stack development.",
    thumbnail: course.thumbnail || "/api/placeholder/400/240",
    price: course.price || "2999",
    instructor: course.instructor || { 
      firstName: "John", 
      lastName: "Doe" 
    },
    courseContent: course.courseContent || new Array(8).fill({}),
    studentsEnrolled: course.studentsEnrolled || new Array(145).fill({}),
    ratingAndReviews: course.ratingAndReviews || { averageRating: 4.5, totalReviews: 89 }
  };

  // Check if user is enrolled in this course
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (!token || !user) return;
      
      setCheckingEnrollment(true);
      try {
        const response = await apiConnector("GET", profileEndpoints.GET_USER_ENROLLED_COURSES_API);
        if (response.data.success) {
          const enrolledCourses = response.data.data;
          const isAlreadyEnrolled = enrolledCourses.some(enrolledCourse => 
            enrolledCourse._id === courseData._id
          );
          setIsEnrolled(isAlreadyEnrolled);
        }
      } catch (error) {
        console.error("Error checking enrollment status:", error);
        // For demo purposes, assume not enrolled if API fails
        setIsEnrolled(false);
      } finally {
        setCheckingEnrollment(false);
      }
    };

    checkEnrollmentStatus();
  }, [token, user, courseData._id]);

  const handleEnrollNow = (e) => {
    e.preventDefault(); // Prevent card click
    e.stopPropagation(); // Prevent event bubbling

    if (!token) {
      alert('You need to be logged in to enroll in courses. Redirecting to login page...');
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    if (user?.accountType === "Instructor") {
      // Instructors can't enroll in courses
      alert("Instructors cannot enroll in courses. Please use a student account.");
      return;
    }

    if (isEnrolled) {
      // If already enrolled, redirect to the course
      navigate(`/view-course/${courseData._id}`);
      return;
    }

    // If not enrolled, redirect to payment
    navigate(`/payment/${courseData._id}`);
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on the enroll button
    if (e.target.closest('button')) return;
    navigate(`/courses/${courseData._id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group block transform hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      <div className="bg-richblack-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-richblack-700 hover:border-yellow-400 transition-all duration-300">
        {/* Course Thumbnail */}
        <div className="relative overflow-hidden">
          <img 
            src={courseData.thumbnail} 
            alt={courseData.courseName} 
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "/api/placeholder/400/240";
            }}
          />
          
          {/* Overlay with gradient for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-richblack-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-400 text-richblack-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              BESTSELLER
            </span>
          </div>

          {/* Course Duration Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-richblack-800/90 text-richblack-5 px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm">
              12+ hours
            </span>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          {/* Course Title */}
          <h3 className="text-xl font-bold text-richblack-5 mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors leading-tight">
            {courseData.courseName}
          </h3>

          {/* Course Description */}
          <p className="text-richblack-200 text-sm mb-4 line-clamp-3 leading-relaxed">
            {courseData.courseDescription}
          </p>

          {/* Instructor Info */}
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm font-bold text-richblack-900">
                {courseData.instructor?.firstName?.charAt(0) || "I"}
              </span>
            </div>
            <div>
              <p className="text-richblack-5 text-sm font-medium">
                {courseData.instructor?.firstName} {courseData.instructor?.lastName}
              </p>
              <p className="text-richblack-300 text-xs">
                Course Instructor
              </p>
            </div>
          </div>

          {/* Course Stats */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1 text-richblack-300">
                <span className="text-yellow-400">⭐</span>
                <span className="font-semibold">4.5</span>
                <span className="text-richblack-400">(89)</span>
              </span>
              <span className="flex items-center space-x-1 text-richblack-300">
                <span>📚</span>
                <span>{courseData.courseContent?.length || 0} sections</span>
              </span>
            </div>
            <span className="text-caribbeangreen-300 text-xs font-medium">
              {courseData.studentsEnrolled?.length || 0} enrolled
            </span>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-4 border-t border-richblack-700">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-yellow-400">
                ₹{courseData.price}
              </span>
              <span className="text-richblack-400 text-sm line-through">
                ₹{Math.round(courseData.price * 1.5)}
              </span>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-richblack-300 hover:text-yellow-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </button>
              <button 
                onClick={handleEnrollNow}
                disabled={checkingEnrollment}
                className={`px-4 py-2 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg ${
                  checkingEnrollment 
                    ? 'bg-richblack-600 text-richblack-400 cursor-not-allowed' 
                    : isEnrolled
                      ? 'bg-caribbeangreen-400 text-richblack-900 hover:bg-caribbeangreen-300'
                      : 'bg-yellow-400 text-richblack-900 hover:bg-yellow-300'
                }`}
              >
                {checkingEnrollment ? 'Checking...' : isEnrolled ? 'Go to Course' : 'Enroll Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar for enrolled courses (if applicable) */}
        {course.isEnrolled && (
          <div className="px-6 pb-4">
            <div className="bg-richblack-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-caribbeangreen-300 to-caribbeangreen-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress || 35}%` }}
              ></div>
            </div>
            <p className="text-xs text-richblack-300 mt-1">
              {course.progress || 35}% Complete
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
