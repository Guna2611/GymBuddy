const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body } = require('express-validator');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (role-aware: user vs gymOwner)
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        const userRole = role || 'user';

        // For gym owners, generate a verification token
        let emailVerifyToken = null;
        if (userRole === 'gymOwner') {
            emailVerifyToken = crypto.randomBytes(32).toString('hex');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: userRole,
            isEmailVerified: userRole === 'user', // Users auto-verified
            emailVerifyToken
        });

        // Send verification email for gym owners immediately
        if (userRole === 'gymOwner' && emailVerifyToken) {
            await sendVerificationEmail(user.email, user.name, emailVerifyToken);
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: userRole === 'gymOwner'
                ? 'Registration successful! Please check your email to verify your account.'
                : 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify gym owner email using token
 * @access  Public
 */
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ emailVerifyToken: token });
        if (!user) {
            // Check if already verified
            console.log('Verify-email: No user found with token. Token may be already used or invalid.');
            return res.status(400).json({ message: 'Invalid or expired verification token. It may have already been used.' });
        }

        console.log(`Verify-email: Found user ${user.email}, verifying...`);

        user.isEmailVerified = true;
        user.emailVerifyToken = null;
        await user.save();

        res.json({
            message: 'Email verified successfully! You can now manage your gym.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: true
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Block unverified gym owners
        if (user.role === 'gymOwner' && !user.isEmailVerified) {
            return res.status(403).json({
                message: 'Please verify your email before logging in. Check your inbox for the verification link.',
                needsVerification: true
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ user });
    } catch (error) {
        next(error);
    }
};

// Validation rules
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

module.exports = {
    register,
    login,
    getMe,
    verifyEmail,
    registerValidation,
    loginValidation
};
