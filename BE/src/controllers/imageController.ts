import express from 'express';
import { uploadImage } from '../services/imageService';
// import authenticateToken from '../middlewares/authMiddleware';

const imageController = express.Router();

imageController.post('/upload', uploadImage);

export default imageController;
