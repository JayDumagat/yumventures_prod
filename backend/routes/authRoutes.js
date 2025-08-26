const express = require("express");
const router = express.Router();

const {
  loginWithUsername,
  registerUser,
  logoutUser,
  getSession,
  getEmailCode,
  validateVerificationCode,
  resetUserPassword,
    updateUserProfile
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const userValidationSchema = require("../validators/userValidationSchema");
const validateRequest = require("../middlewares/validateRequest");
const upload = require("../middlewares/upload");

router.post("/login", validateRequest, userValidationSchema, loginWithUsername);

router.post("/register", validateRequest, userValidationSchema, registerUser);

router.post('/logout', logoutUser)

router.get('/session', authMiddleware, getSession)

router.post("/request-code", getEmailCode);

router.post("/validate-code", validateVerificationCode);

router.post("/reset-password", resetUserPassword);

router.put("/profile", authMiddleware, upload.single('profileImage'), updateUserProfile);


module.exports = router;
