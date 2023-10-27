const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const siteModel = require("../models/siteModel");

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

// get stock data
exports.getStockData = async (req, res) => {
  try {
    let borka = await productModel.find({ category: "বোরকা" }).count("total")
    let hijab = await productModel.find({category : "হিজাব"}).count("total")
    let niqab = await productModel.find({category : "নিকাব"}).count("total")
    let allProductCount = await productModel.find().count("total")

    res.status(200).json({
      status: 1,
      code: 200,
      data: { borka, hijab, niqab, allProductCount }
    })
  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "something went wrong"
    })
  }
}

// get amount data
exports.getAmountData = async (req, res) => {
  try {
    // total order amount
    let totalOrderAmount = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalPrice: {$sum : "$total_price"}
        }
      },
      {
        $project:{
          _id: 0
        }
      }
    ])
    // order this month
    let totalOrderThisMonth = await orderModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$createdAt" }, (new Date().getMonth() + 1)]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalPrice: { $sum: "$total_price" }
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ])    
    // completed orders
    let completedOrderThisMonth = await orderModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$createdAt" }, (new Date().getMonth() + 1)] },
              { $eq: ["$status", "complete"] } 
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalCompletedOrders: { $sum: 1 },
          totalAmount: { $sum: "$total_price" }
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ])

    res.status(200).json({
      status: 1,
      code: 200,
      data: { order: totalOrderAmount[0], orderThisMonth: totalOrderThisMonth[0], completedOrderMonth: completedOrderThisMonth[0] }
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
    let category = { category: req.params.category }
    let publish = { published: req.params.publish }
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
        updatedAt: 0,
        img: 0,
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
    if (req.params.category === "All"){
      match = publish
      matchStage = { $match: match }
      query = [matchStage, sortStage, skipStage, limitStage, projectStage]
    }
    if (req.params.publish === "All"){
      match = category
      matchStage = { $match: match }
      query = [matchStage, sortStage, skipStage, limitStage, projectStage]
    }
    if (req.params.category === "All" && req.params.publish === "All"){
      match = {}
      query = [sortStage, skipStage, limitStage, projectStage]
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
    let deleteOrder = await orderModel.deleteOne({ _id: id })

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

// order by id
exports.get_order_by_id = async (req, res) => {
  try {
    let id = req.params.id
    let order = await orderModel.findOne({_id: id})

    res.status(200).json({
      status: 1,
      code: 200,
      data: order
    })
    
  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "Could not fetch product"
    })
  }
}

exports.getOrderByState = async (req, res) => {
  try {
    let state = req.params.status
    let page = parseInt(req.params.page)
    let limit = parseInt(req.params.limit)
    let amount = parseInt(req.params.amount)
    let skip = (page - 1) * limit
    
    let match = { status: state }
    let matchStage = { $match: match }
    let sortStage = { $sort: { createdAt: -1 } }
    let skipStage = {$skip: skip}
    let limitStage = {$limit: limit}
    let projectStage = {$project: {updatedAt: 0}}
    let query = [matchStage, sortStage, skipStage, limitStage, projectStage]

    if(amount != 0){
      sortStage = { $sort: { total_price: amount } }
      query = [matchStage, sortStage, skipStage, limitStage, projectStage]
    }
    if (req.params.status == "All") {
      match = {}
      matchStage = {}
      query = [sortStage, skipStage, limitStage, projectStage]
    }

    let totalOrder = await orderModel.find(match).count("total")
    let allOrder = await orderModel.aggregate(query)

    res.status(200).json({
      status: 1,
      code: 200,
      data: allOrder,
      totalOrder
    })

  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "Something went wrong"
    })
  }
}

exports.searchBYKeyword = async (req, res) => {
  try {
    let page = parseInt(req.params.page)
    let limit = parseInt(req.params.limit)
    let skip = (page - 1) * limit

    let keyword = req.params.keyword
    let SearchRegex = { $regex: keyword, $options: "i" }
    let SearchParam = [{ customer_number: SearchRegex }, { customer_name: SearchRegex }]
    let SearchQuery = { $or: SearchParam }
    let matchStage = { $match: SearchQuery }

    let sortStage = { $sort: { createAt: -1 } }
    let skipStage = { $skip: skip }
    let limitStage = { $limit: limit }

    let projectStage = {
      $project: {
        updatedAt: 0,
      }
    }

    let totalOrder = await orderModel.find(SearchQuery).count('total')
    let data = await orderModel.aggregate([matchStage,sortStage, skipStage, limitStage, projectStage])

    res.status(200).json({
      status: 1,
      code: 200,
      data: data,
      totalOrder
    })
  }
  catch (e) {
    console.log(e)
    res.status(200).json({
      status: 0,
      code: 200,
      data: "something went wrong"
    })
  }
}

exports.getSiteData = async (req, res) => {
  try {
    let siteData = await siteModel.findOne({ siteName: "Tuhins Fashion"})

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

exports.sideData = async (req, res) => {
  try {
    let siteUpdate = await siteModel.updateOne({ siteName: "Tuhins Fashion"}, {$set: req.body}, {upsert: true})

    res.status(200).json({
      status: 1,
      code: 200,
      data: "site updated"
    })
    
  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "something went wrong"
    })
  }
}

exports.chart = async (req, res) => {
  try {
    let groupStage = {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
        },
        totalOrder: {
          $sum: "$total_price"
        }
      }
    }
    let project = {
      $project: {
        monthName: {
          $let: {
            vars: {
              monthsInString: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            },
            in: {
              $arrayElemAt: ['$$monthsInString', '$_id.month']
            }
          }
        },
        totalOrder: 1
        }
      }
    let monthlyOrderChart = await orderModel.aggregate([groupStage, project])

    res.status(200).json({
      status: 1,
      code: 200,
      data: monthlyOrderChart
    })
    
  } catch (error) {
    res.status(200).json({
      status: 0,
      code: 200,
      data: "something went wrong"
    })
  }
}