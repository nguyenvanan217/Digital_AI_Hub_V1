import { Application } from 'express';
import publicRouter from './publicRoutes';
import protectedRouter from './protectedRoutes';
import adminRouter from './adminRoutes';

const initAPIRoutes = (app: Application) => {
    app.use('/api/v1', publicRouter);
    app.use('/api/v1', protectedRouter);
    app.use('/api/v1', adminRouter);
};
export default initAPIRoutes;
