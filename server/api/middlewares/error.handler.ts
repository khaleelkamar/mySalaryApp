import { Request, Response, NextFunction } from 'express';

export default function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.log("_req==>",_req)
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  const data = err.data || null;
  const apiErrorMessage = err.apiErrorMessage || null;
  const extraMessage = 'This is an API YAML validation error';

  const errors = err.errors || [{ message: message }];

  if (apiErrorMessage) {
    errors.push({ message: apiErrorMessage });
  }

  errors.push({ message: extraMessage });

  res.status(status).json({ status, message, data, extraMessage });
}
