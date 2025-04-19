import express from 'express';
import { getMenu } from '../services/commonService';

const commonController = express.Router();

commonController.get('/menu', getMenu);

export default commonController;
