const { response, request } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const login = async (req = request, res = response) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({
            msg: 'Datos incompletos'
        });
    }

    try {
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(401).json({
                msg: 'Correo o contraseña incorrectos'
            });
        }

        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!contrasenaValida) {
            return res.status(401).json({
                msg: 'Correo o contraseña incorrectos'
            });
        }

        jwt.sign({
            correo,
            tipo_usuario: usuario.tipo_usuario
        }, process.env.SECRET_KEY, {
            expiresIn: '8h'
        }, (error, token) => {
            if (error) {
                return res.status(500).json({
                    msg: 'Error al generar el token'
                });
            }

            return res.status(200).json({
                msg: 'Login exitoso',
                token,
                tipo_usuario: usuario.tipo_usuario,
                nombre: usuario.nombres,
                sexo: usuario.sexo,
                id: usuario._id
            });
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
};

const register = async (req = request, res = response) => {
    const {
        nombres,
        apellido_paterno,
        apellido_materno,
        correo,
        contrasena,
        telefono,
        fecha_nacimiento,
        sexo
    } = req.body;

    if (!nombres || !apellido_paterno || !correo || !contrasena || !telefono || !fecha_nacimiento || !sexo) {
        return res.status(400).json({
            msg: 'Datos incompletos'
        });
    }

    try {
        const usuarioExistente = await Usuario.findOne({ correo });

        if (usuarioExistente) {
            return res.status(400).json({
                msg: 'El correo ya está registrado'
            });
        }

        const contrasenaHasheada = bcrypt.hashSync(contrasena, 10);

        const nuevoUsuario = new Usuario({
            nombres,
            apellido_paterno,
            apellido_materno: apellido_materno ?? '',
            correo,
            contrasena: contrasenaHasheada,
            telefono,
            fecha_nacimiento,
            sexo,
            tipo_usuario: 'cliente'
        });

        await nuevoUsuario.save();

        res.status(201).json({
            msg: 'Registro exitoso'
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
};

module.exports = { login, register };