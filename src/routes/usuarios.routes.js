const { Router } = require('express');
const { getUsuarios, getUsuarioById, actualizarUsuario } = require('../controllers/usuarios.controller');
const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdminRole } = require('../middlewares/verifyAdminRole');
const { verifyClientRole } = require('../middlewares/verifyClienteRole');

const router = Router();

router.get('/', verifyAdminRole, getUsuarios);
router.get('/:id', verifyClientRole, getUsuarioById);
router.put('/', verifyClientRole, actualizarUsuario);

module.exports = router;