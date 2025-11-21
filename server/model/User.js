const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    image: {
        type: String,   // store image URL or file path
        default: null,
    },

    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },

    dateOfBirth: {
        type: Date,
        required: true,
    },

    age: {
        type: Number,
        required: true,
    },

    height: {
        type: Number,   // in centimeters
        required: true,
    },

    weight: {
        type: Number,   // in kilograms
        required: true,
    },

    BMI: {
        type: Number,
        default: 0,
    },

    gymTiming: {
        type: String,   // Will store time in 'HH:MM AM/PM' format
        required: true,
    },

    resetOtp: {
        type: String,
        default: null,
    },

    resetOtpExpires: {
        type: Date,
        default: null,
    },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);