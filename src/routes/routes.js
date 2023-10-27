const express = require('express')
const router = express.Router()

const adminControls = require('../controllers/adminController')
const userControls = require('../controllers/userController')
const verification = require('../middlewares/authVerification')


// admin routes
router.post('/login', userControls.login)

router.post('/create-product',verification, adminControls.createProduct)
router.delete('/delete-product/:id',verification, adminControls.deleteProduct)
router.post('/update-product/:id',verification, adminControls.updateProduct)
router.get('/get-product/:id',verification, adminControls.getProductById)

router.get('/get-stock',verification, adminControls.getStockData)
router.get('/get-amount',verification, adminControls.getAmountData)
router.get('/get-product-by-category/:category/:limit/:page/:publish/:views', verification, adminControls.getProductByCategory)

router.post('/order', verification, adminControls.create_order)
router.post('/order/:id', verification, adminControls.update_order)
router.delete('/delete-order/:id', verification, adminControls.delete_order)
router.get('/get-order/:id', verification, adminControls.get_order_by_id)
router.get('/get-all-order/:status/:page/:limit/:amount', verification, adminControls.getOrderByState)
router.get('/search/:keyword/:page/:limit', verification, adminControls.searchBYKeyword)

router.get('/get-site', verification, adminControls.getSiteData)
router.post('/site-data', verification, adminControls.sideData)

router.post('/charts', verification, adminControls.chart)

// public routes
router.get('/show-product/:page', userControls.show_product)
router.get('/show-product-category/:category/:limit/:page/:views', userControls.showProductByCategory)
router.get('/show-product/:category/:id', userControls.showProductById)
router.get('/web-data', userControls.getSiteData)


module.exports = router