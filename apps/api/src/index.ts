import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';

import configCors from './config/cors';
import initAPIRoutes from './routes/api';

async function main() {
    const app = express();

    configCors(app);
    app.use(express.json());
    app.use(cookieParser());

    initAPIRoutes(app);

    const PORT = +process.env.PORT! || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}

main().catch((err) => {
    console.error('❌ Failed to start', err);
});
