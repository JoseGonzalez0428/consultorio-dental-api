const { Router } = require('express');
const { getHorarios, agregarHorario, eliminarHorario, eliminarHorarioPorBloque } = require('../controllers/horarios.controller');
const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdminRole } = require('../middlewares/verifyAdminRole');
const { verifyClientRole } = require('../middlewares/verifyClienteRole');

const router = Router();

router.get('/', getHorarios);
router.post('/', verifyAdminRole, agregarHorario);
router.delete('/:id', verifyAdminRole, eliminarHorario);
router.delete('/bloque/:id', verifyAdminRole, eliminarHorarioPorBloque);

module.exports = router;