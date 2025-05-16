// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { createMenuItem, getAllMenuItems, getMenuItemById, updateMenuItem, deleteMenuItem, popularMenuItems } = require('../controllers/menuItemController');

router.post('/', upload.single('image'), createMenuItem); 
router.get('/', getAllMenuItems); 
router.get('/most-popular', popularMenuItems); 
router.get('/:id', getMenuItemById); 
router.put('/:id', upload.single('image'), updateMenuItem); 
router.delete('/:id', deleteMenuItem);


module.exports = router;
