const RoomAmenityService = require("../services/RoomAmenityService");

// Get all room amenities
const getAllRoomAmenities = async (req, res) => {
    try {
        const roomAmenities = await RoomAmenityService.getAllRoomAmenities();
        return res.status(200).json(roomAmenities);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve room amenities",
            error: error.message,
        });
    }
};

// Get a single room amenity by ID
const getRoomAmenityById = async (req, res) => {
    try {
        const roomAmenity = await RoomAmenityService.getRoomAmenityById(req.params.id);
        if (!roomAmenity) {
            return res.status(404).json({ message: "Room amenity not found" });
        }
        return res.status(200).json(roomAmenity);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve room amenity",
            error: error.message,
        });
    }
};

// Create a new room amenity
const createRoomAmenity = async (req, res) => {
    try {
        const roomAmenity = await RoomAmenityService.createRoomAmenity(req.body);
        return res.status(201).json(roomAmenity);
    } catch (error) {
        return res.status(400).json({
            message: "Failed to create room amenity",
            error: error.message,
        });
    }
};

// Update a room amenity by ID
const updateRoomAmenity = async (req, res) => {
    try {
        const updatedRoomAmenity = await RoomAmenityService.updateRoomAmenity(req.params.id, req.body);
        if (!updatedRoomAmenity) {
            return res.status(404).json({ message: "Room amenity not found" });
        }
        return res.status(200).json(updatedRoomAmenity);
    } catch (error) {
        return res.status(400).json({
            message: "Failed to update room amenity",
            error: error.message,
        });
    }
};

// Delete a room amenity by ID
const deleteRoomAmenity = async (req, res) => {
    try {
        const deletedRoomAmenity = await RoomAmenityService.deleteRoomAmenity(req.params.id);
        if (!deletedRoomAmenity) {
            return res.status(404).json({ message: "Room amenity not found" });
        }
        return res.status(200).json({ message: "Room amenity deleted successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete room amenity",
            error: error.message,
        });
    }
};

// Get all room amenities that are not functioning
const getNotFunctioningRoomAmenities = async (req, res) => {
    try {
        const notFunctioningRoomAmenities = await RoomAmenityService.getAllNotFunctioningRoomAmenities();
        return res.status(200).json(notFunctioningRoomAmenities);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve not functioning room amenities",
            error: error.message,
        });
    }
};

const getRoomAmenitiesByRoomId = async (req, res) => {
    try {
        const roomAmenities = await RoomAmenityService.getRoomAmenitiesByRoomId(req.params.roomId);
        if (!roomAmenities.data || roomAmenities.data.length === 0) {
            return res.status(404).json({ message: "No amenities found for this room" });
        }
        return res.status(200).json(roomAmenities);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve room amenities",
            error: error.message,
        });
    }
};

// Update room amenities dynamically
const updateRoomAmenities = async (req, res) => {
    try {
        const { roomId } = req.params;
        const updates = req.body; // Expecting an array of updates

        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({ message: "Invalid update data" });
        }

        const result = await RoomAmenityService.updateRoomAmenities(roomId, updates);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update room amenities",
            error: error.message,
        });
    }
};


module.exports = {
    getAllRoomAmenities,
    getRoomAmenityById,
    createRoomAmenity,
    updateRoomAmenity,
    deleteRoomAmenity,
    getNotFunctioningRoomAmenities,
    getRoomAmenitiesByRoomId,
    updateRoomAmenities,
};
