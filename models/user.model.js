const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        address: String,
        birthday: String,
        token: String,
        phone: String,
        avatar: String,
        acceptFriends: Array, // Danh sách những người cần chấp nhận
        requestFriends: Array, // Danh sách những người đã gửi yêu cầu đi
        friendsList: Array, // Danh sách bạn bè
        status: String,
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);
const User = mongoose.model("User", userSchema, "users");
module.exports = User; 