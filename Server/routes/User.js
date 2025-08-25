const express = require("express");
const router = express.Router();

// Import controllers
const {
    login,
    signUp,
    sendOTP,
    changePassword,
} = require("../controllers/Auth");

// ADD: Import admin controllers
const {
    adminLogin,
    getPendingInstructors,
    approveInstructor,
    rejectInstructor,
    getAdminStats
} = require("../controllers/AdminAuth");

// Import middlewares
const { auth, isStudent, isInstructor, isAdmin, adminAuth } = require("../middlewares/auth");

// Regular auth routes
router.post("/login", login);
router.post("/signup", signUp);
router.post("/sendotp", sendOTP);
router.post("/changepassword", auth, changePassword);

// ADD: Admin routes
router.post("/admin-login", adminLogin);
router.get("/admin/pending-instructors", adminAuth, getPendingInstructors);
router.post("/admin/approve-instructor", adminAuth, approveInstructor);
router.post("/admin/reject-instructor", adminAuth, rejectInstructor);
router.get("/admin/stats", adminAuth, getAdminStats);

module.exports = router;