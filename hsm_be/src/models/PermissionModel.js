const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
    {
        PermissionName: { type: String, required: true, unique: true, trim: true },
        Note: { type: String, trim: true },
    },
    {
        timestamps: true,
    }
);

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;
