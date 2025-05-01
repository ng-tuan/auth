import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3307,
    dialect: 'mysql',
    define: {
      timestamps: false,
    },
    logging: false, // Disable SQL query logging in production
  },
);

export default sequelize;
