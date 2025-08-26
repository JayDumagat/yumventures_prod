const {
  insertMenuItem,
  findAllMenuItems,
  findMenuItemById,
  editMenuItem,
  removeMenuItem,
  findAllPopularMenuItems,
} = require("../services/menuItemService");

const createMenuItem = async (req, res) => {
  const { name, description, categoryId, price, status } = req.body;

  const parseCategoryToInt = parseInt(categoryId, 10);
  const parsePriceToFloat = parseFloat(price);

  try {
    const menuItem = await insertMenuItem(
        name,
        description,
        parseCategoryToInt,
        parsePriceToFloat,
        req.file, // Pass the entire file object to the service
        status
    );

    if (!menuItem) {
      return res.status(400).json({ message: "Menu item creation failed" });
    }

    res
        .status(201)
        .json({ message: "Menu item created successfully", menuItem });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAllMenuItems = async (req, res) => {
  const {page, status, search, pageSize} = req.query;
  console.log('Query parameters:', req.query);
  try {
    const result = await findAllMenuItems(page, status, search, pageSize);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: error.message });
  }
};

const getMenuItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await findMenuItemById(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, categoryId, price, status } = req.body;

  const parseCategoryToInt = parseInt(categoryId, 10);
  const parsePriceToFloat = parseFloat(price);

  try {
    const updatedItem = await editMenuItem(
        id,
        name,
        description,
        parseCategoryToInt,
        parsePriceToFloat,
        req.file, // Pass the entire file object to the service
        status
    );

    res.status(200).json({ message: "Menu item updated successfully", menuItem: updatedItem });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    await removeMenuItem(id);
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: error.message });
  }
};

const popularMenuItems = async (req, res) => {
  try {
    const popularMenuItems = await findAllPopularMenuItems();
    res.status(200).json(popularMenuItems);
  } catch (error) {
    console.error('Error fetching popular menu items:', error);
    res.status(500).json({ error: error.message});
  }
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  popularMenuItems,
};