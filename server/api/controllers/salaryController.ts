import { Request, Response } from 'express';
import db from '../../model';
const { user: User, salary: Salary } = db;
import { Op } from 'sequelize'; // Import the Op operator from Sequelize
import { validationResult } from 'express-validator';

export const createSalary = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, salary, currency, department, sub_department, on_contract } =
    req.body;

    // Validate request body parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ status: 400, errors: errors.array() });
    return;
  }

  try {
    const newSalary = await Salary.create({
      name,
      salary,
      currency,
      department,
      sub_department,
      on_contract,
    });

    res
      .status(201)
      .json({
        status: 201,
        message: 'Record created successfully',
        data: newSalary,
      });
  } catch (error) {
    console.error('Error during record creation:', error);
    res.status(500).json({ status: 500,errors:[{"msg": 'Internal server error' }]});
  }
};

export const deleteSalary = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedSalary = await Salary.destroy({ where: { id } });

    if (deletedSalary === 0) {
      res.status(404).json({ status: 404, errors:[{"msg": 'Record not found' }]});
      return;
    }

    res.status(200).json({ status: 200, message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error during record deletion:', error);
    res.status(500).json({ status: 500, errors:[{"msg": 'Internal server error' }] });
  }
};

export const getSalaryStats = async (req: Request, res: Response): Promise<void> => {
  const { starting, ending } = req.query

      // Validate request body parameters
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ status: 400, errors: errors.array() });
        return;
      }

  try {
    // Calculate the mean, minimum, and maximum salaries for the provided financial year
    const stats = await Salary.findOne({
      attributes: [
        [Salary.sequelize.fn('AVG', Salary.sequelize.col('salary')), 'meanSalary'],
        [Salary.sequelize.fn('MIN', Salary.sequelize.col('salary')), 'minSalary'],
        [Salary.sequelize.fn('MAX', Salary.sequelize.col('salary')), 'maxSalary'],
      ],
      where: {
        createdAt: {
          [Op.between]: [new Date(`${starting}-04-01`), new Date(`${ending}-03-31`)],
        },
      },
    });

    if (!stats) {
      res.status(404).json({ status: 404, errors:[{"msg": 'No salary stats found for the provided financial year' }]});
      return;
    }

    res.status(200).json({ status: 200, data: stats ,message: "salary details",});
  } catch (error) {
    console.error('Error fetching salary stats:', error);
    res.status(500).json({ status: 500,errors:[{"msg": error }] });
  }
};




export const getSalaryStatsByDepartment = async (_: Request, res: Response): Promise<void> => {
  try {
    // Calculate the mean, minimum, and maximum salaries for each unique department
    const stats = await Salary.findAll({
      attributes: [
        'department',
        [Salary.sequelize.fn('AVG', Salary.sequelize.col('salary')), 'meanSalary'],
        [Salary.sequelize.fn('MIN', Salary.sequelize.col('salary')), 'minSalary'],
        [Salary.sequelize.fn('MAX', Salary.sequelize.col('salary')), 'maxSalary'],
      ],
      group: ['department'],
    });

    if (!stats || stats.length === 0) {
      res.status(404).json({ status: 404, message: 'No salary stats found' });
      return;
    }

    res.status(200).json({ status: 200, data: stats });
  } catch (error) {
    console.error('Error fetching salary stats:', error);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

export const getSalaryStatsByDepartmentAndSubDepartment = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    // Calculate the mean, minimum, and maximum salaries for each combination of department and sub-department
    const stats = await Salary.findAll({
      attributes: [
        'department',
        'sub_department',
        [
          Salary.sequelize.fn('ROUND', Salary.sequelize.fn('AVG', Salary.sequelize.col('salary')), 2),
          'meanSalary'
        ],
        [
          Salary.sequelize.fn('MIN', Salary.sequelize.col('salary')),
          'minSalary'
        ],
        [
          Salary.sequelize.fn('MAX', Salary.sequelize.col('salary')),
          'maxSalary'
        ],
      ],
      group: ['department', 'sub_department'],
      raw: true,
    });

    if (!stats || stats.length === 0) {
      res.status(404).json({ status: 404, message: 'No salary stats found' });
      return;
    }

    // Group the statistics by department
    const groupedStats: { [key: string]: { sub_department: string; meanSalary: number | null; minSalary: number; maxSalary: number; }[] } = stats.reduce((result:any, stat:any) => {
      const department: string = stat.department;
      const subDepartment: string = stat.sub_department;
      const meanSalary: number | null = stat.meanSalary;
      const minSalary: number = stat.minSalary;
      const maxSalary: number = stat.maxSalary;

      if (!result[department]) {
        result[department] = [];
      }

      result[department].push({
        sub_department: subDepartment,
        meanSalary: meanSalary !== null && !isNaN(meanSalary) ? Number(meanSalary) : null,
        minSalary,
        maxSalary,
      });

      return result;
    }, {});

    res.status(200).json({ status: 200, data: groupedStats });
  } catch (error) {
    console.error('Error fetching salary stats:', error);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};





export const getAllSalaries = async (_: Request, res: Response): Promise<void> => {
  try {
    const salaries = await Salary.findAll();

    if (!salaries || salaries.length === 0) {
      res.status(404).json({ status: 404, message: 'No salaries found' });
      return;
    }

    res.status(200).json({ status: 200, data: salaries });
  } catch (error) {
    console.error('Error fetching salaries:', error);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};


export const getSalaryStatsOnContract = async (req: Request, res: Response): Promise<void> => {
  const { starting, ending } = req.query;

  // Validate request query parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ status: 400, errors: errors.array() });
    return;
  }

  try {
    // Calculate the mean, minimum, and maximum salaries for the provided financial year
    const stats = await Salary.findOne({
      attributes: [
        [Salary.sequelize.fn('AVG', Salary.sequelize.col('salary')), 'meanSalary'],
        [Salary.sequelize.fn('MIN', Salary.sequelize.col('salary')), 'minSalary'],
        [Salary.sequelize.fn('MAX', Salary.sequelize.col('salary')), 'maxSalary'],
      ],
      where: {
        createdAt: {
          [Op.between]: [new Date(`${starting}-04-01`), new Date(`${ending}-03-31`)],
        },
        on_contract: true, // Consider records where on_contract is true
      },
    });

    if (!stats) {
      res.status(404).json({ status: 404, errors: [{ msg: 'No salary stats found for the provided financial year' }] });
      return;
    }

    res.status(200).json({ status: 200, data: stats, message: 'Contract users salary details' });
  } catch (error) {
    console.error('Error fetching salary stats:', error);
    res.status(500).json({ status: 500, errors: [{ msg: error }] });
  }
};


