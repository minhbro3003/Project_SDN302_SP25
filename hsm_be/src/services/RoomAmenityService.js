const mongoose = require("mongoose");
const RoomAmenity = require("../models/RoomAmenityModel");
const Room = require("../models/RoomModel");
const Amenity = require("../models/AmenityModel");

// Get all room amenities
const getAllRoomAmenities = async () => {
    try {
        const roomAmenities = await RoomAmenity.find()
            .populate({
                path: "room", // Use 'room' instead of 'roomeID'
                select: "RoomName Status Floor", // Select RoomName, Status, and Floor fields
            })
            .populate({
                path: "amenity", // Populate the amenity field
                select: "AmenitiesName", // Select AmenitiesName from Amenity model
            });

        console.log(roomAmenities); // Check if room fields are populated

        return {
            status: "OK",
            message: "All room amenities retrieved successfully",
            data: roomAmenities,
        };
    } catch (error) {
        console.error("Error in getAllRoomAmenities:", error.message);
        return {
            status: "ERR",
            message: "Failed to retrieve room amenities",
            error: error.message,
        };
    }
};



// Get a single room amenity by ID
const getRoomAmenityById = async (id) => {
    try {
        const roomAmenity = await RoomAmenity.findById(id)
            .populate({
                path: "room", // Use 'room' instead of 'roomeID'
                select: "RoomName Status Floor", // Select RoomName, Status, and Floor fields
            })
            .populate({
                path: "amenity", // Populate the amenity field
                select: "AmenitiesName", // Select AmenitiesName from Amenity model
            });
        if (!roomAmenity) {
            return {
                status: "ERR",
                message: "Room amenity not found",
            };
        }
        return {
            status: "OK",
            message: "Room amenity retrieved successfully",
            data: roomAmenity,
        };
    } catch (error) {
        console.error("Error in getRoomAmenityById:", error.message);
        return {
            status: "ERR",
            message: "Failed to retrieve room amenity",
            error: error.message,
        };
    }
};

// Get all room amenities that are not functioning
const getAllNotFunctioningRoomAmenities = async () => {
    try {
        const notFunctioningRoomAmenities = await RoomAmenity.find({ status: { $ne: "Functioning" } })
            .populate({
                path: "room", // Use 'room' instead of 'roomID'
                select: "RoomName Status Floor", // Select RoomName, Status, and Floor fields
            })
            .populate({
                path: "amenity", // Populate the amenity field
                select: "AmenitiesName", // Select AmenitiesName from Amenity model
            });

        return {
            status: "OK",
            message: "All not functioning room amenities retrieved successfully",
            data: notFunctioningRoomAmenities,
        };
    } catch (error) {
        console.error("Error in getAllNotFunctioningRoomAmenities:", error.message);
        return {
            status: "ERR",
            message: "Failed to retrieve not functioning room amenities",
            error: error.message,
        };
    }
};


// Create a new room amenity
const createRoomAmenity = async (newRoomAmenity) => {
    try {
        const { room, amenity, quantity, status } = newRoomAmenity;
        const roomAmenity = new RoomAmenity({ room, amenity, quantity, status });
        const savedRoomAmenity = await roomAmenity.save();
        return {
            status: "OK",
            message: "Room amenity created successfully",
            data: savedRoomAmenity,
        };
    } catch (error) {
        console.error("Error in createRoomAmenity:", error.message);
        return {
            status: "ERR",
            message: "Failed to create room amenity",
            error: error.message,
        };
    }
};

// Update a room amenity by ID
const updateRoomAmenity = async (id, data) => {
    try {
        const updatedRoomAmenity = await RoomAmenity.findByIdAndUpdate(id, data, { new: true })
            .populate("room", "RoomName Status Floor")
            .populate("amenity", "AmenitiesName");
        if (!updatedRoomAmenity) {
            return {
                status: "ERR",
                message: "Room amenity not found",
            };
        }
        return {
            status: "OK",
            message: "Room amenity updated successfully",
            data: updatedRoomAmenity,
        };
    } catch (error) {
        console.error("Error in updateRoomAmenity:", error.message);
        return {
            status: "ERR",
            message: "Failed to update room amenity",
            error: error.message,
        };
    }
};

// Delete a room amenity by ID
const deleteRoomAmenity = async (id) => {
    try {
        const deletedRoomAmenity = await RoomAmenity.findByIdAndDelete(id);
        if (!deletedRoomAmenity) {
            return {
                status: "ERR",
                message: "Room amenity not found",
            };
        }
        return {
            status: "OK",
            message: "Room amenity deleted successfully",
        };
    } catch (error) {
        console.error("Error in deleteRoomAmenity:", error.message);
        return {
            status: "ERR",
            message: "Failed to delete room amenity",
            error: error.message,
        };
    }
};

module.exports = {
    getAllRoomAmenities,
    getRoomAmenityById,
    createRoomAmenity,
    updateRoomAmenity,
    deleteRoomAmenity,
    getAllNotFunctioningRoomAmenities,
};
