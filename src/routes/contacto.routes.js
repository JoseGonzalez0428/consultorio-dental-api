const { Router } = require('express');
const { enviarContacto } = require('../controllers/contacto.controller');

const router = Router();

router.post('/', enviarContacto);

module.exports = router;