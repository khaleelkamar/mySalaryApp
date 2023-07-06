require('dotenv').config(); // Load environment variables from .env file

export const config = {
    HOST: process.env.HOST || 'localhost',
    USER: process.env.USER || 'postgres',
    PASSWORD: process.env.PASSWORD || 'password',
    DB: process.env.DB || 'myappDb',
    dialect: process.env.DB_DIALECT || 'postgres',
    pool: {
      max: parseInt(process.env.POOL_MAX || '5', 10),
      min: parseInt(process.env.POOL_MIN || '0', 10),
      acquire: parseInt(process.env.POOL_ACQUIRE || '30000', 10),
      idle: parseInt(process.env.POOL_IDLE || '10000', 10),
    },
  };
  