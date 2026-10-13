import 'dotenv/config';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './src/config/db.js';
import { globalRateLimit } from './src/middlewares/rateLimit.middleware.js';
import alumnosRoutes from './src/routes/alumnos.routes.js';
import docentesRoutes from './src/routes/docentes.routes.js';
import healthRoutes from './src/routes/health.routes.js';
import materiasRoutes from './src/routes/materias.routes.js';

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
app.use('/api/materias', materiasRoutes);
app.use('/api/alumnos', alumnosRoutes);
app.use('/api/docentes', docentesRoutes);

app.use((req, res) => {
  res.status(404).json({ error: true, mensaje: `Ruta no encontrada: ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  const status = error.statusCode || 500;
  const message = error.message || 'Error interno del servidor';
  res.status(status).json({ error: true, mensaje: message });
});

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
