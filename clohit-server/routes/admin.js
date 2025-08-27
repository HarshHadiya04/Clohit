const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const MenProduct = require('../models/MenProduct');
const WomenProduct = require('../models/WomenProduct');
const User = require('../models/User');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');

const router = express.Router();

// Apply admin middleware to all routes
router.use(requireAdmin);

// ===== PRODUCT MANAGEMENT =====

// GET /api/admin/products - Get all products (men + women)
router.get('/products', async (req, res) => {
    try {
        const [menProducts, womenProducts] = await Promise.all([
            MenProduct.find(),
            WomenProduct.find()
        ]);
        
        res.json({
            menProducts,
            womenProducts,
            total: menProducts.length + womenProducts.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/admin/products/men - Add men's product
router.post('/products/men', async (req, res) => {
    try {
        const product = new MenProduct(req.body);
        const savedProduct = await product.save();
        
        // Initialize inventory
        await Inventory.updateStock(savedProduct._id, 'MenProduct', 0, 'set');
        
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST /api/admin/products/women - Add women's product
router.post('/products/women', async (req, res) => {
    try {
        const product = new WomenProduct(req.body);
        const savedProduct = await product.save();
        
        // Initialize inventory
        await Inventory.updateStock(savedProduct._id, 'WomenProduct', 0, 'set');
        
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/admin/products/men/:id - Update men's product
router.put('/products/men/:id', async (req, res) => {
    try {
        const product = await MenProduct.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/admin/products/women/:id - Update women's product
router.put('/products/women/:id', async (req, res) => {
    try {
        const product = await WomenProduct.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/admin/products/men/:id - Delete men's product
router.delete('/products/men/:id', async (req, res) => {
    try {
        const product = await MenProduct.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Delete associated inventory
        await Inventory.findOneAndDelete({ productId: req.params.id, productModel: 'MenProduct' });
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/admin/products/women/:id - Delete women's product
router.delete('/products/women/:id', async (req, res) => {
    try {
        const product = await WomenProduct.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Delete associated inventory
        await Inventory.findOneAndDelete({ productId: req.params.id, productModel: 'WomenProduct' });
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ===== INVENTORY MANAGEMENT =====

// GET /api/admin/inventory - Get all inventory
router.get('/inventory', async (req, res) => {
    try {
        const inventory = await Inventory.find()
            .populate('productId', 'Brand Description Image Price')
            .sort({ lastUpdated: -1 });
        
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/inventory/:id - Update inventory
router.put('/inventory/:id', async (req, res) => {
    try {
        const { stockQuantity, lowStockThreshold } = req.body;
        const inventory = await Inventory.findById(req.params.id);
        
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }
        
        if (stockQuantity !== undefined) {
            inventory.stockQuantity = stockQuantity;
        }
        
        if (lowStockThreshold !== undefined) {
            inventory.lowStockThreshold = lowStockThreshold;
        }
        
        await inventory.save();
        res.json(inventory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/admin/inventory/low-stock - Get low stock items
router.get('/inventory/low-stock', async (req, res) => {
    try {
        const lowStockItems = await Inventory.find({
            $expr: { $lte: ['$availableQuantity', '$lowStockThreshold'] }
        }).populate('productId', 'Brand Description Image Price');
        
        res.json(lowStockItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/admin/inventory/bulk-update - Bulk update inventory
router.post('/inventory/bulk-update', async (req, res) => {
    try {
        const { updates } = req.body;
        const results = [];
        
        for (const update of updates) {
            const { productId, productModel, stockQuantity, operation = 'set' } = update;
            const inventory = await Inventory.updateStock(productId, productModel, stockQuantity, operation);
            results.push(inventory);
        }
        
        res.json({ message: 'Bulk update completed', results });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ===== ORDER MANAGEMENT =====

// GET /api/admin/orders - Get all orders
router.get('/orders', async (req, res) => {
    try {
        const { status, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const skip = (page - 1) * limit;
        
        let query = {};
        if (status) {
            query.status = status;
        }
        
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Order.countDocuments(query);
        
        res.json({
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalOrders: total,
                hasNext: skip + orders.length < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/orders/:id - Get specific order
router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone address');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/orders/:id/status - Update order status
router.put('/orders/:id/status', async (req, res) => {
    try {
        const { status, notes } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        order.status = status;
        if (notes) {
            order.notes = notes;
        }
        
        // If order is cancelled, release reserved stock
        if (status === 'cancelled' && order.status !== 'cancelled') {
            for (const item of order.items) {
                await Inventory.releaseReservedStock(
                    item.productId,
                    item.productModel,
                    item.quantity
                );
            }
        }
        
        // If order is shipped, update estimated delivery
        if (status === 'shipped') {
            order.estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
        }
        
        await order.save();
        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/admin/orders/:id/payment - Update payment status
router.put('/orders/:id/payment', async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        order.paymentStatus = paymentStatus;
        await order.save();
        
        res.json({ message: 'Payment status updated', order });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ===== USER MANAGEMENT =====

// GET /api/admin/users - Get all users
router.get('/users', async (req, res) => {
    try {
        const { role, isActive, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;
        
        let query = {};
        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await User.countDocuments(query);
        
        res.json({
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
                hasNext: skip + users.length < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/users/:id - Get specific user
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/users/:id - Update user (admin can change role, deactivate)
router.put('/users/:id', async (req, res) => {
    try {
        const { role, isActive, name, email, phone, address } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (role) user.role = role;
        if (typeof isActive === 'boolean') user.isActive = isActive;
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        await user.save();
        res.json({ 
            message: 'User updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ===== ADVANCED ANALYTICS =====

// GET /api/admin/analytics - Get comprehensive analytics
router.get('/analytics', async (req, res) => {
    try {
        const { period = '30' } = req.query; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));
        
        const [
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            recentOrders,
            lowStockCount,
            adminUsers,
            customerUsers,
            pendingOrders,
            completedOrders
        ] = await Promise.all([
            User.countDocuments(),
            MenProduct.countDocuments() + WomenProduct.countDocuments(),
            Order.countDocuments({ createdAt: { $gte: startDate } }),
            Order.aggregate([
                { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            Order.find({ createdAt: { $gte: startDate } })
                .populate('user', 'name email')
                .sort({ createdAt: -1 })
                .limit(10),
            Inventory.countDocuments({
                $expr: { $lte: ['$availableQuantity', '$lowStockThreshold'] }
            }),
            User.countDocuments({ role: 'admin' }),
            User.countDocuments({ role: 'customer' }),
            Order.countDocuments({ status: 'pending' }),
            Order.countDocuments({ status: 'delivered' })
        ]);
        
        // Calculate revenue
        const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
        
        // Get top selling products
        const topProducts = await Order.aggregate([
            { $unwind: '$items' },
            { $group: { _id: '$items.productId', totalSold: { $sum: '$items.quantity' } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);
        
        res.json({
            overview: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue: revenue,
                lowStockCount,
                adminUsers,
                customerUsers,
                pendingOrders,
                completedOrders
            },
            recentOrders,
            topProducts,
            period: `${period} days`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/analytics/revenue - Get revenue analytics
router.get('/analytics/revenue', async (req, res) => {
    try {
        const { period = '7' } = req.query; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));
        
        const dailyRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        res.json(dailyRevenue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/analytics/orders - Get order analytics
router.get('/analytics/orders', async (req, res) => {
    try {
        const orderStatusCounts = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        const monthlyOrders = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    orders: { $sum: 1 },
                    revenue: { $sum: '$total' }
                }
            },
            { $sort: { _id: -1 } },
            { $limit: 12 }
        ]);
        
        res.json({
            statusCounts: orderStatusCounts,
            monthlyOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
