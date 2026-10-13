import mongoose from 'mongoose';
import Materia from '../models/materia.model.js';
import Alumno from '../models/alumno.model.js';
import Docente from '../models/docente.model.js';

const memoryStore = {
  materias: [],
  alumnos: [],
  docentes: []
};

function ensureText(value, fieldName) {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} debe ser un texto válido.`);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} es obligatorio.`);
  }

  return normalized;
}

function normalizeName(value, fieldName) {
  const text = ensureText(value, fieldName);
  return text.replace(/\s+/g, ' ');
}

function isMemoryMode() {
  return process.env.SKIP_DB?.toLowerCase() === 'true' || mongoose.connection.readyState !== 1;
}

function createEntityId() {
  return new mongoose.Types.ObjectId().toHexString();
}

function toPlainObject(record) {
  if (!record) {
    return null;
  }

  if (typeof record.toObject === 'function') {
    return record.toObject();
  }

  return { ...record };
}

function normalizeMateriaRecord(record) {
  const materialized = toPlainObject(record);
  if (!materialized) {
    return null;
  }

  return {
    ...materialized,
    _id: String(materialized._id || materialized.id),
    codigo: String(materialized.codigo || '').toUpperCase(),
    nombre: String(materialized.nombre || ''),
    cargaHoraria: Number(materialized.cargaHoraria),
    estado: materialized.estado || 'ACTIVA'
  };
}

function normalizeAlumnoRecord(record) {
  const materialized = toPlainObject(record);
  if (!materialized) {
    return null;
  }

  return {
    ...materialized,
    _id: String(materialized._id || materialized.id),
    matricula: String(materialized.matricula || ''),
    nombreCompleto: String(materialized.nombreCompleto || ''),
    email: String(materialized.email || '').toLowerCase(),
    inscripciones: (materialized.inscripciones || []).map(item => String(item?._id || item?.id || item))
  };
}

export async function listMaterias(estado) {
  if (isMemoryMode()) {
    const records = memoryStore.materias.filter(item => !estado || item.estado === estado);
    return records.map(normalizeMateriaRecord);
  }

  const query = {};
  if (estado) {
    query.estado = estado;
  }

  const records = await Materia.find(query).sort({ codigo: 1 }).lean();
  return records.map(normalizeMateriaRecord);
}

export async function createMateria(data) {
  const codigo = ensureText(data?.codigo, 'codigo').toUpperCase();
  const nombre = normalizeName(data?.nombre, 'nombre');
  const cargaHoraria = Number(data?.cargaHoraria);

  if (!Number.isInteger(cargaHoraria) || cargaHoraria < 10) {
    throw Object.assign(new Error('cargaHoraria debe ser un entero mayor o igual a 10.'), { statusCode: 400 });
  }

  if (!['ACTIVA', 'INACTIVA'].includes(data?.estado || 'ACTIVA')) {
    throw Object.assign(new Error('estado debe ser ACTIVA o INACTIVA.'), { statusCode: 400 });
  }

  if (isMemoryMode()) {
    if (memoryStore.materias.some(item => item.codigo === codigo)) {
      throw Object.assign(new Error('La materia ya existe.'), { statusCode: 400 });
    }

    const materia = {
      _id: createEntityId(),
      codigo,
      nombre,
      cargaHoraria,
      estado: data?.estado || 'ACTIVA'
    };

    memoryStore.materias.push(materia);
    return normalizeMateriaRecord(materia);
  }

  const existing = await Materia.findOne({ codigo }).lean();
  if (existing) {
    throw Object.assign(new Error('La materia ya existe.'), { statusCode: 400 });
  }

  const materia = await Materia.create({
    codigo,
    nombre,
    cargaHoraria,
    estado: data?.estado || 'ACTIVA'
  });

  return normalizeMateriaRecord(materia);
}

export async function getMateriaById(materiaId) {
  if (isMemoryMode()) {
    const materia = memoryStore.materias.find(item => String(item._id) === String(materiaId));
    return materia ? normalizeMateriaRecord(materia) : null;
  }

  const materia = await Materia.findById(materiaId).lean();
  return materia ? normalizeMateriaRecord(materia) : null;
}

