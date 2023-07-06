import express from 'express';
import {login} from '../controllers/userController';
import {createSalary} from '../controllers/salaryController';
import {getAllSalaries} from '../controllers/salaryController';
import {deleteSalary} from '../controllers/salaryController';
import {getSalaryStats} from '../controllers/salaryController';
import {getSalaryStatsByDepartment} from '../controllers/salaryController';
import {getSalaryStatsByDepartmentAndSubDepartment} from '../controllers/salaryController';
import {getSalaryStatsOnContract} from '../controllers/salaryController';

import { body,query } from 'express-validator';
import authenticateToken from '../middlewares/auth';
const createSalaryValidationRules = [
  body('name').notEmpty().isString().withMessage('Name is required and must be a string'),
  body('salary')
    .notEmpty().isFloat({ gt: 0 }).withMessage('Salary is required and must be a number greater than 0')
    .custom((value) => {
      if (!/^\d+(\.\d+)?$/.test(value)) {
        throw new Error('Salary must be a valid number or decimal value');
      }
      return true;
    }),
  body('currency').notEmpty().isString().withMessage('Currency is required and must be a string'),
  body('department').notEmpty().isString().withMessage('Department is required and must be a string'),
  body('sub_department').notEmpty().isString().withMessage('Sub-department is required and must be a string'),
  body('on_contract').notEmpty().isBoolean().withMessage('On contract is required and must be a boolean'),
];



const validateGetSalaryStats = [
  query('starting')
    .notEmpty()
    .isInt()
    .withMessage('Starting year is required and must be an integer'),
  query('ending')
    .notEmpty()
    .isInt()
    .withMessage('Ending year is required and must be an integer')
    .custom((value, { req }) => {
      const startingYear = req.query && req.query.starting ? parseInt(req.query.starting.toString()) : undefined;
      const endingYear = parseInt(value);
      if (startingYear && endingYear <= startingYear) {
        throw new Error('Ending year must be greater than the starting year');
      }
      if (startingYear && endingYear !== startingYear + 1) {
        throw new Error('Ending year must be one year greater than the starting year');
      }
      return true;
    }),
];

const loginValidationRules = [
  body('userName').notEmpty().isString().withMessage('Username is required and must be a string'),
  body('password').notEmpty().isString().withMessage('Password is required and must be a string'),
];


export default express
  .Router()
  .post('/login', loginValidationRules, login)
  .post('/createSalary', authenticateToken,createSalaryValidationRules,createSalary)
  .get('/getAllSalaries', authenticateToken,getAllSalaries)
  .get('/deleteSalary/:id', authenticateToken,deleteSalary)
  .get('/getSalaryStats', authenticateToken,validateGetSalaryStats,getSalaryStats)
  .get('/getSalaryStatsOnContract', authenticateToken,validateGetSalaryStats,getSalaryStatsOnContract)
  .get('/getSalaryStatsByDepartment', authenticateToken,getSalaryStatsByDepartment)
  .get('/getSalaryStatsByDepartmentAndSubDepartment', authenticateToken,getSalaryStatsByDepartmentAndSubDepartment);
  



