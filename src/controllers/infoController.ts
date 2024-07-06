// controllers/infoController.ts
import express from 'express';
import {
  getInfo,
  newInfo,
  editInfo,
  deleteInfo,
} from '../services/infoService';

const infoController = express.Router();

infoController.get('/', getInfo);
infoController.post('/', newInfo);
infoController.put('/:id', editInfo);
infoController.delete('/:id', deleteInfo);

export default infoController;
