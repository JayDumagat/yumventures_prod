const {OrderItem, sequelize} = require('../models');

const insertOrderItem = async (menuItemId, orderId, quantity, price, subtotal) => {
    const transaction = await sequelize.transaction();

    try {
        const orderItem = await OrderItem.create({
            menuItemId,
            orderId,
            quantity,
            price,
            subtotal
        }, { transaction });

        await transaction.commit();
        return orderItem;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    insertOrderItem
};