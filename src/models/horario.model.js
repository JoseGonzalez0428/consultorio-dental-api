const mongoose = require('mongoose');

const HorarioSchema = mongoose.Schema({
    fecha: {
        type: String,
        required: true
    },
    hora_inicio: {
        type: String,
        required: true
    },
    hora_fin: {
        type: String,
        required: true
    }
}, {
    collection: 'horarios'
});

module.exports = mongoose.model('Horario', HorarioSchema);