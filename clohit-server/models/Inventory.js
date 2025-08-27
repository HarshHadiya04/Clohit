const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
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
    stockQuantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    reservedQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    availableQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 10,
        min: 0
    },
    isInStock: {
        type: Boolean,
        default: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate available quantity before saving
inventorySchema.pre('save', function(next) {
    this.availableQuantity = this.stockQuantity - this.reservedQuantity;
    this.isInStock = this.availableQuantity > 0;
    this.lastUpdated = new Date();
    next();
});

// Static method to update stock
inventorySchema.statics.updateStock = async function(productId, productModel, quantity, operation = 'add') {
    let inventory = await this.findOne({ productId, productModel });
    
    if (!inventory) {
        inventory = new this({
            productId,
            productModel,
            stockQuantity: operation === 'add' ? quantity : 0
        });
    } else {
        if (operation === 'add') {
            inventory.stockQuantity += quantity;
        } else if (operation === 'subtract') {
            inventory.stockQuantity = Math.max(0, inventory.stockQuantity - quantity);
        } else if (operation === 'set') {
            inventory.stockQuantity = quantity;
        }
    }
    
    return await inventory.save();
};

// Static method to reserve stock
inventorySchema.statics.reserveStock = async function(productId, productModel, quantity) {
    const inventory = await this.findOne({ productId, productModel });
    
    if (!inventory) {
        throw new Error('Product inventory not found');
    }
    
    if (inventory.availableQuantity < quantity) {
        throw new Error('Insufficient stock available');
    }
    
    inventory.reservedQuantity += quantity;
    return await inventory.save();
};

// Static method to release reserved stock
inventorySchema.statics.releaseReservedStock = async function(productId, productModel, quantity) {
    const inventory = await this.findOne({ productId, productModel });
    
    if (!inventory) {
        throw new Error('Product inventory not found');
    }
    
    inventory.reservedQuantity = Math.max(0, inventory.reservedQuantity - quantity);
    return await inventory.save();
};

module.exports = mongoose.model('Inventory', inventorySchema);
