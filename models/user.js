const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String, required: true
    },
    email: {
        type: String,
        match: /\S+@\S+\.\S+/ 
    },
    mobile: {
        type: String
    },
    DateOfBirth: {
        type: Date
    },
    gender: {
        type: String
    },
    imageUrl: {
        type: String
    },
    password: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)