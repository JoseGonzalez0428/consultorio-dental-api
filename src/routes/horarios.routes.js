const { Router } = require('express');
const { getHorarios, agregarHorario, eliminarHorario } = require('../controllers/horarios.controller');
const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdminRole } = require('../middlewares/verifyAdminRole');

const router = Router();

router.get('/', getHorarios);
router.post('/', verifyJWT, verifyAdminRole, agregarHorario);
router.delete('/:fecha', verifyJWT, verifyAdminRole, eliminarHorario);

module.exports = router;