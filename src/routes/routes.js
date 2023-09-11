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

router.get('/get-all-data',verification, adminControls.get_all_data)
router.get('/get-product-by-category/:category', verification, adminControls.getProductByCategory)

router.post('/order', verification, adminControls.create_order)
router.post('/order/:id', verification, adminControls.update_order)
router.post('/delete-order/:id', verification, adminControls.delete_order)
router.get('/get-all-order', verification, adminControls.get_all_order)

// public routes
router.get('/show-product', userControls.show_product)
router.get('/show-product-category/:category', userControls.showProductByCategory)
router.get('/show-product/:category/:id', userControls.showProductById)


module.exports = router