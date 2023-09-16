// get packages
const jwt = require('jsonwebtoken')
const adminModel = require('../models/adminModel')
const productModel = require('../models/productModel')
const siteModel = require('../models/siteModel')

// login
exports.login = async (req, res) => {
  try {
    let user_login = await adminModel.find(req.body).count('total')

    // issuing token
    if (user_login == 1) {
      let payload = {
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
        email: req.body['email']
      }

      // sign the token
      let token = jwt.sign(payload, `${process.env.secretKey}`, { algorithm: 'HS256' });
      res.status(200).json({
        status: 1,
        data: token,
      })
    }
    else {
      res.status(200).json({
        status: 0,
        data: user_login
      })
    }
  }
  catch (error) {
    res.status(200).json({
      status: 0,
      data: error
    })
  }
}

// show product
exports.show_product = async (req, res) => {
  try {
    let showProduct = await productModel.aggregate([
      {
        $sort: { createdAt: -1 }
      },
      {
        $project: {
          updatedAt: 0,
          otherImg: 0,
          detail: 0,
          fabric: 0,
          createdAt: 0
        }
      }
    ])

    res.status(200).json({
      status: 1,
      data: showProduct
    })
  } catch (error) {
    res.status(200).json({
      status: 0,
      data: error
    })
  }
}

exports.showProductByCategory = async (req, res) => {
  try {
    let category = req.params.category
    let showProductByCategory = await productModel.find({category: category}).select("_id productName img feel category price")
    
    res.status(200).json({
      status: 1,
      data: showProductByCategory
    })
  } catch (error) {
    res.status(200).json({
      status: 0,
      data: error
    })
  }
}

exports.showProductById = async (req, res) => {
  try {
    let id = req.params.id
    let category = req.params.category

    let showProductById = await productModel.aggregate([
      { $match: { $expr: { $eq: ['$_id', { $toObjectId: id }] } } },
    ])
    let relatedProducts = await productModel.aggregate([
      { $match: { category: ""+category } },
      {$limit: 5},
      {
        $project:{
          updatedAt: 0,
          otherImg: 0,
          detail: 0,
          fabric: 0,
          createdAt: 0
        }
      }
    ])
    
    res.status(200).json({
      status: 1,
      data: { showProductById: showProductById[0], relatedProducts }
    })
  } catch (error) {
    res.status(200).json({
      status: 0,
      data: error
    })
  }
}

exports.getSiteData = async (req, res) => {
  try {
    let siteData = await siteModel.findOne({ siteName: "Tuhins Fashion" })

    res.status(200).json({
      status: 1,
      data: siteData
    })

  } catch (error) {
    res.status(200).json({
      status: 0,
      data: "something went wrong"
    })
  }
}