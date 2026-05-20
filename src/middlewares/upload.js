const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOADS_PATH);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const nombre = file.fieldname + '-' + Date.now() + ext;
        cb(null, nombre);
    }
});

const fileFilter = (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png|webp/;
    const ext = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
    const mime = tiposPermitidos.test(file.mimetype);

    if (ext && mime) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;