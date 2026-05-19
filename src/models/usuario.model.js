const mongoose = require('mongoose');

const UsuarioSchema = mongoose.Schema({
    nombres: {
        type: String,
        required: true
    },
    apellido_paterno: {
        type: String,
        required: true
    },
    apellido_materno: {
        type: String,
        default: ''
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    contrasena: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    fecha_nacimiento: {
        type: String,
        required: true
    },
    sexo: {
        type: String,
        enum: ['Masculino', 'Femenino'],
        required: true
    },
    tipo_usuario: {
        type: String,
        enum: ['cliente', 'admin'],
        default: 'cliente'
    }
}, {
    collection: 'usuarios'
});

module.exports = mongoose.model('Usuario', UsuarioSchema);