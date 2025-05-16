const {Category, sequelize} = require("../models");

const insertCategory = async (name, description) => {
    const transaction = await sequelize.transaction();
    try {
        const category = await Category.create({
            name,
            description
        }, { transaction });

        await transaction.commit();
        return category;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}


const findCategories = async () => {
    try {
        const categories = await Category.findAll(
            {
                where: {
                    deletedAt: null
                },
                order: [
                    ['createdAt', 'ASC']
                ]
            }
        );
        return categories;
    } catch (error) {
        throw error;
    }
}

const findCategoryById = async (id) => {
    try {
        const category = await Category.findByPk(id);
        return category;
    } catch (error) {
        throw error;
    }
}

const findCategoryByName = async (name) => {
    try {
        const category = await Category.findOne({
            where: {
                name: name
            },
            paranoid: false
        });
        return category;
    } catch (error) {
        throw error;
    }
}

const editCategory = async (id, name, description) => {
    const transaction = await sequelize.transaction();

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            throw new Error("Category not found");
        }

        category.name = name;
        category.description = description;
        await category.save({ transaction });
        await transaction.commit();
        return category;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

const removeCategory = async (id) => {
    const transaction = await sequelize.transaction();

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            throw new Error("Category not found");
        }

        await category.destroy({ transaction });
        await transaction.commit();
        return category;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    insertCategory,
    findCategories,
    findCategoryById,
    findCategoryByName,
    editCategory,
    removeCategory
};