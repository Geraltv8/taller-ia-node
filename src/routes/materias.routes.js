import { Router } from 'express';
import { createMateria, errorResponse, listMaterias } from '../services/academic.service.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const materia = await createMateria(req.body);
    res.status(201).json(materia);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode || 400);
  }
});

router.get('/', async (req, res) => {
  try {
    const { estado } = req.query;
    const materias = await listMaterias(estado || undefined);
    res.status(200).json(materias);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode || 500);
  }
});

export default router;
