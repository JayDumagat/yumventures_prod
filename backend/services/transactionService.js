const { Order, User, sequelize } = require('../models');

const findAllOrders = async () => {
    try {
        const orders = await Order.findAll();
        return orders;
    } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
    }
};



// Paginated version for larger datasets
const findOrdersWithPagination = async (page = 1, limit = 10) => {
    try {
        const offset = (page - 1) * limit;
        
        const { count, rows } = await Order.findAndCountAll({
            attributes: [
                'id',
                'total',
                'tender',
                'change',
                'status',
                'createdAt'
            ],
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name'],
                }
            ],
            offset,
            limit
        });
        
        return {
            orders: rows,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        };
    } catch (error) {
        throw new Error('Error fetching paginated orders: ' + error.message);
    }
};

// Get a single order by ID
const findOrderById = async (id) => {
    try {
        const order = await Order.findByPk(id, {
            attributes: [
                'id',
                'total',
                'tender',
                'change',
                'status',
                'createdAt'
            ],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name'],
                }
            ]
        });
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        return order;
    } catch (error) {
        throw new Error(`Error fetching order #${id}: ${error.message}`);
    }
};

module.exports = {
    findAllOrders,
    findOrdersWithPagination,
    findOrderById
};