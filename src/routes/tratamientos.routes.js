const { Router } = require('express');
const { getTratamientos, getTratamientoById, crearTratamiento, actualizarTratamiento, eliminarTratamiento, getTodosLosTratamientos, reactivarTratamiento } = require('../controllers/tratamientos.controller');
const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdminRole } = require('../middlewares/verifyAdminRole');
const upload = require('../middlewares/upload');

const router = Router();

router.get('/', getTratamientos);
router.get('/admin/todos', verifyJWT, verifyAdminRole, getTodosLosTratamientos);
router.get('/:id', getTratamientoById);
router.post('/', verifyJWT, verifyAdminRole, upload.single('imagen'), crearTratamiento);
router.put('/:id/reactivar', verifyJWT, verifyAdminRole, reactivarTratamiento);
router.put('/:id', verifyJWT, verifyAdminRole, upload.single('imagen'), actualizarTratamiento);
router.delete('/:id', verifyJWT, verifyAdminRole, eliminarTratamiento);

module.exports = router;