const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/signup (Customer signup)
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = await User.create({ 
            name, 
            email, 
            password: hashed,
            role: 'customer' // Default role
        });

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET || 'dev_secret', 
            { expiresIn: '7d' }
        );
        
        res.status(201).json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,
                role: user.role
            } 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET || 'dev_secret', 
            { expiresIn: '7d' }
        );
        
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,
                role: user.role
            } 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/admin-signup (Admin signup - protected)
router.post('/admin-signup', requireAdmin, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = await User.create({ 
            name, 
            email, 
            password: hashed,
            role: 'admin'
        });

        res.status(201).json({ 
            message: 'Admin user created successfully',
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,
                role: user.role
            } 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/auth/profile (Get current user profile)
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/auth/profile (Update user profile)
router.put('/profile', async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email && email !== user.email) {
            const existing = await User.findOne({ email });
            if (existing) {
                return res.status(409).json({ message: 'Email already in use' });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;
        await user.save();

        res.json({ 
            message: 'Profile updated successfully',
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,
                role: user.role
            } 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
