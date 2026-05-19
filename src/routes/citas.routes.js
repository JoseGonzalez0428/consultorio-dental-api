const { Router } = require('express');
const { getMisCitas, getCitasPorFecha, getHorasOcupadas, agendarCita, modificarCita, cancelarCita, completarCita } = require('../controllers/citas.controller');
const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdminRole } = require('../middlewares/verifyAdminRole');

const router = Router();

router.get('/mis-citas', verifyJWT, getMisCitas);
router.get('/ocupadas', getHorasOcupadas);
router.get('/', verifyJWT, verifyAdminRole, getCitasPorFecha);
router.post('/', verifyJWT, agendarCita);
router.put('/:id', verifyJWT, modificarCita);
router.put('/:id/cancelar', verifyJWT, cancelarCita);
router.put('/:id/completar', verifyJWT, verifyAdminRole, completarCita);

module.exports = router;