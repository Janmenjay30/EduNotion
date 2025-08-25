const User = require("../models/User");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSender");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const xss = require("xss");
require("dotenv").config();

// Input sanitization helper
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return xss(validator.escape(input.trim()));
};

// Generate secure JWT token
const generateSecureToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: "24h",
            issuer: "StudyNotion",
            audience: "StudyNotion-Users"
        }
    );
};

// Admin login with ID and passcode
exports.adminLogin = async (req, res) => {
    try {
        let { adminId, passcode } = req.body;
        
        // Sanitize inputs
        adminId = sanitizeInput(adminId);

        // Validate required fields
        if (!adminId || !passcode) {
            return res.status(400).json({
                success: false,
                message: "Admin ID and passcode are required",
            });
        }

        // Check admin credentials
        const validAdminId = process.env.ADMIN_ID || "admin123";
        const validPasscode = process.env.ADMIN_PASSCODE || "securepass123";

        if (adminId !== validAdminId || passcode !== validPasscode) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials",
            });
        }

        // Generate admin JWT token
        const token = generateSecureToken({
            adminId,
            id: "admin",
            accountType: "Admin",
            role: "admin"
        });

        // Secure cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        // Admin response
        const adminResponse = {
            adminId,
            accountType: "Admin",
            role: "admin",
            loginTime: new Date()
        };

        res.cookie("adminToken", token, cookieOptions).status(200).json({
            success: true,
            token,
            admin: adminResponse,
            message: "Admin login successful",
        });

    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({
            success: false,
            message: "Admin login failed. Please try again.",
        });
    }
};

// Get pending instructors for admin approval
exports.getPendingInstructors = async (req, res) => {
    try {
        const pendingInstructors = await User.find({
            accountType: 'Instructor',
            approved: false
        }).select('-password').populate('additionalDetails');

        return res.status(200).json({
            success: true,
            data: pendingInstructors,
            count: pendingInstructors.length,
            message: `Found ${pendingInstructors.length} pending instructor(s)`
        });

    } catch (error) {
        console.error("Get pending instructors error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending instructors"
        });
    }
};

// Approve instructor
exports.approveInstructor = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Find instructor
        const instructor = await User.findById(userId);
        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }

        if (instructor.accountType !== 'Instructor') {
            return res.status(400).json({
                success: false,
                message: "User is not an instructor"
            });
        }

        if (instructor.approved) {
            return res.status(400).json({
                success: false,
                message: "Instructor already approved"
            });
        }

        // Approve instructor
        instructor.approved = true;
        await instructor.save();

        // Send approval email
        try {
            const approvalEmailTemplate = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
                        <h1>🎉 Account Approved!</h1>
                    </div>
                    <div style="padding: 30px; background: #f9f9f9;">
                        <p style="font-size: 16px; line-height: 1.6;">Dear ${instructor.firstName} ${instructor.lastName},</p>
                        
                        <p style="font-size: 16px; line-height: 1.6;">
                            Congratulations! Your instructor account on <strong>StudyNotion</strong> has been approved.
                        </p>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                            <h3 style="color: #333; margin: 0 0 10px 0;">✅ What's Next?</h3>
                            <ul style="color: #666; line-height: 1.8;">
                                <li>Login to your instructor dashboard</li>
                                <li>Create and upload your courses</li>
                                <li>Set course prices and descriptions</li>
                                <li>Start teaching and earning!</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
                               style="background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                Login to Dashboard
                            </a>
                        </div>
                        
                        <p style="font-size: 14px; color: #666; line-height: 1.6;">
                            If you have any questions, feel free to contact our support team.
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6;">
                            Best regards,<br>
                            <strong>The StudyNotion Team</strong>
                        </p>
                    </div>
                    <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
                        © ${new Date().getFullYear()} StudyNotion. All rights reserved.
                    </div>
                </div>
            `;

            await mailSender(
                instructor.email,
                "🎉 Your StudyNotion Instructor Account is Approved!",
                approvalEmailTemplate
            );
        } catch (emailError) {
            console.error("Approval email failed:", emailError);
            // Continue - don't fail approval due to email failure
        }

        return res.status(200).json({
            success: true,
            message: "Instructor approved successfully",
            instructor: {
                _id: instructor._id,
                firstName: instructor.firstName,
                lastName: instructor.lastName,
                email: instructor.email,
                approved: instructor.approved
            }
        });

    } catch (error) {
        console.error("Approve instructor error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to approve instructor"
        });
    }
};

// Reject instructor
exports.rejectInstructor = async (req, res) => {
    try {
        const { userId, reason } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Find instructor
        const instructor = await User.findById(userId);
        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }

        if (instructor.accountType !== 'Instructor') {
            return res.status(400).json({
                success: false,
                message: "User is not an instructor"
            });
        }

        // Send rejection email
        try {
            const rejectionEmailTemplate = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #dc3545; color: white; padding: 20px; text-align: center;">
                        <h1>Application Update</h1>
                    </div>
                    <div style="padding: 30px; background: #f9f9f9;">
                        <p style="font-size: 16px; line-height: 1.6;">Dear ${instructor.firstName} ${instructor.lastName},</p>
                        
                        <p style="font-size: 16px; line-height: 1.6;">
                            We regret to inform you that your instructor application on StudyNotion has not been approved at this time.
                        </p>
                        
                        ${reason ? `
                        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
                            <strong>Reason:</strong> ${reason}
                        </div>
                        ` : ''}
                        
                        <p style="font-size: 16px; line-height: 1.6;">
                            You can reapply after addressing the mentioned concerns or contact our support team for more information.
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6;">
                            Best regards,<br>
                            <strong>The StudyNotion Team</strong>
                        </p>
                    </div>
                </div>
            `;

            await mailSender(
                instructor.email,
                "StudyNotion Instructor Application Update",
                rejectionEmailTemplate
            );
        } catch (emailError) {
            console.error("Rejection email failed:", emailError);
        }

        // Delete the instructor account
        await User.findByIdAndDelete(userId);
        // Also delete associated profile
        if (instructor.additionalDetails) {
            await Profile.findByIdAndDelete(instructor.additionalDetails);
        }

        return res.status(200).json({
            success: true,
            message: "Instructor application rejected and account removed"
        });

    } catch (error) {
        console.error("Reject instructor error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reject instructor"
        });
    }
};

// Get admin dashboard stats
exports.getAdminStats = async (req, res) => {
    try {
        // Get various statistics
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ accountType: 'Student' });
        const totalInstructors = await User.countDocuments({ accountType: 'Instructor' });
        const approvedInstructors = await User.countDocuments({ accountType: 'Instructor', approved: true });
        const pendingInstructors = await User.countDocuments({ accountType: 'Instructor', approved: false });
        
        // Get recent registrations (last 7 days)
        const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentRegistrations = await User.countDocuments({ 
            createdAt: { $gte: lastWeek } 
        });

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalStudents,
                totalInstructors,
                approvedInstructors,
                pendingInstructors,
                recentRegistrations
            }
        });

    } catch (error) {
        console.error("Get admin stats error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin statistics"
        });
    }
};