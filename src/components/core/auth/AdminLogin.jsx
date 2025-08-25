
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../services/apiConnector";

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        adminId: "",
        passcode: ""
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log("🔍 Admin login attempt:", { adminId: formData.adminId, passcode: "****" });
        
        if (!formData.adminId || !formData.passcode) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        
        try {
            console.log("📡 Making API request to:", "/api/v1/auth/admin-login");
            console.log("📤 Request data:", formData);
            
            const response = await apiConnector("POST", "/api/v1/auth/admin-login", formData);
            
            console.log("📥 API Response:", response.data);
            
            if (response.data.success) {
                // Store admin data
                localStorage.setItem("adminToken", response.data.token);
                localStorage.setItem("admin", JSON.stringify(response.data.admin));
                
                console.log("✅ Admin login successful, navigating to dashboard");
                toast.success("Admin login successful");
                
                // Navigate to admin dashboard
                navigate("/admin/dashboard");
            } else {
                console.log("❌ Login failed:", response.data.message);
                toast.error(response.data.message || "Login failed");
            }
        } catch (error) {
            console.error("❌ Admin login error:", error);
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            
            // Better error handling
            if (error.response?.status === 404) {
                toast.error("Admin login endpoint not found. Please check server configuration.");
            } else if (error.response?.status === 401) {
                toast.error("Invalid admin credentials");
            } else if (error.response?.status === 500) {
                toast.error("Server error. Please try again.");
            } else if (error.code === 'ECONNREFUSED') {
                toast.error("Cannot connect to server. Please check if server is running.");
            } else {
                toast.error(error?.response?.data?.message || "Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-richblack-900 to-richblack-800">
            <div className="max-w-md w-full mx-4">
                <div className="bg-richblack-800 p-8 rounded-xl shadow-2xl border border-richblack-700">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-richblack-900" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Admin Login</h2>
                        <p className="text-richblack-200">Access the administrative dashboard</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-richblack-5 mb-2">
                                Admin ID
                            </label>
                            <input
                                type="text"
                                name="adminId"
                                value={formData.adminId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-white placeholder-richblack-400 focus:ring-2 focus:ring-yellow-50 focus:border-yellow-50 transition duration-200"
                                placeholder="Enter Admin ID"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-richblack-5 mb-2">
                                Passcode
                            </label>
                            <input
                                type="password"
                                name="passcode"
                                value={formData.passcode}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-white placeholder-richblack-400 focus:ring-2 focus:ring-yellow-50 focus:border-yellow-50 transition duration-200"
                                placeholder="Enter Passcode"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg font-semibold text-richblack-900 transition duration-200 ${
                                loading
                                    ? "bg-richblack-600 cursor-not-allowed"
                                    : "bg-yellow-50 hover:bg-yellow-25 focus:ring-2 focus:ring-yellow-50"
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-richblack-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </div>
                            ) : (
                                "Login to Dashboard"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-richblack-400">
                            Secure administrative access only
                        </p>
                        
                        {/* Development info */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-4 p-3 bg-richblack-700 rounded-lg">
                                <p className="text-xs text-richblack-300">
                                    Dev Mode: admin123 / securepass123
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;