const mongoose = require('mongoose');

const CitaSchema = mongoose.Schema({
    id_paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    id_tratamiento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tratamiento',
        required: true
    },
    fecha: {
        type: String,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Terminado', 'Cancelado'],
        default: 'Pendiente'
    }
}, {
    collection: 'citas'
});

module.exports = mongoose.model('Cita', CitaSchema);