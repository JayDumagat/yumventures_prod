const {MenuItem, Category, OrderItem, sequelize} = require('../models');
const { fn, col, literal } = require('sequelize');
const { uploadImage, deleteImage } = require('./minioService');
const { getIO } = require("../utils/socket");
const {Op} = require("sequelize")
// Helper function to extract filename from image URL
const extractFilenameFromUrl = (imageUrl) => {
    if (!imageUrl) return null;

    // Handle different URL formats
    if (imageUrl.startsWith('/images/')) {
        return imageUrl.replace('/images/', '');
    }

    // Fallback to splitting by '/' and taking the last part
    return imageUrl.split("/").pop();
};

const insertMenuItem = async (name, description, categoryId, price, fileData, status) => {
    const transaction = await sequelize.transaction();

    let imagePath = null;

    if (fileData) {
        const uploadedImage = await uploadImage(
            fileData.buffer,
            fileData.originalname,
            fileData.mimetype
        );
        imagePath = uploadedImage.url;
    }

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

        const menuItemWithCategory = await MenuItem.findByPk(menuItem.id, {
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                    as: 'category',
                },
            ],
        });

        getIO().emit('menuItemAdded', menuItemWithCategory);
        return menuItem;
    } catch (error) {
        await transaction.rollback();

        if (imagePath) {
            const filename = extractFilenameFromUrl(imagePath);
            if (filename) {
                await deleteImage(filename);
            }
        }

        throw error;
    }
}

const findAllMenuItems = async (page, status, search, pageSize) => {
    try {
        const whereConditions = {};

        if (status && status !== 'all') {
            whereConditions.status = status;
        }

        if (search && search.trim()) {
            whereConditions[Op.or] = [
                { name: { [Op.like]: `%${search.trim()}%` } },
                { description: { [Op.like]: `%${search.trim()}%` } }
            ];
        }

        const limit = pageSize ? parseInt(pageSize, 10) : 10;
        const offset = page ? (parseInt(page, 10) - 1) * limit : 0;

        const { count, rows: menuItems } = await MenuItem.findAndCountAll({
            where: whereConditions,
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
            limit,
            offset,
        });

        return {
            menuItems,
            pagination: {
                currentPage: page ? parseInt(page, 10) : 1,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit
            }
        };
    } catch (error) {
        throw error;
    }
}

const findMenuItemById = async (id) => {
    try {
        return await MenuItem.findByPk(id, {
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                    as: 'category',
                },
            ],
        });
    } catch (error) {
        throw error;
    }
}

const editMenuItem = async (id, name, description,  categoryId, price, fileData, status) => {
    const transaction = await sequelize.transaction();

    try {
        const menuItem = await MenuItem.findByPk(id);

        if (!menuItem) {
            throw new Error('Menu item not found');
        }

        let newImagePath = menuItem.image; // Default to existing image
        let oldImageFilename = null;

        if (fileData) {
            // Upload new image first
            const uploadedImage = await uploadImage(
                fileData.buffer,
                fileData.originalname,
                fileData.mimetype
            );
            newImagePath = uploadedImage.url;

            // Store old image filename for deletion after successful update
            if (menuItem.image) {
                oldImageFilename = extractFilenameFromUrl(menuItem.image);
            }
        }

        menuItem.name = name;
        menuItem.categoryId = categoryId;
        menuItem.description = description;
        menuItem.price = price;
        menuItem.image = newImagePath;
        menuItem.status = status;

        await menuItem.save({ transaction });
        await transaction.commit();

        if (oldImageFilename && fileData) {
            const deleteResult = await deleteImage(oldImageFilename);
            if (!deleteResult) {
                console.warn(`Failed to delete old image: ${oldImageFilename}`);
            }
        }

        const updatedMenuItemWithCategory = await MenuItem.findByPk(id, {
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                    as: 'category',
                },
            ],
        });

        getIO().emit('menuItemUpdated', updatedMenuItemWithCategory);
        return menuItem;
    } catch (error) {
        await transaction.rollback();

        if (fileData && newImagePath && newImagePath !== menuItem.image) {
            const filename = extractFilenameFromUrl(newImagePath);
            if (filename) {
                await deleteImage(filename);
            }
        }

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

        const menuItemData = {
            id: menuItem.id,
            name: menuItem.name,
            description: menuItem.description,
            price: menuItem.price,
            image: menuItem.image,
            status: menuItem.status,
            category: menuItem.category
        };

        const imageFilename = menuItem.image ? extractFilenameFromUrl(menuItem.image) : null;

        await menuItem.destroy({ transaction });
        await transaction.commit();

        if (imageFilename) {
            const deleteResult = await deleteImage(imageFilename);
            if (!deleteResult) {
                console.warn(`Failed to delete image: ${imageFilename} for menu item ${id}`);
            }
        }

        getIO().emit('menuItemDeleted', {
            id: parseInt(id),
            menuItem: menuItemData
        });

        return menuItem;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}


const findAllPopularMenuItems = async () => {
    try {
        // First query: Get the sum of quantities for each menu item
        return await MenuItem.findAll({
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
