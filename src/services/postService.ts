import { Request, Response } from 'express';
import Post from '../models/Post';
import { StatusCode } from '../enum/AppConst';

// Get all posts
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll();
    res.status(StatusCode.SUCCESS).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Failed to fetch posts' });
  }
};

// Get post by ID
export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: 'Post not found' });
    }
    res.status(StatusCode.SUCCESS).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Failed to fetch post' });
  }
};

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  const { author_id, title, content, excerpt, status, slug, category_id } =
    req.body;
  try {
    const post = await Post.create({
      author_id,
      title,
      excerpt,
      content,
      status,
      slug,
      category_id,
    });
    res.status(StatusCode.CREATED_SUCCESS).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Failed to create post' });
  }
};

// Update a post
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { author_id, title, excerpt, status, slug, category_id } = req.body;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: 'Post not found' });
    }
    await post.update({ author_id, title, excerpt, status, slug, category_id });
    res.status(StatusCode.SUCCESS).json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Failed to update post' });
  }
};

// Delete a post
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: 'Post not found' });
    }
    await post.destroy();
    res
      .status(StatusCode.SUCCESS)
      .json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Failed to delete post' });
  }
};
