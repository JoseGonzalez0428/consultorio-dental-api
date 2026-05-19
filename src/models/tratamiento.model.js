const mongoose = require('mongoose');

const TratamientoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    recomendaciones: {
        type: [String],
        default: []
    }
}, {
    collection: 'tratamientos'
});

module.exports = mongoose.model('Tratamiento', TratamientoSchema);