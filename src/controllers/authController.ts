import express from 'express';
import { login, register } from '../services/authService';

const authController = express.Router();

authController.post('/register', register);
authController.post('/login', login);

export default authController;
