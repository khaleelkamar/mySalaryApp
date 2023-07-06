import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const bcrypt = require('bcrypt');
import db from '../../model';
import { JWT_SECRET } from '../../common/constants';
import { validationResult } from 'express-validator';

const { user: User } = db;

export const login = async (req: Request, res: Response): Promise<void> => {
  const { userName, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ status: 400, errors: errors.array() });
    return;
  }

  try {
    const user = await User.findOne({ where: { username: userName } });

    if (!user) {
      res.status(404).json({ status: 404, message: 'User not found' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ status: 401, message: 'Invalid password' });
      return;
    }

    const { password: _password, ...userData } = user.toJSON();

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ status: 200, message: 'Login successful', token, data: userData });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};