export async function createAlumno(data) {
  const matricula = ensureText(data?.matricula, 'matricula');
  const nombreCompleto = normalizeName(data?.nombreCompleto, 'nombreCompleto');
  const email = ensureText(data?.email, 'email').toLowerCase();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    throw Object.assign(new Error('email no tiene un formato válido.'), { statusCode: 400 });
  }

  if (isMemoryMode()) {
    if (memoryStore.alumnos.some(item => item.matricula === matricula || item.email === email)) {
      throw Object.assign(new Error('La matrícula o el email ya existen.'), { statusCode: 400 });
    }

    const alumno = {
      _id: createEntityId(),
      matricula,
      nombreCompleto,
      email,
      inscripciones: []
    };

    memoryStore.alumnos.push(alumno);
    return normalizeAlumnoRecord(alumno);
  }

  const existing = await Alumno.findOne({ $or: [{ matricula }, { email }] }).lean();
  if (existing) {
    throw Object.assign(new Error('La matrícula o el email ya existen.'), { statusCode: 400 });
  }

  const alumno = await Alumno.create({
    matricula,
    nombreCompleto,
    email,
    inscripciones: []
  });

  return normalizeAlumnoRecord(alumno);
}

export async function getAlumnoById(alumnoId) {
  if (isMemoryMode()) {
    const alumno = memoryStore.alumnos.find(item => String(item._id) === String(alumnoId));
    return alumno ? normalizeAlumnoRecord(alumno) : null;
  }

  const alumno = await Alumno.findById(alumnoId).populate('inscripciones', 'codigo nombre estado cargaHoraria').lean();
  return alumno ? normalizeAlumnoRecord(alumno) : null;
}

export async function createDocente(data) {
  const legajo = ensureText(data?.legajo, 'legajo');
  const nombreCompleto = normalizeName(data?.nombreCompleto, 'nombreCompleto');
  const email = ensureText(data?.email, 'email').toLowerCase();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    throw Object.assign(new Error('email no tiene un formato válido.'), { statusCode: 400 });
  }

  if (isMemoryMode()) {
    if (memoryStore.docentes.some(item => item.legajo === legajo || item.email === email)) {
      throw Object.assign(new Error('El legajo o email ya existen.'), { statusCode: 400 });
    }

    const docente = {
      _id: createEntityId(),
      legajo,
      nombreCompleto,
      email,
      materias: Array.isArray(data?.materias) ? data.materias.map(id => String(id)) : []
    };

    memoryStore.docentes.push(docente);
    return { ...docente, _id: String(docente._id) };
  }

  const existing = await Docente.findOne({ $or: [{ legajo }, { email }] }).lean();
  if (existing) {
    throw Object.assign(new Error('El legajo o email ya existen.'), { statusCode: 400 });
  }

  const docente = await Docente.create({
    legajo,
    nombreCompleto,
    email,
    materias: Array.isArray(data?.materias) ? data.materias : []
  });

  return toPlainObject(docente);
}

export async function listDocentes() {
  if (isMemoryMode()) {
    return memoryStore.docentes.map(item => ({ ...item, _id: String(item._id) }));
  }

  return Docente.find().sort({ legajo: 1 }).lean();
}

export async function matricularAlumno(alumnoId, materiaId) {
  const alumno = isMemoryMode()
    ? memoryStore.alumnos.find(item => String(item._id) === String(alumnoId))
    : await Alumno.findById(alumnoId);

  if (!alumno) {
    throw Object.assign(new Error('Alumno no encontrado.'), { statusCode: 404 });
  }

  const materia = isMemoryMode()
    ? memoryStore.materias.find(item => String(item._id) === String(materiaId))
    : await Materia.findById(materiaId);

  if (!materia) {
    throw Object.assign(new Error('Materia no encontrada.'), { statusCode: 404 });
  }

  const materiaObjectId = String(materia._id || materia.id);
  const inscripciones = isMemoryMode() ? (alumno.inscripciones || []) : (alumno.inscripciones || []).map(item => String(item));

  if (inscripciones.includes(materiaObjectId)) {
    throw Object.assign(new Error('El alumno ya se encuentra matriculado en esta materia.'), { statusCode: 400 });
  }

  if ((materia.estado || 'ACTIVA') !== 'ACTIVA') {
    throw Object.assign(new Error('No se puede matricular a un alumno en una materia inactiva.'), { statusCode: 400 });
  }

  if (isMemoryMode()) {
    alumno.inscripciones = [...(alumno.inscripciones || []), materiaObjectId];
    return { mensaje: 'Inscripción exitosa' };
  }

  alumno.inscripciones.push(materia._id);
  await alumno.save();

  return { mensaje: 'Inscripción exitosa' };
}

export function errorResponse(res, message, status = 400) {
  return res.status(status).json({ error: true, mensaje: message });
}
