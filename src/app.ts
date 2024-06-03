import dotenv from 'dotenv';
import express from 'express';
import sequelize from './config/db';
import authController from './controllers/authController';
import imageController from './controllers/imageController';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authController);
app.use('/api/image', imageController);

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
