const User = require('../models/User');

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ user });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user's profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
    try {
        const allowedFields = [
            'name', 'age', 'gender', 'location', 'fitnessGoals',
            'preferredWorkoutTime', 'experienceLevel', 'hobbies',
            'motivation', 'profilePicture', 'bio'
        ];

        // Filter only allowed fields
        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        );

        // Check if profile is complete after update
        user.isProfileComplete = user.checkProfileComplete();
        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        const query = search
            ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
            : {};

        const users = await User.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.json({
            users,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (admin only)
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Change a user's role (admin only)
 * @access  Private/Admin
 */
const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!['user', 'gymOwner', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be user, gymOwner, or admin' });
        }
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: `Role updated to ${role}`, user });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/users/location
 * @desc    Update user's GPS coordinates (from browser geolocation)
 * @access  Private
 */
const updateUserLocation = async (req, res, next) => {
    try {
        const { latitude, longitude } = req.body;
        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'latitude and longitude are required' });
        }
        await User.findByIdAndUpdate(req.user._id, {
            coordinates: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
        });
        res.json({ message: 'Location updated' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAllUsers,
    deleteUser,
    updateUserRole,
    updateUserLocation
};
