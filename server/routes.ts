import { Application } from 'express';
import appRouter from './api/controllers/router';
export default function routes(app: Application): void {
  app.use('/api/v1', appRouter);
}
