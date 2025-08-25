const User = require("../models/User");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const validator = require("validator");
const xss = require("xss");
require("dotenv").config();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: "Too many authentication attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Input sanitization helper
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return xss(validator.escape(input.trim()));
};

// Validate password strength
const validatePasswordStrength = (password) => {
    const minLength = 6;
    // const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
        isValid: password.length >= minLength  && hasLowerCase && hasNumbers && hasSpecialChar,
        message: `Password must be at least ${minLength} characters with uppercase, lowercase, numbers, and special characters`
    };
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

// Sign up with enhanced security
exports.signUp = async (req, res) => {
    try {
        // Extract and sanitize input data
        let {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        // Sanitize string inputs to prevent XSS
        firstName = sanitizeInput(firstName);
        lastName = sanitizeInput(lastName);
        email = sanitizeInput(email);
        accountType = sanitizeInput(accountType);
        contactNumber = sanitizeInput(contactNumber);
        otp = sanitizeInput(otp);

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // Normalize email
        email = validator.normalizeEmail(email);

        // Validate password strength
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: passwordValidation.message,
            });
        }

        // Password match validation
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match",
            });
        }

        // Validate account type
        const validAccountTypes = ['Student', 'Instructor'];
        if (!validAccountTypes.includes(accountType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account type",
            });
        }

        // Validate contact number if provided
        if (contactNumber && !validator.isMobilePhone(contactNumber, 'any')) {
            return res.status(400).json({
                success: false,
                message: "Invalid contact number format",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already registered",
            });
        }

        // Find and validate OTP
        const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        
        if (recentOTP.length === 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found or expired",
            });
        }

        if (otp !== recentOTP[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Hash password with increased rounds for security
        const hashedPassword = await bcrypt.hash(password, 12);

        // Set approval status
        const approved = accountType === "Instructor" ? false : true;

        // Create profile
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: contactNumber || null,
        });

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            approved,
            additionalDetails: profileDetails._id,
            image: `https://avatar.iran.liara.run/username?username=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName)}`
        });

        // Clean response (no sensitive data)
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accountType: user.accountType,
            approved: user.approved,
            additionalDetails: user.additionalDetails,
            image: user.image
        };

        // Delete used OTP
        await OTP.deleteOne({ email, otp });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userResponse,
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again.",
        });
    }
};

// Login with enhanced security
exports.login = async (req, res) => {
    try {
        // Extract and sanitize input
        let { email, password } = req.body;
        email = sanitizeInput(email);

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // Normalize email
        email = validator.normalizeEmail(email);

        // Find user with account status check
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Check if instructor is approved
        if (user.accountType === "Instructor" && !user.approved) {
            return res.status(403).json({
                success: false,
                message: "Your instructor account is pending approval",
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate secure JWT token
        const token = generateSecureToken({
            email: user.email,
            id: user._id,
            accountType: user.accountType
        });

        // Secure cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        // Clean user response
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accountType: user.accountType,
            approved: user.approved,
            additionalDetails: user.additionalDetails,
            courses: user.courses,
            image: user.image
        };

        // Set secure cookie and respond
        res.cookie("token", token, cookieOptions).status(200).json({
            success: true,
            token,
            user: userResponse,
            message: "Login successful",
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again.",
        });
    }
};

// Send OTP with enhanced security
exports.sendOTP = async (req, res) => {
    try {
        // Extract and sanitize email
        let { email } = req.body;
        email = sanitizeInput(email);

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // Normalize email
        email = validator.normalizeEmail(email);

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already registered",
            });
        }

        // Check for recent OTP requests (rate limiting)
        const recentOTP = await OTP.findOne({ 
            email, 
            createdAt: { $gte: new Date(Date.now() - 60000) } // Last 1 minute
        });

        if (recentOTP) {
            return res.status(429).json({
                success: false,
                message: "Please wait before requesting a new OTP",
            });
        }

        // Generate secure OTP
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Ensure OTP uniqueness
        let existingOTP = await OTP.findOne({ otp });
        while (existingOTP) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            existingOTP = await OTP.findOne({ otp });
        }

        // Save OTP to database
        await OTP.create({ email, otp });

        // Response (no OTP in production)
        const responseData = {
            success: true,
            message: "OTP sent successfully",
        };

        // Only include OTP in development for testing
        if (process.env.NODE_ENV === 'development') {
            responseData.otp = otp;
        }

        return res.status(200).json(responseData);

    } catch (error) {
        console.error("Send OTP error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP. Please try again.",
        });
    }
};

// Change password with enhanced security
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        let { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Validate required fields
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Validate new password strength
        const passwordValidation = validatePasswordStrength(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: passwordValidation.message,
            });
        }

        // Check password match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New passwords do not match",
            });
        }

        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Verify old password
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Check if new password is different from old password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password",
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        // Send notification email
        try {
            await mailSender(
                user.email,
                "Password Updated - StudyNotion",
                passwordUpdated(
                    user.email,
                    `Password updated successfully for ${user.firstName} ${user.lastName}`
                )
            );
        } catch (emailError) {
            console.error("Email notification failed:", emailError);
            // Continue execution - don't fail password change due to email failure
        }

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });

    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update password. Please try again.",
        });
    }
};

// Export rate limiter for use in routes
exports.authLimiter = authLimiter;