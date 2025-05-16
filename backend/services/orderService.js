const { Order, OrderItem, MenuItem, sequelize } = require("../models");

const insertOrder = async (
  total,
  tenderedAmount,
  change,
  orderedBy,
  status
) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.create(
      {
        total,
        tenderedAmount,
        change,
        orderedBy,
        status,
      },
      { transaction }
    );

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const findAllOrders = async () => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          required: false,
          include: [
            {
              model: MenuItem,
              as: "menuItem",
              attributes: ["id", "name", "image"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return orders;
  } catch (error) {
    throw error;
  }
};

const findAllUserOrders = async (userId) => {
  try {
    const orders = await Order.findAll({
      where: { orderedBy: userId },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          required: false,
          include: [
            {
              model: MenuItem,
              as: "menuItem",
              attributes: ["id", "name", "image"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return orders;
  } catch (error) {
    throw error;
  }
}

const findOrderById = async (orderId) => {
    try {
        const order = await Order.findByPk(orderId, {
        include: [
            {
            model: OrderItem,
            as: "orderItems",
            required: false,
            include: [
                {
                model: MenuItem,
                as: "menuItem",
                attributes: ["id", "name", "image"],
                },
            ],
            },
        ],
        });
        return order;
    } catch (error) {
        throw error;
    }
}

const changeOrderStatus = async (orderId, status) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findByPk(orderId, { transaction });

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;
    await order.save({ transaction });

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  insertOrder,
  findAllOrders,
  findOrderById,
  changeOrderStatus,
  findAllUserOrders,
};
