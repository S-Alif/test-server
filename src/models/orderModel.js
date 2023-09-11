const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  custome_number: {type: String, required: true, trim: true},
  customer_name: {type: String, required: true, trim: true},
  order_detail:{type: String, required: true, trim: true},
  total_price:{type: Number},
  status:{type: String, default: "pending"}
}, {timestamps: true, versionKey: false})

let orderModel = mongoose.model('orders', orderSchema)

module.exports = orderModel