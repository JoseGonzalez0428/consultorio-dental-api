const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const verifyJWT = async (req = request, res = response, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            msg: 'Token no proporcionado'
        });
    }

    try {
        const { correo } = jwt.verify(token, process.env.SECRET_KEY);
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token inválido'
            });
        }

        req.activeUserRole = usuario.tipo_usuario;
        req.activeUserId = usuario._id;
        next();

    } catch (error) {
        return res.status(401).json({
            msg: 'Token inválido'
        });
    }
};

module.exports = { verifyJWT };