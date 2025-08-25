import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../../services/apiConnector";

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [pendingInstructors, setPendingInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            
            // Fetch stats and pending instructors
            const [statsResponse, instructorsResponse] = await Promise.all([
                apiConnector("GET", "/api/v1/auth/admin/stats", null, {
                    Authorization: `Bearer ${token}`,
                }),
                apiConnector("GET", "/api/v1/auth/admin/pending-instructors", null, {
                    Authorization: `Bearer ${token}`,
                })
            ]);

            if (statsResponse.data.success) {
                setStats(statsResponse.data.stats);
            }

            if (instructorsResponse.data.success) {
                setPendingInstructors(instructorsResponse.data.data);
            }
        } catch (error) {
            console.error("Dashboard data fetch error:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        setActionLoading(userId);
        try {
            const token = localStorage.getItem("adminToken");
            const response = await apiConnector(
                "POST", 
                "/api/v1/auth/admin/approve-instructor", 
                { userId },
                { Authorization: `Bearer ${token}` }
            );

            if (response.data.success) {
                toast.success("Instructor approved successfully!");
                // Remove from pending list
                setPendingInstructors(prev => prev.filter(instructor => instructor._id !== userId));
                // Update stats
                setStats(prev => ({
                    ...prev,
                    approvedInstructors: prev.approvedInstructors + 1,
                    pendingInstructors: prev.pendingInstructors - 1
                }));
            }
        } catch (error) {
            console.error("Approve error:", error);
            toast.error(error?.response?.data?.message || "Failed to approve instructor");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (userId) => {
        const reason = prompt("Enter reason for rejection (optional):");
        
        setActionLoading(userId);
        try {
            const token = localStorage.getItem("adminToken");
            const response = await apiConnector(
                "POST", 
                "/api/v1/auth/admin/reject-instructor", 
                { userId, reason },
                { Authorization: `Bearer ${token}` }
            );

            if (response.data.success) {
                toast.success("Instructor application rejected");
                // Remove from pending list
                setPendingInstructors(prev => prev.filter(instructor => instructor._id !== userId));
                // Update stats
                setStats(prev => ({
                    ...prev,
                    pendingInstructors: prev.pendingInstructors - 1,
                    totalInstructors: prev.totalInstructors - 1,
                    totalUsers: prev.totalUsers - 1
                }));
            }
        } catch (error) {
            console.error("Reject error:", error);
            toast.error(error?.response?.data?.message || "Failed to reject instructor");
        } finally {
            setActionLoading(null);
        }
    };

    const logout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        toast.success("Logged out successfully");
        window.location.href = "/admin/login";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-50"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-richblack-900">
            {/* Header */}
            <div className="bg-richblack-800 border-b border-richblack-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                            <p className="text-richblack-300">Manage StudyNotion Platform</p>
                        </div>
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                        <h3 className="text-lg font-semibold text-richblack-5 mb-2">Total Users</h3>
                        <p className="text-3xl font-bold text-yellow-50">{stats.totalUsers || 0}</p>
                    </div>
                    <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                        <h3 className="text-lg font-semibold text-richblack-5 mb-2">Students</h3>
                        <p className="text-3xl font-bold text-green-400">{stats.totalStudents || 0}</p>
                    </div>
                    <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                        <h3 className="text-lg font-semibold text-richblack-5 mb-2">Approved Instructors</h3>
                        <p className="text-3xl font-bold text-blue-400">{stats.approvedInstructors || 0}</p>
                    </div>
                    <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                        <h3 className="text-lg font-semibold text-richblack-5 mb-2">Pending Approval</h3>
                        <p className="text-3xl font-bold text-orange-400">{stats.pendingInstructors || 0}</p>
                    </div>
                </div>

                {/* Pending Instructors */}
                <div className="bg-richblack-800 rounded-lg border border-richblack-700">
                    <div className="px-6 py-4 border-b border-richblack-700">
                        <h2 className="text-xl font-bold text-white">Pending Instructor Approvals</h2>
                        <p className="text-richblack-300 mt-1">
                            {pendingInstructors.length} instructor(s) waiting for approval
                        </p>
                    </div>

                    <div className="p-6">
                        {pendingInstructors.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🎉</div>
                                <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
                                <p className="text-richblack-400">No pending instructor approvals at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {pendingInstructors.map((instructor) => (
                                    <div key={instructor._id} className="bg-richblack-700 p-6 rounded-lg border border-richblack-600">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={instructor.image}
                                                    alt={instructor.firstName}
                                                    className="w-16 h-16 rounded-full"
                                                />
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">
                                                        {instructor.firstName} {instructor.lastName}
                                                    </h3>
                                                    <p className="text-richblack-300">{instructor.email}</p>
                                                    <p className="text-sm text-richblack-400">
                                                        Applied: {new Date(instructor.createdAt).toLocaleDateString()}
                                                    </p>
                                                    {instructor.additionalDetails?.about && (
                                                        <p className="text-sm text-richblack-300 mt-2">
                                                            {instructor.additionalDetails.about}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleApprove(instructor._id)}
                                                    disabled={actionLoading === instructor._id}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50"
                                                >
                                                    {actionLoading === instructor._id ? "Approving..." : "Approve"}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(instructor._id)}
                                                    disabled={actionLoading === instructor._id}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50"
                                                >
                                                    {actionLoading === instructor._id ? "Rejecting..." : "Reject"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;