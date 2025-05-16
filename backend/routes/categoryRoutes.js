const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const authMiddleware = require("../middlewares/authMiddleware");
const categoryValidationSchema = require("../validators/categoryValidationSchema");
const validateRequest = require("../middlewares/validateRequest");

router.post(
  "/",
  authMiddleware,
  validateRequest,
  categoryValidationSchema,
  createCategory
);

router.get("/",  getCategories);

router.get("/:id", authMiddleware, getCategoryById);

router.put(
  "/:id",
  authMiddleware,
  validateRequest,
  categoryValidationSchema,
  updateCategory
);

router.delete("/:id", authMiddleware, deleteCategory);

module.exports = router;