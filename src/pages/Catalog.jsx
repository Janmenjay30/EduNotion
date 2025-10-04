import React, { useEffect, useState } from "react";
import { apiConnector } from "../services/apiConnector";
import { courseEndpoints } from "../services/apis";
import CourseCard from "../components/common/CourseCard";

const Catalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    // Filter courses based on search term
    const filtered = courses.filter(course =>
      course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [courses, searchTerm]);

  const fetchCourses = async () => {
    try {
      const response = await apiConnector("GET", courseEndpoints.GET_ALL_COURSE_API);
      if (response.data.success) {
        setCourses(response.data.data);
      } else {
        // If API returns success: false, show empty courses
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Show empty courses instead of sample data
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-yellow-50 border-t-yellow-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-richblack-5 text-lg font-medium">Loading amazing courses...</p>
          <p className="text-richblack-300 text-sm">Please wait while we fetch the best courses for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-richblack-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform rotate-45"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Discover Amazing <span className="text-yellow-300">Courses</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Explore our comprehensive collection of courses designed to help you master new skills, 
              advance your career, and unlock your potential.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                />
                <svg className="w-6 h-6 text-white/70 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold text-richblack-5 mb-2">
              {searchTerm ? "No courses found" : "No courses available yet"}
            </h3>
            <p className="text-richblack-200">
              {searchTerm 
                ? `Try searching for something else or clear your search.`
                : "Check back soon for exciting new courses!"
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-6 py-2 bg-yellow-400 text-richblack-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
              <div>
                <h2 className="text-3xl font-bold text-richblack-5 mb-2">
                  {searchTerm ? `Search Results (${filteredCourses.length})` : `All Courses (${filteredCourses.length})`}
                </h2>
                {searchTerm && (
                  <p className="text-richblack-300">
                    Showing results for "<span className="text-yellow-400 font-semibold">{searchTerm}</span>"
                  </p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <select className="px-4 py-2 bg-richblack-800 text-richblack-5 border border-richblack-700 rounded-lg hover:bg-richblack-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <option>All Categories</option>
                  <option>Web Development</option>
                  <option>Data Science</option>
                  <option>Marketing</option>
                </select>
                <select className="px-4 py-2 bg-richblack-800 text-richblack-5 border border-richblack-700 rounded-lg hover:bg-richblack-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <option>Sort by Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Catalog;
