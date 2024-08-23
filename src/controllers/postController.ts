import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../services/postService';

const postController = express.Router();

postController.get('/', getAllPosts);
postController.get('/:id', getPostById);
postController.post('/', createPost);
postController.put('/:id', updatePost);
postController.delete('/:id', deletePost);

export default postController;
