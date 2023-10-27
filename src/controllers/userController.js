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
    let page = req.params.page
    let skip = (page - 1) * 18

    let total = await productModel.find().count('total')
    let showProduct = await productModel.aggregate([
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: 18,
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
      data: showProduct, total
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
    let category = { category: req.params.category }
    let publish = { published: "Yes" }
    let match = {
      category: category.category,
      published: publish.published
    }

    let page = parseInt(req.params.page)
    let views = parseInt(req.params.views)
    let limit = parseInt(req.params.limit)
    let skip = (page - 1) * limit

    let matchStage = { $match: match }
    let sortStage = { $sort: { createdAt: -1 } }
    let skipStage = { $skip: skip }
    let limitStage = { $limit: limit }
    let projectStage = {
      $project: {
        published: 0,
        updatedAt: 0,
        otherImg: 0,
        detail: 0,
        fabric: 0,
        feel: 0
      }
    }

    let query = [matchStage, sortStage, skipStage, limitStage, projectStage]
    if (views != 0) {
      sortStage = { $sort: { views: views } }
      query = [matchStage, sortStage, skipStage, limitStage, projectStage]
    }
    if (req.params.category === "All") {
      match = publish
      matchStage = { $match: match }
      query = [matchStage, sortStage, skipStage, limitStage, projectStage]
    }

    let productTotal = await productModel.find(match).count("total")
    let product = await productModel.aggregate(query)

    res.status(200).json({
      status: 1,
      code: 200,
      data: product,
      productTotal
    })

  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "Something went wrong"
    })
  }
}

exports.showProductById = async (req, res) => {
  try {
    let id = req.params.id
    let category = req.params.category
    let views = { $inc: { views: 1 } }
    
    let updateView = await productModel.updateOne({ _id: req.params.id }, views)
    let showProductById = await productModel.findOne({ _id: id, published: "Yes" })
    let relatedProducts = await productModel.aggregate([
      { $match: { category: ""+category, published: "Yes" } },
      {
        $sample: { size: 5 }
      },
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
      data: { showProductById, relatedProducts }
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
      code: 200,
      data: siteData
    })

  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "something went wrong"
    })
  }
}