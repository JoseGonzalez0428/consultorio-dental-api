const mongoose = require('mongoose');

const ResenaSchema = mongoose.Schema({
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
    calificacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comentario: {
        type: String,
        required: false,
        default: ''
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'resenas'
});

module.exports = mongoose.model('Resena', ResenaSchema);