const { Order, OrderItem, MenuItem, sequelize } = require("../models");
const { getIO } = require("../utils/socket");
const { Op } = require("sequelize");

const insertOrder = async (
  total,
  tenderedAmount,
  change,
  referenceNumber,
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
        referenceNumber,
        orderedBy,
        status,
      },
      { transaction }
    );
    await transaction.commit();

      const orderWithDetails = await Order.findByPk(order.id, {
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

      getIO().emit("orderAdded", orderWithDetails);


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

const findOrdersByDateRange = async (from, to) => {
    try {
        const orders = await Order.findAll({
            where: {
                createdAt: {
                    [Op.between]: [new Date(from), new Date(to)],
                },
            },
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
            order: [["createdAt", "ASC"]],
        });

        // Flatten into CSV/Excel-friendly data
        return orders.flatMap((order) =>
            order.orderItems.map((item) => ({
                orderId: order.id,
                date: order.createdAt,
                customer: order.orderedBy,
                item: item.menuItem?.name || "Unknown",
                qty: item.quantity,
                price: item.price,
                total: item.quantity * item.price,
                paymentStatus: order.status,
            }))
        );
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

    const updatedOrder = await findOrderById(orderId);

    getIO().emit("orderStatusUpdated", updatedOrder);
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
findOrdersByDateRange,
};
