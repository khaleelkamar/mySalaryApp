import { Sequelize, Options } from 'sequelize';
import { config } from '../config/db.config';
import SalaryModel from './salary.model';
import UsersModel from './user.model';


type Dialect = 'mysql' | 'mariadb' | 'postgres' | 'mssql';

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  dialect: config.dialect as Dialect,
  host: config.HOST,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
} as Options);

const db: any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.salary = SalaryModel(sequelize);
db.user = UsersModel(sequelize);

export default db;
