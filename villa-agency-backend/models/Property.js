// models/Property.js
const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true }, // e.g., "Villa", "Apartment", "Penthouse"
    price: { type: Number, required: true },
    location: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: String, required: true }, // e.g., "185 m2"
    floor: { type: Number, required: true },
    parkingSpots: { type: Number, default: 0 },
    description: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    // Add any other fields you want to store for a property
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', PropertySchema);