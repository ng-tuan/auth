import dotenv from 'dotenv';
import express from 'express';
import sequelize from './config/db';
import authController from './controllers/authController';
import commonController from './controllers/commonController';
import imageController from './controllers/imageController';
import infoController from './controllers/infoController';
import categoryController from './controllers/categoryController';
import postController from './controllers/postController';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authController);
app.use('/api/image', imageController);
app.use('/api/com', commonController);
app.use('/api/info', infoController);
app.use('/api/category', categoryController);
app.use('/api/post', postController);

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
