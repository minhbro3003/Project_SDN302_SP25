const AmenityService = require("../services/AmenityService");

// Get all amenities
const getAllAmenities = async (req, res) => {
    try {
        const amenities = await AmenityService.getAllAmenities();
        return res.status(200).json(amenities);
    } catch (e) {
        return res.status(500).json({
            message: "Failed to retrieve amenities",
            error: e.message,
        });
    }
};

// Get a single amenity by ID
const getAmenityById = async (req, res) => {
    try {
        const amenity = await AmenityService.getAmenityById(req.params.id);
        if (!amenity) {
            return res.status(404).json({ message: "Amenity not found" });
        }
        return res.status(200).json(amenity);
    } catch (e) {
        return res.status(500).json({
            message: "Error retrieving amenity",
            error: e.message,
        });
    }
};

// Create a new amenity
const createAmenity = async (req, res) => {
    try {
        const amenity = await AmenityService.createAmenity(req.body);
        return res.status(201).json(amenity);
    } catch (e) {
        return res.status(400).json({
            message: "Amenity creation failed",
            error: e.message,
        });
    }
};

// Update an amenity by ID
const updateAmenity = async (req, res) => {
    try {
        const updatedAmenity = await AmenityService.updateAmenity(req.params.id, req.body);
        if (!updatedAmenity) {
            return res.status(404).json({ message: "Amenity not found" });
        }
        return res.status(200).json(updatedAmenity);
    } catch (e) {
        return res.status(400).json({
            message: "Amenity update failed",
            error: e.message,
        });
    }
};

// Delete an amenity by ID
const deleteAmenity = async (req, res) => {
    try {
        const deletedAmenity = await AmenityService.deleteAmenity(req.params.id);
        if (!deletedAmenity) {
            return res.status(404).json({ message: "Amenity not found" });
        }
        return res.status(200).json({ message: "Amenity deleted successfully" });
    } catch (e) {
        return res.status(500).json({
            message: "Amenity deletion failed",
            error: e.message,
        });
    }
};

module.exports = {
    getAllAmenities,
    getAmenityById,
    createAmenity,
    updateAmenity,
    deleteAmenity,
};
