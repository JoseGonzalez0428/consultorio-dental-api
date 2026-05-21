const { Router } = require('express');
const { getMisCitas, getCitasPorFecha, getHorasOcupadas, agendarCita, modificarCita, cancelarCita, completarCita, getFechasConCitas } = require('../controllers/citas.controller');
const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdminRole } = require('../middlewares/verifyAdminRole');
const { verifyClientRole } = require('../middlewares/verifyClienteRole');

const router = Router();

router.get('/fechas', verifyAdminRole, getFechasConCitas);
router.get('/mis-citas', verifyClientRole, getMisCitas);
router.get('/ocupadas', getHorasOcupadas);
router.get('/',  verifyAdminRole, getCitasPorFecha);
router.post('/',  verifyClientRole, agendarCita);
router.put('/:id',  verifyClientRole, modificarCita);
router.put('/:id/cancelar-admin', verifyAdminRole, cancelarCita);
router.put('/:id/cancelar',  verifyClientRole, cancelarCita);
router.put('/:id/completar',  verifyAdminRole, completarCita);

module.exports = router;