const mongoose = require('mongoose');

const ReporteSchema = mongoose.Schema({
    id_cita: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cita',
        required: true
    },
    id_tratamiento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tratamiento',
        required: true
    },
    id_paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    notas: {
        type: String,
        required: true
    },
    fecha_reporte: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'reportes'
});

module.exports = mongoose.model('Reporte', ReporteSchema);