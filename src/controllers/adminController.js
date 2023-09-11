const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

// create product
exports.createProduct = async (req, res) => {
  try {
    let reqBody = req.body
    let newProduct = await productModel.create(reqBody)

    res.status(200).json({
      status: 1,
      code: 200,
      data: newProduct
    })


  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "could not create order"
    })
  }
}

// delete product
exports.deleteProduct = async (req, res) => {
  try {
    let prID = req.params.id
    let productDelete = await productModel.deleteOne({_id: prID})

    res.status(200).json({
      status: 1,
      code: 200,
      data: productDelete
    })
    
  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "something went wrong"
    })
  }
}

// update product
exports.updateProduct = async (req, res) => {
  try {
    let prID = req.params.id
    let reqBody = req.body
    let productUpdate = await productModel.updateOne({_id: prID}, reqBody)

    res.status(200).json({
      status: 1,
      code: 200,
      data: productUpdate
    })
    
  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "Could not update product"
    })
  }
}

// get product by ID
exports.getProductById = async (req, res) => {
  try {
    let prID = req.params.id
    let product = await productModel.findOne({_id: prID})

    res.status(200).json({
      status: 1,
      code: 200,
      data: product
    })
    
  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "something went wrong"
    })
  }
}

// get all product count
exports.get_all_data = async (req, res) => {
  try {
    let borka = await productModel.find({ category: "বোরকা" }).count("total")
    let hijab = await productModel.find({category : "হিজাব"}).count("total")
    let niqab = await productModel.find({category : "নিকাব"}).count("total")
    let allProductCount = await productModel.find().count("total")
    let allProduct = await productModel.aggregate([
      {
        $sort: { createdAt: -1 }
      },
      {
        $project: {
          updatedAt: 0,
          img: 0,
          otherImg: 0,
          detail: 0,
          fabric: 0,
          feel: 0
        }
      }
    ])
    
    res.status(200).json({
      status: 1,
      code: 200,
      data: { borka, hijab, niqab, allProduct, allProductCount }
    })
  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "something went wrong"
    })
  }
}

// get product by category
exports.getProductByCategory = async (req, res) => {
  try {
    let category = req.params.category || ""
    let product = await productModel.aggregate([
      {$match: {category: category}},
      {
        $sort: { createdAt: -1 }
      },
      {
        $project:{
          updatedAt: 0,
          img: 0,
          otherImg: 0,
          detail: 0,
          fabric: 0,
          feel: 0
        }
      }
    ])

    res.status(200).json({
      status: 1,
      code: 200,
      data: product
    })
    
  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "Something went wrong"
    })
  }
}

// create order
exports.create_order = async (req, res) => {
  try {
    let order = await orderModel.create(req.body)

    res.status(200).json({
      status: 1,
      code: 200,
      data: "order has been created"
    })
    
  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "could not create order"
    })
  }
}

// order update
exports.update_order = async (req, res) => {
  try {
    let id = req.params.id
    let updateOrder = await orderModel.updateOne({ _id: id }, req.body)

    res.status(200).json({
      status: 1,
      code: 200,
      data: "order has been updated"
    })
    
  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "Could not update order"
    })
  }
}

// order delete
exports.delete_order = async (req, res) => {
  try {
    let id = req.params.id
    let deleteOrder = await orderModel.deleteOne({ _id: id }, req.body)

    res.status(200).json({
      status: 1,
      code: 200,
      data: "order has been deleted"
    })
    
  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "Could not delete product"
    })
  }
}

// get all order
exports.get_all_order = async (req, res) => {
  try {
    let allOrder = await orderModel.aggregate([
      {
        $sort: { createAt: -1 }
      },
      {
        $project: {
          updatedAt: 0,
        }
      }
    ])

    res.status(200).json({
      status: 1,
      code: 200,
      data: allOrder
    })
    
  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "Could not delete product"
    })
  }
}