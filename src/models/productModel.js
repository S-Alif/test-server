const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  productName: {type: String, required: true},
  img: {type: String, required: true},
  otherImg: [String],
  detail:{type: String},
  fabric:{type: String},
  feel:{type: String},
  price:{type: String},
  category:{type: String}
}, {timestamps: true, versionKey: false})

let productModel = mongoose.model('products', productSchema)

module.exports = productModel