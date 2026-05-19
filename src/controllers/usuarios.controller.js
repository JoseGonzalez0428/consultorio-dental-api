const { response, request } = require('express');
const Usuario = require('../models/usuario.model');

const getUsuarios = async (req = request, res = response) => {
    try {
        const usuarios = await Usuario.find(
            { tipo_usuario: 'cliente' },
            { contrasena: 0 }
        );
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener los usuarios'
        });
    }
};

const getUsuarioById = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findById(id, { contrasena: 0 });

        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener el usuario'
        });
    }
};

const actualizarUsuario = async (req = request, res = response) => {
    const id = req.activeUserId;
    const { nombres, apellido_paterno, apellido_materno, telefono, fecha_nacimiento, sexo } = req.body;

    try {
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        await Usuario.findByIdAndUpdate(id, {
            nombres,
            apellido_paterno,
            apellido_materno,
            telefono,
            fecha_nacimiento,
            sexo
        });

        res.status(200).json({
            msg: 'Usuario actualizado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al actualizar el usuario'
        });
    }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    actualizarUsuario
};