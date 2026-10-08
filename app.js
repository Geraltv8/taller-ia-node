import 'dotenv/config';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './src/config/db.js';
import { globalRateLimit } from './src/middlewares/rateLimit.middleware.js';
import healthRoutes from './src/routes/health.routes.js';

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  }
}));
app.use(morgan('dev'));
app.use(globalRateLimit);
app.use(express.json());

app.use('/api/health', healthRoutes);

export async function startServer() {
  try {
    if (process.env.SKIP_DB?.toLowerCase() === 'true') {
      console.warn('Conexión a MongoDB omitida por SKIP_DB=true');
    } else {
      await connectDB();
    }

    const port = Number(process.env.PORT) || 3000;
    app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port} http://localhost:${port}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  startServer();
}

export default app;
