const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clohit', {
	dbName: 'clohit'
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import Models
const MenProduct = require('./models/MenProduct');
const WomenProduct = require('./models/WomenProduct');
const User = require('./models/User');
const Order = require('./models/Order');
const Inventory = require('./models/Inventory');

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);

// ===== PUBLIC PRODUCT ROUTES =====

// Get all men's products
app.get('/api/men-products', async (req, res) => {
    try {
        const products = await MenProduct.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all women's products
app.get('/api/women-products', async (req, res) => {
    try {
        const products = await WomenProduct.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ===== SEEDING ROUTES =====

// Seed database with sample data (men + women)
app.post('/api/seed-data', async (req, res) => {
    try {
        // Clear existing data
        await MenProduct.deleteMany({});
        await WomenProduct.deleteMany({});
        await Inventory.deleteMany({});

        // Sample data for men's products
        const menProductsData = [
            {
                Image: 'media/images/men_1.jpg',
                Brand: 'Van Heusen',
                Description: "Men's Solid Polo T Shirt",
                Mrp: '1099',
                Price: '599'
            },
            {
                Image: 'media/images/men_2.jpg',
                Brand: 'Leriya Fashion',
                Description: 'Men Casual Half Sleeve Polo Oversized Fit T-Shirt',
                Mrp: '1999',
                Price: '380'
            },
            {
                Image: 'media/images/men_3.jpg',
                Brand: 'CB-COLEBROOK',
                Description: "CB-COLEBROOK Men's Regular Fit Solid Soft Touch Cotton Casual Shirt with Pocket Design with Spread Collar & Full Sleeves",
                Mrp: '1849',
                Price: '495'
            },
            {
                Image: 'media/images/men_4.jpg',
                Brand: 'EYEBOGLER',
                Description: "EYEBOGLER Men's Trendy Polo Neck Half Sleeves Regular Fit Checkered T-Shirt",
                Mrp: '1299',
                Price: '259'
            },
            {
                Image: 'media/images/men_5.jpg',
                Brand: 'Lymio',
                Description: 'Lymio Men Jeans || Men Jeans Pants || Denim Jeans || Baggy Jeans for Men (Jeans-06-07-08)',
                Mrp: '4999',
                Price: '649'
            },
            {
                Image: 'media/images/men_6.jpg',
                Brand: 'Urbano Fashion',
                Description: "Urbano Fashion Men's Loose Baggy Fit Cut and Sew Panelled Jeans Non-Stretchable",
                Mrp: '2299',
                Price: '789'
            },
            {
                Image: 'media/images/men_7.jpg',
                Brand: 'Campus',
                Description: "Campus North Plus Sports Running Walking Gym Shoes for Men | Comfortable Shoes for Men with Vamp Upper for Airflow | Stylish Lace-Up Closure | Men's Shoes with Air Capsule Unit",
                Mrp: '1899',
                Price: '1101'
            },
            {
                Image: 'media/images/men_8.jpg',
                Brand: 'Kraasa',
                Description: "Kraasa Extra Soft Men's Classic Casual Sports Clogs/Sandals with Adjustable Back Strap for Adult | Comfortable & Lightweight| Stylish & Anti-Skid| Waterproof & Everyday Use Mules for Gents/Boys",
                Mrp: '1999',
                Price: '699'
            },
            {
                Image: 'media/images/men_9.jpg',
                Brand: 'U.S. POLO ASSN.',
                Description: "Men's Regular Fit T-Shirt",
                Mrp: '799',
                Price: '559'
            },
            {
                Image: 'media/images/men_10.jpg',
                Brand: 'London Hills',
                Description: "London Hills Men's Casual Printed Round Neck, Oversized Longline Drop Shoulder Boho Style T-Shirt",
                Mrp: '1299',
                Price: '249'
            }
        ];

        // Sample data for women's products
        const womenProductsData = [
            {
                Image: 'media/images/girl_4.jpg',
                Brand: 'Leriya Fashion',
                Description: "Leriya Fashion Oversized Shirt for Women | Shirt for Women Stylish Western | Women Long Shirt",
                Mrp: '1999',
                Price: '419'
            },
            {
                Image: 'media/images/girl_5.jpg',
                Brand: 'DIGITAL SHOPEE',
                Description: "DIGITAL SHOPEE Women's & Girls' Solid Side Split Hem Flare Leg Bell Bottom Pants Trouser",
                Mrp: '999',
                Price: '345'
            },
            {
                Image: 'media/images/girl_6.jpg',
                Brand: 'Leriya Fashion',
                Description: "Leriya Fashion Women Dress | One Piece Dress for Women | Dresses for Women | Trendi Dress for Women | Dress",
                Mrp: '1999',
                Price: '418'
            },
            {
                Image: 'media/images/girl_7.jpg',
                Brand: 'SPARX',
                Description: "Sparx Womens Sx0167l Running Shoe",
                Mrp: '820',
                Price: '1099'
            },
            {
                Image: 'media/images/girl_8.jpg',
                Brand: 'Campus',
                Description: "Campus Women's Claire Running Shoes",
                Mrp: '1399',
                Price: '840'
            },
            {
                Image: 'media/images/girl_9.jpg',
                Brand: 'SIRIL',
                Description: "SIRIL Women's Bandhani Printed Chiffon Saree with Blouse",
                Mrp: '2150',
                Price: '473'
            },
            {
                Image: 'media/images/girl_10.jpg',
                Brand: 'ANNI DESIGNER',
                Description: "ANNI DESIGNER Women's Cotton Blend Kurta with Palazzo",
                Mrp: '2599',
                Price: '439'
            },
            {
                Image: 'media/images/girl_1.jpg',
                Brand: 'GoSriKi',
                Description: "GoSriKi Women's Rayon Blend Anarkali Printed Kurta with Palazzo & Dupatta",
                Mrp: '2599',
                Price: '689'
            },
            {
                Image: 'media/images/girl_2.jpg',
                Brand: 'KOTTY',
                Description: "KOTTY Women's Solid Relaxed Fit Full Sleeve Co-ord Blazer and Trouser Set.",
                Mrp: '3999',
                Price: '479'
            },
            {
                Image: 'media/images/girl_3.jpg',
                Brand: 'Amazon Brand - Myx',
                Description: "Amazon Brand - Myx Women's Printed Straight Cotton Short Kurti",
                Mrp: '799',
                Price: '329'
            }
        ];

        // Insert men's products
        const menProducts = await MenProduct.insertMany(menProductsData);
        
        // Insert women's products
        const womenProducts = await WomenProduct.insertMany(womenProductsData);

        // Initialize inventory for all products
        const inventoryPromises = [];
        
        menProducts.forEach(product => {
            inventoryPromises.push(
                Inventory.updateStock(product._id, 'MenProduct', Math.floor(Math.random() * 50) + 10, 'set')
            );
        });
        
        womenProducts.forEach(product => {
            inventoryPromises.push(
                Inventory.updateStock(product._id, 'WomenProduct', Math.floor(Math.random() * 50) + 10, 'set')
            );
        });

        await Promise.all(inventoryPromises);

        res.json({
            message: 'Database seeded successfully',
            menProducts: menProducts.length,
            womenProducts: womenProducts.length,
            inventory: 'Initialized for all products'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Seed only men's products
app.post('/api/seed-men', async (req, res) => {
    try {
        await MenProduct.deleteMany({});
        await Inventory.deleteMany({ productModel: 'MenProduct' });

        const menProductsData = [
            {
                Image: 'media/images/men_1.jpg',
                Brand: 'Van Heusen',
                Description: "Men's Solid Polo T Shirt",
                Mrp: '1099',
                Price: '599'
            },
            {
                Image: 'media/images/men_2.jpg',
                Brand: 'Leriya Fashion',
                Description: 'Men Casual Half Sleeve Polo Oversized Fit T-Shirt',
                Mrp: '1999',
                Price: '380'
            },
            {
                Image: 'media/images/men_3.jpg',
                Brand: 'CB-COLEBROOK',
                Description: "CB-COLEBROOK Men's Regular Fit Solid Soft Touch Cotton Casual Shirt with Pocket Design with Spread Collar & Full Sleeves",
                Mrp: '1849',
                Price: '495'
            },
            {
                Image: 'media/images/men_4.jpg',
                Brand: 'EYEBOGLER',
                Description: "EYEBOGLER Men's Trendy Polo Neck Half Sleeves Regular Fit Checkered T-Shirt",
                Mrp: '1299',
                Price: '259'
            },
            {
                Image: 'media/images/men_5.jpg',
                Brand: 'Lymio',
                Description: 'Lymio Men Jeans || Men Jeans Pants || Denim Jeans || Baggy Jeans for Men (Jeans-06-07-08)',
                Mrp: '4999',
                Price: '649'
            },
            {
                Image: 'media/images/men_6.jpg',
                Brand: 'Urbano Fashion',
                Description: "Urbano Fashion Men's Loose Baggy Fit Cut and Sew Panelled Jeans Non-Stretchable",
                Mrp: '2299',
                Price: '789'
            },
            {
                Image: 'media/images/men_7.jpg',
                Brand: 'Campus',
                Description: "Campus North Plus Sports Running Walking Gym Shoes for Men | Comfortable Shoes for Men with Vamp Upper for Airflow | Stylish Lace-Up Closure | Men's Shoes with Air Capsule Unit",
                Mrp: '1899',
                Price: '1101'
            },
            {
                Image: 'media/images/men_8.jpg',
                Brand: 'Kraasa',
                Description: "Kraasa Extra Soft Men's Classic Casual Sports Clogs/Sandals with Adjustable Back Strap for Adult | Comfortable & Lightweight| Stylish & Anti-Skid| Waterproof & Everyday Use Mules for Gents/Boys",
                Mrp: '1999',
                Price: '699'
            },
            {
                Image: 'media/images/men_9.jpg',
                Brand: 'U.S. POLO ASSN.',
                Description: "Men's Regular Fit T-Shirt",
                Mrp: '799',
                Price: '559'
            },
            {
                Image: 'media/images/men_10.jpg',
                Brand: 'London Hills',
                Description: "London Hills Men's Casual Printed Round Neck, Oversized Longline Drop Shoulder Boho Style T-Shirt",
                Mrp: '1299',
                Price: '249'
            }
        ];

        const menProducts = await MenProduct.insertMany(menProductsData);

        // Initialize inventory
        const inventoryPromises = menProducts.map(product => 
            Inventory.updateStock(product._id, 'MenProduct', Math.floor(Math.random() * 50) + 10, 'set')
        );
        await Promise.all(inventoryPromises);

        res.json({
            message: 'Men products seeded successfully',
            menProducts: menProducts.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Seed only women's products
app.post('/api/seed-women', async (req, res) => {
    try {
        await WomenProduct.deleteMany({});
        await Inventory.deleteMany({ productModel: 'WomenProduct' });

        const womenProductsData = [
            {
                Image: 'media/images/girl_4.jpg',
                Brand: 'Leriya Fashion',
                Description: "Leriya Fashion Oversized Shirt for Women | Shirt for Women Stylish Western | Women Long Shirt",
                Mrp: '1999',
                Price: '419'
            },
            {
                Image: 'media/images/girl_5.jpg',
                Brand: 'DIGITAL SHOPEE',
                Description: "DIGITAL SHOPEE Women's & Girls' Solid Side Split Hem Flare Leg Bell Bottom Pants Trouser",
                Mrp: '999',
                Price: '345'
            },
            {
                Image: 'media/images/girl_6.jpg',
                Brand: 'Leriya Fashion',
                Description: "Leriya Fashion Women Dress | One Piece Dress for Women | Dresses for Women | Trendi Dress for Women | Dress",
                Mrp: '1999',
                Price: '418'
            },
            {
                Image: 'media/images/girl_7.jpg',
                Brand: 'SPARX',
                Description: "Sparx Womens Sx0167l Running Shoe",
                Mrp: '820',
                Price: '1099'
            },
            {
                Image: 'media/images/girl_8.jpg',
                Brand: 'Campus',
                Description: "Campus Women's Claire Running Shoes",
                Mrp: '1399',
                Price: '840'
            },
            {
                Image: 'media/images/girl_9.jpg',
                Brand: 'SIRIL',
                Description: "SIRIL Women's Bandhani Printed Chiffon Saree with Blouse",
                Mrp: '2150',
                Price: '473'
            },
            {
                Image: 'media/images/girl_10.jpg',
                Brand: 'ANNI DESIGNER',
                Description: "ANNI DESIGNER Women's Cotton Blend Kurta with Palazzo",
                Mrp: '2599',
                Price: '439'
            },
            {
                Image: 'media/images/girl_1.jpg',
                Brand: 'GoSriKi',
                Description: "GoSriKi Women's Rayon Blend Anarkali Printed Kurta with Palazzo & Dupatta",
                Mrp: '2599',
                Price: '689'
            },
            {
                Image: 'media/images/girl_2.jpg',
                Brand: 'KOTTY',
                Description: "KOTTY Women's Solid Relaxed Fit Full Sleeve Co-ord Blazer and Trouser Set.",
                Mrp: '3999',
                Price: '479'
            },
            {
                Image: 'media/images/girl_3.jpg',
                Brand: 'Amazon Brand - Myx',
                Description: "Amazon Brand - Myx Women's Printed Straight Cotton Short Kurti",
                Mrp: '799',
                Price: '329'
            }
        ];

        const womenProducts = await WomenProduct.insertMany(womenProductsData);

        // Initialize inventory
        const inventoryPromises = womenProducts.map(product => 
            Inventory.updateStock(product._id, 'WomenProduct', Math.floor(Math.random() * 50) + 10, 'set')
        );
        await Promise.all(inventoryPromises);

        res.json({
            message: 'Women products seeded successfully',
            womenProducts: womenProducts.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'Server is running', 
        timestamp: new Date(),
        version: '1.0.0',
        features: [
            'Authentication & Authorization',
            'Product Management',
            'Order Management',
            'Inventory Control',
            'User Management',
            'Analytics & Reporting'
        ]
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Clohit E-commerce Server running on port ${PORT}`);
    console.log(`📊 Admin Dashboard: http://localhost:${PORT}/api/admin`);
    console.log(`🛒 Customer API: http://localhost:${PORT}/api/customer`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
});

