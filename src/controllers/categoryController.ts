// controllers/categoryController.ts
import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';

const categoryController = express.Router();

categoryController.get('/', getAllCategories);
categoryController.get('/:id', getCategoryById);
categoryController.post('/', createCategory);
categoryController.put('/:id', updateCategory);
categoryController.delete('/:id', deleteCategory);

export default categoryController;
