const Amenity = require("../models/AmenityModel");

// Get all amenities
const getAllAmenities = async () => {
    try {
        const amenities = await Amenity.find();
        return {
            status: "OK",
            message: "All amenities retrieved successfully",
            data: amenities,
        };
    } catch (error) {
        console.error("Error in getAllAmenities:", error.message);
        return {
            status: "ERR",
            message: "Failed to retrieve amenities",
            error: error.message,
        };
    }
};

// Get a single amenity by ID
const getAmenityById = async (id) => {
    try {
        const amenity = await Amenity.findById(id);
        if (!amenity) {
            return {
                status: "ERR",
                message: "Amenity not found",
            };
        }
        return {
            status: "OK",
            message: "Amenity retrieved successfully",
            data: amenity,
        };
    } catch (error) {
        console.error("Error in getAmenityById:", error.message);
        return {
            status: "ERR",
            message: "Failed to retrieve amenity",
            error: error.message,
        };
    }
};

// Create a new amenity
const createAmenity = async (amenityData) => {
    try {
        const { AmenitiesName, Note } = amenityData;
        const newAmenity = new Amenity({ AmenitiesName, Note });
        const savedAmenity = await newAmenity.save();
        return {
            status: "OK",
            message: "Amenity created successfully",
            data: savedAmenity,
        };
    } catch (error) {
        console.error("Error in createAmenity:", error.message);
        return {
            status: "ERR",
            message: "Failed to create amenity",
            error: error.message,
        };
    }
};

// Update an amenity by ID
const updateAmenity = async (id, data) => {
    try {
        const amenity = await Amenity.findById(id);
        if (!amenity) {
            return {
                status: "ERR",
                message: "Amenity not found",
            };
        }
        const updatedAmenity = await Amenity.findByIdAndUpdate(id, data, { new: true });
        return {
            status: "OK",
            message: "Amenity updated successfully",
            data: updatedAmenity,
        };
    } catch (error) {
        console.error("Error in updateAmenity:", error.message);
        return {
            status: "ERR",
            message: "Failed to update amenity",
            error: error.message,
        };
    }
};

// Delete an amenity by ID
const deleteAmenity = async (id) => {
    try {
        const amenity = await Amenity.findById(id);
        if (!amenity) {
            return {
                status: "ERR",
                message: "Amenity not found",
            };
        }
        await Amenity.findByIdAndDelete(id);
        return {
            status: "OK",
            message: "Amenity deleted successfully",
        };
    } catch (error) {
        console.error("Error in deleteAmenity:", error.message);
        return {
            status: "ERR",
            message: "Failed to delete amenity",
            error: error.message,
        };
    }
};

module.exports = {
    getAllAmenities,
    getAmenityById,
    createAmenity,
    updateAmenity,
    deleteAmenity,
};
