const express = require('express');

const router = express.Router();

const { getAllOrders, requestPaymentLink, handlePaymongoWebhook } = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
router.get('/', getAllOrders);
router.post('/request-payment-link', authMiddleware, requestPaymentLink);
router.post('/payment-webhook', handlePaymongoWebhook);

module.exports = router;