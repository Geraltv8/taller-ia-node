import mongoose from 'mongoose';

const docenteSchema = new mongoose.Schema({
  legajo: {
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
  materias: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Materia'
  }]
}, {
  timestamps: true
});

const Docente = mongoose.model('Docente', docenteSchema);

export default Docente;
