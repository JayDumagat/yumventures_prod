const express = require('express');
const router = express.Router();

const {createOrder, getAllOrders,updateOrderStatus, getAllUserOrders, getOrdersReport} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/export', getOrdersReport);
router.get('/user-orders', getAllUserOrders);
router.put('/status-update/:id', updateOrderStatus);
module.exports = router;
