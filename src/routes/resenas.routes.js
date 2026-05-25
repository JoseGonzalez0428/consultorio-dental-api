const { Router } = require('express');
const { getResenasPorTratamiento, crearResena, puedeResenar } = require('../controllers/resenas.controller');
const { verifyClientRole } = require('../middlewares/verifyClienteRole');

const router = Router();

router.get('/:id_tratamiento', getResenasPorTratamiento);
router.get('/:id_tratamiento/puede-resenar', verifyClientRole, puedeResenar);
router.post('/', verifyClientRole, crearResena);

module.exports = router;