const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'productModel'
    },
    productModel: {
        type: String,
        required: true,
        enum: ['MenProduct', 'WomenProduct']
    },
    productName: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    items: [orderItemSchema],
    subtotal: {
        type: Number,
        required: true
    },
    shipping: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: {
        name: String,
        address: String,
        city: String,
        state: String,
        zipCode: String,
        phone: String
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'online'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    notes: String,
    estimatedDelivery: Date
}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
    if (this.isNew) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        // Get count of orders for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const count = await mongoose.model('Order').countDocuments({
            createdAt: { $gte: today, $lt: tomorrow }
        });
        
        this.orderNumber = `CL${year}${month}${day}${(count + 1).toString().padStart(3, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
