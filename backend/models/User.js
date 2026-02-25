const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Model
 * Supports roles: user, gymOwner, admin
 * Contains fitness profile fields for matching algorithm
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false // Don't include password in queries by default
    },
    role: {
        type: String,
        enum: ['user', 'gymOwner', 'admin'],
        default: 'user'
    },
    age: {
        type: Number,
        min: 16,
        max: 80
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    location: {
        city: { type: String, trim: true },
        area: { type: String, trim: true }
    },
    fitnessGoals: [{
        type: String,
        enum: ['weight-loss', 'muscle-gain', 'general-fitness', 'flexibility', 'endurance', 'strength']
    }],
    preferredWorkoutTime: {
        type: String,
        enum: ['early-morning', 'morning', 'afternoon', 'evening', 'night']
    },
    experienceLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    hobbies: [{ type: String, trim: true }],
    motivation: {
        type: String,
        trim: true,
        maxlength: 500
    },
    profilePicture: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 300
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerifyToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Check if profile is complete
userSchema.methods.checkProfileComplete = function () {
    return !!(this.age && this.gender && this.location?.city &&
        this.fitnessGoals?.length > 0 && this.preferredWorkoutTime &&
        this.experienceLevel);
};

module.exports = mongoose.model('User', userSchema);
