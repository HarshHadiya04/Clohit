const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Basic authentication middleware
module.exports = function auth(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Role-based authorization middleware
module.exports.requireRole = function(roles) {
    return async function(req, res, next) {
        try {
            const user = await User.findById(req.user.userId);
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            
            if (!user.isActive) {
                return res.status(403).json({ message: 'Account is deactivated' });
            }
            
            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
            }
            
            req.currentUser = user;
            next();
        } catch (err) {
            return res.status(500).json({ message: 'Authorization error' });
        }
    };
};

// Admin-only middleware
module.exports.requireAdmin = function(req, res, next) {
    return module.exports.requireRole(['admin'])(req, res, next);
};

// Customer-only middleware
module.exports.requireCustomer = function(req, res, next) {
    return module.exports.requireRole(['customer', 'admin'])(req, res, next);
};
