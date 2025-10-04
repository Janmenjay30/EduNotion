import React, { useEffect, useState } from "react";
import { apiConnector } from "../services/apiConnector";
import { profileEndpoints } from "../services/apis";
import { Link } from "react-router-dom";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await apiConnector("GET", profileEndpoints.GET_USER_ENROLLED_COURSES_API);
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      // ...existing code...
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Enrolled Courses</h1>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Link to={`/view-course/${course._id}`} key={course._id}>
              <div className="border rounded-lg p-4 hover:shadow-lg">
                <img src={course.thumbnail} alt={course.courseName} className="w-full h-40 object-cover rounded" />
                <h2 className="mt-2 text-lg font-semibold">{course.courseName}</h2>
                <div className="mt-2 font-bold">Progress: {course.progressPercentage || 0}%</div>
                <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Continue Learning</button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
