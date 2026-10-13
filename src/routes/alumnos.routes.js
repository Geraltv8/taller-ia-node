import { Router } from 'express';
import { createAlumno, errorResponse, getAlumnoById, matricularAlumno } from '../services/academic.service.js';
import { getMateriaById } from '../services/academic.service.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const alumno = await createAlumno(req.body);
    res.status(201).json(alumno);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode || 400);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const alumno = await getAlumnoById(req.params.id);

    if (!alumno) {
      return errorResponse(res, 'Alumno no encontrado.', 404);
    }

    const inscripciones = await Promise.all(
      (alumno.inscripciones || []).map(async (materiaId) => getMateriaById(materiaId))
    );

    return res.status(200).json({
      ...alumno,
      inscripciones: inscripciones
        .filter(Boolean)
        .map(({ _id, codigo, nombre, estado, cargaHoraria }) => ({
          _id,
          codigo,
          nombre,
          estado,
          cargaHoraria
        }))
    });
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
});

router.post('/:id/matricular', async (req, res) => {
  try {
    const result = await matricularAlumno(req.params.id, req.body?.materiaId);
    return res.status(200).json(result);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 400);
  }
});

export default router;
