const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'consultorio-dental',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, height: 600, crop: 'limit' }]
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