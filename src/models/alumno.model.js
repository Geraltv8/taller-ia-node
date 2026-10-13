import mongoose from 'mongoose';

const alumnoSchema = new mongoose.Schema({
  matricula: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nombreCompleto: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  inscripciones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Materia'
  }]
}, {
  timestamps: true
});

const Alumno = mongoose.model('Alumno', alumnoSchema);

export default Alumno;
