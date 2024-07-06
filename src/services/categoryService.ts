// services/categoryService.ts
import { Request, Response } from 'express';
import { StatusCode } from '../enum/AppConst';
import Category from '../models/Category';

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.status(StatusCode.SUCCESS).json({ data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Failed to fetch categories' });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: 'Category not found' });
    }
    res.status(StatusCode.SUCCESS).json({ data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Failed to fetch category' });
  }
};

const createCategory = async (req: Request, res: Response) => {
  const { category_name, slug, parent_id } = req.body;

  try {
    const category = await Category.create({
      category_name,
      slug,
      parent_id,
    });

    res.status(StatusCode.CREATED_SUCCESS).json({ data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Failed to create category' });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { category_name, slug, parent_id } = req.body;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: 'Category not found' });
    }
    // Update category properties
    category.category_name = category_name;
    category.slug = slug;
    category.parent_id = parent_id;
    await category.save();
    res.status(StatusCode.SUCCESS).json({ data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Failed to update category' });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: 'Category not found' });
    }
    await Category.destroy({ where: { id: id } });
    res
      .status(StatusCode.SUCCESS)
      .json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Failed to delete category' });
  }
};

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
