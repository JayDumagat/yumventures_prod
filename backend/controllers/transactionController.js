const axios = require('axios');
const base64 = require('base-64');
const { insertOrder } = require('../services/orderService');
const { insertOrderItem } = require('../services/orderItemService');
const { createCheckoutSession } = require('../services/paymongoService');
const { findAllOrders } = require('../services/transactionService');
const { findMenuItemById } = require('../services/menuItemService');
const crypto = require('crypto');

const getAllOrders = async (req, res) => {
    try {
        const orders = await findAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const requestPaymentLink = async (req, res) => {
    try {
        const { orderedItems, total, tenderedAmount, change } = req.body;
        const userSession = req.session.user;

        // Build line_items for checkout session
        const lineItems = await Promise.all(
            orderedItems.map(async item => {
                const menuItem = await findMenuItemById(item.menuItemId);
                return {
                    name: menuItem.name,
                    amount: parseFloat(item.price) * 100, // convert to cents
                    currency: "PHP",
                    quantity: item.quantity
                };
            })
        );

        // Metadata for reconstructing order
        const metadata = {
            userId: userSession.id,
            orderItems: JSON.stringify(orderedItems),
            total,
            tenderedAmount,
            change
        };

        const checkoutUrl = await createCheckoutSession(lineItems, metadata);
        res.status(200).json({ checkoutUrl });
    } catch (err) {
        console.error('Error creating checkout session:', err.response?.data || err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const handlePaymongoWebhook = async (req, res) => {
  try {
    const event = req.body;
const eventType = event.data.attributes.type;

const metadata = event.data.attributes?.data?.attributes?.metadata;

if (!metadata) {
  console.warn('Metadata not found in event');
  return res.status(200).send('No metadata to process');
}

const items = JSON.parse(metadata.orderItems);

    // Proceed only if event is payment.paid (or whichever you want to handle)
    if (eventType !== 'payment.paid') {
      console.log(`Ignoring event type: ${eventType}`);
      return res.status(200).send('Event ignored');
    }

    // Insert order in DB etc.
    const order = await insertOrder(
      metadata.total,
      metadata.tenderedAmount,
      metadata.change,
      metadata.userId,
      'processing'
    );

    for (const item of items) {
      await insertOrderItem(item.menuItemId, order.id, item.quantity, item.price, item.subtotal);
    }

    console.log(`Order ${order.id} created via webhook`);
    res.status(200).send('Webhook processed successfully');

  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).send('Server error');
  }
};




module.exports = {
    getAllOrders,
    requestPaymentLink,
    handlePaymongoWebhook
};