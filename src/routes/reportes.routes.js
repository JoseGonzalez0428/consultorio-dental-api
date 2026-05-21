const { Router } = require('express');
const { getReportes, getCitasPasadasPorFecha, crearReporte, getFechasConCitasSinReporte } = require('../controllers/reportes.controller');
const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdminRole } = require('../middlewares/verifyAdminRole');
const { verifyClientRole } = require('../middlewares/verifyClienteRole');

const router = Router();

router.get('/fechas-sin-reporte', verifyAdminRole, getFechasConCitasSinReporte);
router.get('/citas-pasadas', verifyAdminRole, getCitasPasadasPorFecha);
router.get('/', verifyAdminRole, getReportes);
router.post('/', verifyAdminRole, crearReporte);

module.exports = router;