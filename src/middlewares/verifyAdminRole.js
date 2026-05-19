const { response, request } = require('express');

const verifyAdminRole = async (req = request, res = response, next) => {
    if (!req.activeUserRole || req.activeUserRole !== 'admin') {
        return res.status(403).json({
            msg: 'Acceso denegado'
        });
    }
    next();
};

module.exports = { verifyAdminRole };