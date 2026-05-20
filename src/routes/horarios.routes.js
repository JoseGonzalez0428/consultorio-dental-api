const { Router } = require('express');
const { getHorarios, agregarHorario, eliminarHorario, eliminarHorarioPorBloque } = require('../controllers/horarios.controller');
const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdminRole } = require('../middlewares/verifyAdminRole');

const router = Router();

router.get('/', getHorarios);
router.post('/', verifyJWT, verifyAdminRole, agregarHorario);
router.delete('/:id', verifyJWT, verifyAdminRole, eliminarHorario);
router.delete('/bloque/:id', verifyJWT, verifyAdminRole, eliminarHorarioPorBloque);

module.exports = router;