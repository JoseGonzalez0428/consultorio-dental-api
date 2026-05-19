const { Router } = require('express');
const { getTratamientos, getTratamientoById, crearTratamiento, actualizarTratamiento, eliminarTratamiento } = require('../controllers/tratamientos.controller');
const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdminRole } = require('../middlewares/verifyAdminRole');

const router = Router();

router.get('/', getTratamientos);
router.get('/:id', getTratamientoById);
router.post('/', verifyJWT, verifyAdminRole, crearTratamiento);
router.put('/:id', verifyJWT, verifyAdminRole, actualizarTratamiento);
router.delete('/:id', verifyJWT, verifyAdminRole, eliminarTratamiento);

module.exports = router;