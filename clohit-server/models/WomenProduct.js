const mongoose = require('mongoose');

const womenProductSchema = new mongoose.Schema({
    Image: {
        type: String,
        required: true
    },
    Brand: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true,
        unique: true
    },
    Mrp: {
        type: String,
        required: true
    },
    Price: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('WomenProduct', womenProductSchema);

