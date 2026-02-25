const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllUsers, deleteUser } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

// GET /api/users/profile
router.get('/profile', auth, getProfile);

// PUT /api/users/profile
router.put('/profile', auth, updateProfile);

// GET /api/users (admin only)
router.get('/', auth, authorize('admin'), getAllUsers);

// DELETE /api/users/:id (admin only)
router.delete('/:id', auth, authorize('admin'), deleteUser);

module.exports = router;
