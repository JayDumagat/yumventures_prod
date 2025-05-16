const {insertOrder, findAllOrders, findOrderById, changeOrderStatus, findAllUserOrders} = require('../services/orderService');
const {insertOrderItem} = require('../services/orderItemService');

const createOrder = async (req, res) => {
    const {orderedItems, total, tenderedAmount, change} = req.body;

    try {
        const order = await insertOrder(total, tenderedAmount, change, null, 'processing');
        const orderId = order.id;

        for (const item of orderedItems) {
            await insertOrderItem(item.menuItemId, orderId, item.quantity, item.price, item.subtotal);
        }

        return res.status(201).json({message: 'Order created successfully', order});
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await findAllOrders();
        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

const getAllUserOrders = async (req, res) => {
    const userId = req.session.user.id;

    try {
        const orders = await findAllUserOrders(userId);
        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

const updateOrderStatus = async (req, res) => {
    const {status} = req.body;
    const {id: orderId} = req.params;

    try {
        const order = await findOrderById(orderId);
        if (!order) {
            return res.status(404).json({message: 'Order not found'});
        }

        await changeOrderStatus(orderId, status);
        return res.status(200).json({message: 'Order status updated successfully'});
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    updateOrderStatus,
    getAllUserOrders

};