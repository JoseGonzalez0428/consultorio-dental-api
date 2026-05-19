const { Router } = require('express');
const { getReportes, getCitasPasadasPorFecha, crearReporte } = require('../controllers/reportes.controller');
const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdminRole } = require('../middlewares/verifyAdminRole');

const router = Router();

router.get('/', verifyJWT, verifyAdminRole, getReportes);
router.get('/citas-pasadas', verifyJWT, verifyAdminRole, getCitasPasadasPorFecha);
router.post('/', verifyJWT, verifyAdminRole, crearReporte);

module.exports = router;