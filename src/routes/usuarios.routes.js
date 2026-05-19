const { Router } = require('express');
const { getUsuarios, getUsuarioById, actualizarUsuario } = require('../controllers/usuarios.controller');
const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdminRole } = require('../middlewares/verifyAdminRole');

const router = Router();

router.get('/', verifyJWT, verifyAdminRole, getUsuarios);
router.get('/:id', verifyJWT, getUsuarioById);
router.put('/', verifyJWT, actualizarUsuario);

module.exports = router;