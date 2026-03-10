let mongoose = require('mongoose');
let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "username khong duoc de trong"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "password khong duoc de trong"]
    },
    email: {
        type: String,
        required: [true, "email khong duoc de trong"],
        unique: true
    },
    fullName: {
        type: String,
        default: ""
    },
    avatarUrl: {
        type: String,
        default: "https://i.sstatic.net/l60Hf.png"
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    loginCount: {
        type: Number,
        default: 0,
        min: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
module.exports = new mongoose.model('user', userSchema)