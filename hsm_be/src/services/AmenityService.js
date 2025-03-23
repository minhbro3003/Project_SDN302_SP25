const Amenity = require("../models/AmenityModel");

// Get all amenities
const getAllAmenities = async () => {
    try {
        const amenities = await Amenity.find();
        return {
            status: "OK",
            message: "Amenities retrieved successfully",
            data: amenities
        };
    } catch (error) {
        throw new Error(error.message);
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
        const newAmenity = new Amenity(amenityData);
        await newAmenity.save();

        return {
            status: "OK",
            message: "Amenity created successfully",
            data: newAmenity
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Update an amenity by ID
const updateAmenity = async (id, updateData) => {
    try {
        const amenity = await Amenity.findByIdAndUpdate(
            id,
            { ...updateData },
            { new: true }
        );

        if (!amenity) {
            throw new Error("Amenity not found");
        }

        return {
            status: "OK",
            message: "Amenity updated successfully",
            data: amenity
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Delete an amenity by ID (soft delete)
const deleteAmenity = async (id) => {
    try {
        const amenity = await Amenity.findByIdAndUpdate(
            id,
            // { isDelete: true },
            { new: true }
        );

        if (!amenity) {
            throw new Error("Amenity not found");
        }

        return {
            status: "OK",
            message: "Amenity deleted successfully"
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getAllAmenities,
    getAmenityById,
    createAmenity,
    updateAmenity,
    deleteAmenity,
};
