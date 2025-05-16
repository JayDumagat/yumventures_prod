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

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const parseCategoryToInt = parseInt(categoryId, 10);
  const parsePriceToFloat = parseFloat(price);


  try {
    const menuItem = await insertMenuItem(
        name,
        description,
        parseCategoryToInt, 
        parsePriceToFloat,
        imagePath,
        status
      );
      

    if (!menuItem) {
      return res.status(400).json({ message: "Menu item creation failed" });
    }

    res
      .status(201)
      .json({ message: "Menu item created successfully", menuItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMenuItems = async (req, res) => {
  const {page, status, search, pageSize} = req.query;
  console.log('Query parameters:', req.query);
  try {
    const menuItems = await findAllMenuItems(page, status, search, pageSize);
    res.status(200).json(menuItems);
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, categoryId, price, status } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const parseCategoryToInt = parseInt(categoryId, 10);
  const parsePriceToFloat = parseFloat(price);

  try {
    const menuItem = await editMenuItem(
      id,
      name,
      description,
      parseCategoryToInt, 
      parsePriceToFloat,
      imagePath ,
      status
    );
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res
      .status(200)
      .json({ message: "Menu item updated successfully", menuItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await removeMenuItem(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const popularMenuItems = async (req, res) => {

  try {
    const popularMenuItems = await findAllPopularMenuItems();
    res.status(200).json(
      popularMenuItems,
    );
  } catch (error) {
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
