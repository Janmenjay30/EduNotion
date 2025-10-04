import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { studentEndpoints, courseEndpoints } from "../services/apis";

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.accountType === "Instructor") {
      alert("Instructors cannot enroll in courses. Please use a student account.");
      navigate("/catalog");
      return;
    }

    fetchCourseDetails();
  }, [courseId, token, user, navigate]);

  const fetchCourseDetails = async () => {
    try {
      const response = await apiConnector("POST", courseEndpoints.COURSE_DETAILS_API, { courseId });
      if (response.data.success) {
        setCourse(response.data.data.courseDetails);
      } else {
        // Course not found
        setCourse(null);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      // Don't show sample data for payment - course must exist in database
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setPaymentLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load. Please try again.");
        setPaymentLoading(false);
        return;
      }

      // Create payment order
      const response = await apiConnector("POST", studentEndpoints.COURSE_PAYMENT_API, {
        course_id: courseId
      });

      if (!response.data.success) {
        alert("Failed to create payment order. Please try again.");
        setPaymentLoading(false);
        return;
      }

      const { orderId, currency, amount } = response.data;

      // Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY, // Add this to your .env file
        currency: currency,
        amount: amount,
        order_id: orderId,
        name: "StudyNotion",
        description: `Payment for ${course.courseName}`,
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        handler: function (response) {
          // Payment successful
          verifyPayment(response);
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await apiConnector("POST", studentEndpoints.COURSE_VERIFY_API, {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        courses: [courseId]
      });

      if (response.data.success) {
        // Send payment success email
        await apiConnector("POST", studentEndpoints.SEND_PAYMENT_SUCCESS_EMAIL_API, {
          orderId: paymentResponse.razorpay_order_id,
          paymentId: paymentResponse.razorpay_payment_id,
          amount: course.price
        });

        alert("Payment successful! You are now enrolled in the course.");
        navigate("/dashboard/enrolled-courses");
      } else {
        alert("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      alert("Payment verification failed. Please contact support.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-yellow-50 border-t-yellow-400 rounded-full animate-spin"></div>
          <p className="text-richblack-5 text-lg font-medium">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-richblack-5 mb-4">Course Not Found</h2>
          <p className="text-richblack-300 mb-6">The course you're trying to purchase doesn't exist.</p>
          <button
            onClick={() => navigate("/catalog")}
            className="px-6 py-3 bg-yellow-400 text-richblack-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-richblack-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-richblack-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 px-6">
            <h1 className="text-3xl font-bold text-white text-center">Complete Your Enrollment</h1>
            <p className="text-blue-100 text-center mt-2">Secure payment powered by Razorpay</p>
          </div>

          <div className="p-8">
            {/* Course Details */}
            <div className="bg-richblack-700 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-richblack-5 mb-4">Course Details</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-richblack-5 mb-2">{course.courseName}</h3>
                  <p className="text-richblack-300 mb-4">{course.courseDescription}</p>
                  <div className="flex items-center space-x-4 text-sm text-richblack-300">
                    <span>Instructor: {course.instructor?.firstName} {course.instructor?.lastName}</span>
                  </div>
                </div>
                <div className="md:w-64">
                  <div className="bg-richblack-600 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">₹{course.price}</div>
                    <div className="text-richblack-400 text-sm line-through">₹{Math.round(course.price * 1.5)}</div>
                    <div className="text-caribbeangreen-300 text-sm font-medium">Save {Math.round(((course.price * 1.5 - course.price) / (course.price * 1.5)) * 100)}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-richblack-700 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-richblack-5 mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-richblack-300">
                  <span>Course Fee</span>
                  <span>₹{course.price}</span>
                </div>
                <div className="flex justify-between text-richblack-300">
                  <span>Platform Fee</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-richblack-300">
                  <span>Tax</span>
                  <span>₹0</span>
                </div>
                <hr className="border-richblack-600" />
                <div className="flex justify-between text-xl font-bold text-richblack-5">
                  <span>Total Amount</span>
                  <span>₹{course.price}</span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="text-center">
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                  paymentLoading
                    ? 'bg-richblack-600 text-richblack-400 cursor-not-allowed'
                    : 'bg-yellow-400 text-richblack-900 hover:bg-yellow-300 hover:scale-105 shadow-lg'
                }`}
              >
                {paymentLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-richblack-400 border-t-richblack-900 rounded-full animate-spin"></div>
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  `Pay ₹${course.price} & Enroll Now`
                )}
              </button>
              <p className="text-richblack-400 text-sm mt-4">
                Secure payment powered by Razorpay. Your payment information is encrypted and secure.
              </p>
              
              {/* Razorpay Payment Button */}
              <form className="mt-4">
                <script 
                  src="https://checkout.razorpay.com/v1/payment-button.js" 
                  data-payment_button_id="pl_RPQQgAfcAHFWTJ" 
                  async
                ></script>
              </form>
            </div>

            {/* Cancel Button */}
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/catalog")}
                className="text-richblack-400 hover:text-richblack-200 transition-colors"
              >
                Cancel and return to catalog
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;