import { Application, RequestHandler } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const allowedOrigins = process.env.AUTH_URL?.split(',') ?? ['http://localhost:3000'];

const corsMiddleware: RequestHandler = (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }

    next();
};

const configCors = (app: Application): void => {
    app.use(corsMiddleware);
};

export default configCors;
