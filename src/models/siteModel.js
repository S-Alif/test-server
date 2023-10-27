const mongoose = require('mongoose')

const siteSchema = mongoose.Schema({
  siteName: {type:String, default: "Tuhins Fashion"},
  mainImg: {type: String},
  siteLogo: {type: String},
  siteAbout: {type: String},
  contactNumber: {type: String},
  contactMail: {type: String},
  contactLocation: {type: String},
  locationName: {type: String},
  fbPage: { type: String },
  whatsApp: { type: String }
}, {timestamps: true, versionKey: false})

let siteModel = mongoose.model('siteDatas', siteSchema)

module.exports = siteModel