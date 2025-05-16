const {MenuItem, Category, OrderItem, sequelize} = require('../models');
const { fn, col, literal } = require('sequelize');
const insertMenuItem = async (name, description, categoryId, price, imagePath, status) => {

    const transaction = await sequelize.transaction();

    try {
        
        const menuItem = await MenuItem.create({
            name,
            categoryId,
            description,
            price,
            image: imagePath,
            status
        }, { transaction });

        await transaction.commit();
        return menuItem;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

const findAllMenuItems = async () => {
    try {
        const menuItems = await MenuItem.findAll({
            attributes: {
                exclude: ['categoryId'], 
            },
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                    as: 'category',
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return menuItems;
    } catch (error) {
        throw error;
    }
}

const findMenuItemById = async (id) => {
    try {
        const menuItem = await MenuItem.findByPk(id);
        return menuItem;
    } catch (error) {
        throw error;
    }
}

const editMenuItem = async (id, name, description,  categoryId, price, imagePath, status) => {
    const transaction = await sequelize.transaction();

    try {
        const menuItem = await MenuItem.findByPk(id);

        if (!menuItem) {
            throw new Error('Menu item not found');
        }

        menuItem.name = name;
        menuItem.categoryId = categoryId;
        menuItem.description = description;
        menuItem.price = price;
        menuItem.image = imagePath ? imagePath : menuItem.image;
        menuItem.status = status;

        await menuItem.save({ transaction });
        await transaction.commit();
        return menuItem;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

const removeMenuItem = async (id) => {
    const transaction = await sequelize.transaction();

    try {
        const menuItem = await MenuItem.findByPk(id);

        if (!menuItem) {
            throw new Error('Menu item not found');
        }

        await menuItem.destroy({ transaction });
        await transaction.commit();
        return menuItem;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}


const findAllPopularMenuItems = async () => {
    try {
        // First query: Get the sum of quantities for each menu item
        const menuItemsWithCounts = await MenuItem.findAll({
            attributes: [
                'id',
                'name',
                'description',  
                'price',
                'image',
                [fn('COALESCE', fn('SUM', col('orderItems.quantity')), 0), 'totalQuantitySold'],
            ],
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    attributes: [],
                    required: false  // LEFT JOIN to include menu items with zero orders
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                }
            ],
            group: ['MenuItem.id', 'category.id'],
            order: [[literal('totalQuantitySold'), 'DESC']],
            
        });
        
        return menuItemsWithCounts;
    } catch (error) {
        console.error('Error fetching popular menu items:', error);
        throw error;
    }
};





module.exports = {
    insertMenuItem,
    findAllMenuItems,
    findMenuItemById,
    editMenuItem,
    removeMenuItem,
    findAllPopularMenuItems
}