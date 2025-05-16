const {insertCategory, findCategories, findCategoryById, findCategoryByName, editCategory, removeCategory} = require('../services/categoryService');

const createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {

        checkDuplications =  await findCategoryByName(name);
        if (checkDuplications) {
            return res.status(409).json({ message: 'Category already exists' });
        }

        const category = await insertCategory(name, description);
        return res.json(category);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await findCategories();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getCategoryById = async (req, res) => {
    const {id} = req.params;
    try {
        const category = await findCategoryById(id);
        if (!category) {
            return res.status(404).json({message: 'Category not found'});
        }
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const updateCategory = async (req, res) => {
    const {id} = req.params;
    const {name, description} = req.body;
    try {
        const category = await editCategory(id, name, description);
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const deleteCategory = async (req, res) => {
    const {id} = req.params;
    console.log(id);
    try {
        await removeCategory(id);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

module.exports = { 
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}