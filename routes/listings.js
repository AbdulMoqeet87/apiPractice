const express = require('express');
const Listing = require('../models/Listing');

const router = express.Router();


router.get('/listing', async (req, res) => {
    try {

        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        
        const filter = {};

        if (req.query.price) {
            filter.price = { $lte: req.query.price }; 
        }
        if (req.query.property_type) {
            filter.property_type = req.query.property_type;
        }
        if (req.query.bedrooms) {
            filter.bedrooms = req.query.bedrooms; 
        }

        
        const sort = {}
        if (req.query.sort_by) {
            const field = req.query.sort_by;
            const order = req.query.sort_order === 'desc' ? -1 : 1; 
            sort[field] = order;
        }

        
        const listings = await Listing.find(filter)
            .sort(sort)
            .skip(offset)
            .limit(parseInt(limit));

        
        const totalListings = await Listing.countDocuments(filter);

        
        res.status(200).json({
            data: listings,
            total: totalListings,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ error: 'An error occurred while fetching listings' });
    }
});

module.exports = router;
