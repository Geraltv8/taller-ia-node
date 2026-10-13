import mongoose from 'mongoose';

const materiaSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  cargaHoraria: {
    type: Number,
    required: true,
    min: 10
  },
  estado: {
    type: String,
    enum: ['ACTIVA', 'INACTIVA'],
    default: 'ACTIVA'
  }
}, {
  timestamps: true
});

const Materia = mongoose.model('Materia', materiaSchema);

export default Materia;
