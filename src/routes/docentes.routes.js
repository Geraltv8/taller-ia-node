import { Router } from 'express';
import { createDocente, errorResponse, listDocentes } from '../services/academic.service.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const docente = await createDocente(req.body);
    return res.status(201).json(docente);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 400);
  }
});

router.get('/', async (_req, res) => {
  try {
    const docentes = await listDocentes();
    return res.status(200).json(docentes);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
});

export default router;
