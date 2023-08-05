const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    birthday: Date,
    address: String,
    phone: Number,
    image: String,
    createdAt: { type: Date,default: Date.now }
})


const User = mongoose.model('user',userSchema)

module.exports = User;