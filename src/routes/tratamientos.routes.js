const { Router } = require('express');
const { getTratamientos, getTratamientoById, crearTratamiento, actualizarTratamiento, eliminarTratamiento, getTodosLosTratamientos, reactivarTratamiento } = require('../controllers/tratamientos.controller');
const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdminRole } = require('../middlewares/verifyAdminRole');
const { verifyClientRole } = require('../middlewares/verifyClienteRole');
const upload = require('../middlewares/upload');

const router = Router();

router.get('/', getTratamientos);
router.get('/admin/todos', verifyAdminRole, getTodosLosTratamientos);
router.get('/:id', getTratamientoById);
router.post('/', verifyAdminRole, upload.single('imagen'), crearTratamiento);
router.put('/:id/reactivar', verifyAdminRole, reactivarTratamiento);
router.put('/:id', verifyAdminRole, upload.single('imagen'), actualizarTratamiento);
router.delete('/:id', verifyAdminRole, eliminarTratamiento);

module.exports = router;