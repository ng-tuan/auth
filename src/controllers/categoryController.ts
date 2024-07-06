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

categoryController.get('/getCategory', getAllCategories);
categoryController.get('/getCategory/:id', getCategoryById);
categoryController.post('/createCategory', createCategory);
categoryController.put('/updateCategory/:id', updateCategory);
categoryController.delete('/deleteCategory/:id', deleteCategory);

export default categoryController;
