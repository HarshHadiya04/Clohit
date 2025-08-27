const express = require('express');
const { requireCustomer } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const MenProduct = require('../models/MenProduct');
const WomenProduct = require('../models/WomenProduct');
const Inventory = require('../models/Inventory');

const router = express.Router();

// Apply customer middleware to all routes
router.use(requireCustomer);

// ===== PROFILE MANAGEMENT =====

// GET /api/customer/profile - Get customer profile
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.currentUser._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/customer/profile - Update customer profile
router.put('/profile', async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const user = await User.findById(req.currentUser._id);
        
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
        user.phone = phone || user.phone;
        user.address = address || user.address;
        
        await user.save();

        res.json({ 
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ===== ORDER MANAGEMENT =====

// POST /api/customer/orders - Create new order
router.post('/orders', async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, notes } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }

        if (!shippingAddress) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }

        // Calculate totals and validate stock
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const { productId, productModel, quantity } = item;
            
            // Get product details
            const ProductModel = productModel === 'MenProduct' ? MenProduct : WomenProduct;
            const product = await ProductModel.findById(productId);
            
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${productId}` });
            }

            // Check inventory
            const inventory = await Inventory.findOne({ productId, productModel });
            if (!inventory || inventory.availableQuantity < quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${product.Brand} - ${product.Description}` 
                });
            }

            const price = parseFloat(product.Price);
            const totalPrice = price * quantity;
            subtotal += totalPrice;

            orderItems.push({
                productId,
                productModel,
                productName: product.Description,
                productImage: product.Image,
                brand: product.Brand,
                price,
                quantity,
                totalPrice
            });

            // Reserve stock
            await Inventory.reserveStock(productId, productModel, quantity);
        }

        const shipping = subtotal > 1000 ? 0 : 100; // Free shipping above ₹1000
        const tax = subtotal * 0.18; // 18% GST
        const total = subtotal + shipping + tax;

        const order = new Order({
            user: req.currentUser._id,
            items: orderItems,
            subtotal,
            shipping,
            tax,
            total,
            shippingAddress,
            paymentMethod: paymentMethod || 'cod',
            notes,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });

        const savedOrder = await order.save();

        res.status(201).json({
            message: 'Order created successfully',
            order: savedOrder
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/customer/orders - Get customer's order history
router.get('/orders', async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        
        let query = { user: req.currentUser._id };
        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('user', 'name email');

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

// GET /api/customer/orders/:id - Get specific order details
router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.currentUser._id
        }).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/customer/orders/:id/cancel - Cancel order
router.put('/orders/:id/cancel', async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.currentUser._id
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ 
                message: 'Order cannot be cancelled. It has already been processed.' 
            });
        }

        // Release reserved stock
        for (const item of order.items) {
            await Inventory.releaseReservedStock(
                item.productId, 
                item.productModel, 
                item.quantity
            );
        }

        order.status = 'cancelled';
        await order.save();

        res.json({ 
            message: 'Order cancelled successfully',
            order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ===== SHOPPING CART (Session-based) =====

// GET /api/customer/cart - Get cart items (from session/localStorage)
router.get('/cart', async (req, res) => {
    try {
        // This would typically come from session or localStorage
        // For now, we'll return an empty cart
        res.json({
            items: [],
            subtotal: 0,
            shipping: 0,
            tax: 0,
            total: 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/customer/cart/add - Add item to cart
router.post('/cart/add', async (req, res) => {
    try {
        const { productId, productModel, quantity = 1 } = req.body;
        
        // Validate product exists
        const ProductModel = productModel === 'MenProduct' ? MenProduct : WomenProduct;
        const product = await ProductModel.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check stock availability
        const inventory = await Inventory.findOne({ productId, productModel });
        if (!inventory || inventory.availableQuantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // In a real app, this would be stored in session/database
        res.json({
            message: 'Item added to cart',
            item: {
                productId,
                productModel,
                productName: product.Description,
                productImage: product.Image,
                brand: product.Brand,
                price: parseFloat(product.Price),
                quantity,
                totalPrice: parseFloat(product.Price) * quantity
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ===== PRODUCT SEARCH & FILTERS =====

// GET /api/customer/products/search - Search products
router.get('/products/search', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, brand, page = 1, limit = 12 } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        
        // Search query
        if (q) {
            query.$or = [
                { Brand: { $regex: q, $options: 'i' } },
                { Description: { $regex: q, $options: 'i' } }
            ];
        }

        // Category filter
        if (category) {
            // This would filter by category if you have categories
        }

        // Price range
        if (minPrice || maxPrice) {
            query.Price = {};
            if (minPrice) query.Price.$gte = parseFloat(minPrice);
            if (maxPrice) query.Price.$lte = parseFloat(maxPrice);
        }

        // Brand filter
        if (brand) {
            query.Brand = { $regex: brand, $options: 'i' };
        }

        const [menProducts, womenProducts] = await Promise.all([
            MenProduct.find(query).skip(skip).limit(parseInt(limit)),
            WomenProduct.find(query).skip(skip).limit(parseInt(limit))
        ]);

        const [totalMen, totalWomen] = await Promise.all([
            MenProduct.countDocuments(query),
            WomenProduct.countDocuments(query)
        ]);

        const allProducts = [
            ...menProducts.map(p => ({ ...p.toObject(), category: 'men' })),
            ...womenProducts.map(p => ({ ...p.toObject(), category: 'women' }))
        ];

        res.json({
            products: allProducts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil((totalMen + totalWomen) / limit),
                totalProducts: totalMen + totalWomen,
                hasNext: skip + allProducts.length < (totalMen + totalWomen),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/customer/products/featured - Get featured products
router.get('/products/featured', async (req, res) => {
    try {
        const [menProducts, womenProducts] = await Promise.all([
            MenProduct.find().limit(6),
            WomenProduct.find().limit(6)
        ]);

        res.json({
            menProducts,
            womenProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
