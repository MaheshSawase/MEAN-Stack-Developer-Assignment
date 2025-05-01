const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uName: { type: String },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    authToken: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
