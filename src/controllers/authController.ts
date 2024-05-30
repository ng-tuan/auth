import express from 'express';
import {register, login} from '../services/authService';

const authController = express.Router();

authController.post('/register', register);
authController.post('/login', login);

export default authController;