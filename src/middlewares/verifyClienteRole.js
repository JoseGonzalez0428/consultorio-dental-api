const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const verifyClientRole = async (req = request, res = response, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'Token no proporcionado' });
    }

    try {
        const { correo } = jwt.verify(token, process.env.SECRET_KEY);
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(401).json({ msg: 'Token inválido' });
        }

        if (usuario.tipo_usuario !== 'cliente') {
            return res.status(403).json({ msg: 'Solo los pacientes pueden realizar esta acción' });
        }

        req.activeUserId = usuario._id;
        req.activeUserRole = usuario.tipo_usuario;
        next();
    } catch (error) {
        return res.status(401).json({ msg: 'Token inválido' });
    }
};

module.exports = { verifyClientRole };