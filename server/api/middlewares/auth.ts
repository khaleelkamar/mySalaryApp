import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyCallback } from 'jsonwebtoken';
import { JWT_SECRET } from '../../common/constants';

interface AuthenticatedRequest extends Request {
  user?: any;
}

const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void | Response<any, Record<string, any>> => {
  console.log(req.headers,"req.headers");
  const authHeader = req.headers['accesstoken'];

  if (!authHeader) {
    res.status(401).json({ status: 403, message: 'Access token is missing' });
    return;
  }
  
  const token = authHeader as string;
  
  jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, user: any) => {
    if (err) {
      res.status(403).json({ status: 403, message: 'Invalid access token' });
      return;
    }
  
    req.user = user;
    next();
  });
  
};

export default authenticateToken;
