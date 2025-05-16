const express = require('express');
const router = express.Router();

const {createOrder, getAllOrders,updateOrderStatus, getAllUserOrders} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/user-orders', getAllUserOrders);
router.put('/status-update/:id', updateOrderStatus);
module.exports = router;