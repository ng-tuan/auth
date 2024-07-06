// controllers/infoController.ts
import express from 'express';
import {
  getInfo,
  newInfo,
  editInfo,
  deleteInfo,
} from '../services/infoService';

const infoController = express.Router();

infoController.get('/getInfo', getInfo);
infoController.post('/newInfo', newInfo);
infoController.put('/editInfo/:id', editInfo);
infoController.delete('/deleteInfo/:id', deleteInfo);

export default infoController;
