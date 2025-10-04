import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { courseEndpoints } from "../services/apis";

const ViewCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseContent();
  }, [courseId]);

  const fetchCourseContent = async () => {
    try {
      const response = await apiConnector("POST", courseEndpoints.GET_FULL_COURSE_DETAILS_AUTHENTICATED, { courseId });
      if (response.data.success) {
        setCourse(response.data.courseDetails);
      }
    } catch (error) {
      // ...existing code...
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{course.courseName}</h1>
      <div className="mb-4">{course.courseDescription}</div>
      {/* Render course content/sections/subsections here */}
      <div>
        {course.courseContent?.map(section => (
          <div key={section._id} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{section.sectionName}</h2>
            <ul>
              {section.subSection?.map(sub => (
                <li key={sub._id} className="mb-2">
                  <div className="font-bold">{sub.title}</div>
                  <div>{sub.description}</div>
                  {sub.videoUrl && (
                    <video src={sub.videoUrl} controls className="w-full mt-2 rounded" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewCourse;
