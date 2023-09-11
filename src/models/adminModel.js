const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
}, {timestamps: true, versionKey: false})

let adminModel = mongoose.model('admins', adminSchema)

module.exports = adminModel