const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/matches');
const ticketRoutes = require('./routes/tickets');
const gymRoutes = require('./routes/gyms');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');

const app = express();

// Connect to MongoDB
connectDB();

// Rate limiting — relaxed for development (dashboard alone makes 4+ concurrent API calls)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: { message: 'Too many requests, please try again later.' }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api/', limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/gyms', gymRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'GymBuddy API is running',
        timestamp: new Date().toISOString()
    });
});

// API docs endpoint
app.get('/api', (req, res) => {
    res.json({
        name: 'GymBuddy API',
        version: '1.0.0',
        endpoints: {
            auth: {
                'POST /api/auth/register': 'Register a new user',
                'POST /api/auth/login': 'Login and get JWT',
                'GET /api/auth/me': 'Get current user (auth required)'
            },
            users: {
                'GET /api/users/profile': 'Get profile (auth required)',
                'PUT /api/users/profile': 'Update profile (auth required)'
            },
            matches: {
                'GET /api/matches': 'Get compatible matches (auth required)',
                'POST /api/matches/request': 'Send match request (auth required)',
                'POST /api/matches/respond': 'Accept/reject match (auth required)'
            },
            tickets: {
                'POST /api/tickets/create': 'Create collaboration ticket (auth required)',
                'GET /api/tickets': 'Get user tickets (auth required)',
                'PUT /api/tickets/update-status': 'Update ticket status (auth required)'
            },
            gyms: {
                'GET /api/gyms': 'Browse gyms (public)',
                'GET /api/gyms/:id': 'Get gym details (public)',
                'POST /api/gyms': 'Create gym (gym owner)',
                'PUT /api/gyms/:id': 'Update gym (gym owner)'
            },
            notifications: {
                'GET /api/notifications': 'Get notifications (auth required)',
                'PUT /api/notifications/:id/read': 'Mark notification read (auth required)'
            },
            admin: {
                'GET /api/admin/stats': 'Platform stats (admin)',
                'GET /api/admin/users': 'List all users (admin)',
                'DELETE /api/admin/users/:id': 'Delete user (admin)'
            }
        }
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 GymBuddy API running on port ${PORT}`);
    console.log(`📋 API docs: http://localhost:${PORT}/api`);
});

module.exports = app;
