// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// GET all properties
router.get('/', async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single property by ID
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(property);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new property (Requires validation and potentially authentication)
router.post('/', async (req, res) => {
    const property = new Property({
        title: req.body.title,
        type: req.body.type,
        price: req.body.price,
        location: req.body.location,
        bedrooms: req.body.bedrooms,
        bathrooms: req.body.bathrooms,
        area: req.body.area,
        floor: req.body.floor,
        parkingSpots: req.body.parkingSpots,
        description: req.body.description,
        images: req.body.images || []
    });

    try {
        const newProperty = await property.save();
        res.status(201).json(newProperty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT/PATCH update a property by ID (Requires validation and potentially authentication)
router.patch('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Update fields if they exist in the request body
        Object.assign(property, req.body);

        const updatedProperty = await property.save();
        res.json(updatedProperty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a property by ID (Requires authentication)
router.delete('/:id', async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json({ message: 'Property deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;