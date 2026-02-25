const express = require('express');
const router = express.Router();
const { register, login, getMe, verifyEmail, registerValidation, loginValidation } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');

// POST /api/auth/register
router.post('/register', registerValidation, validate, register);

// POST /api/auth/login
router.post('/login', loginValidation, validate, login);

// GET /api/auth/me
router.get('/me', auth, getMe);

// GET /api/auth/verify-email/:token
router.get('/verify-email/:token', verifyEmail);

module.exports = router;
