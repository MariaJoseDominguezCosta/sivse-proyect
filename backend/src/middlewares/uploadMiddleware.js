// backend/src/middlewares/uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads");
        fs.mkdir(uploadDir, { recursive: true }, (err) => {
        if (err) {
            cb(err);
        } else {
            cb(null, uploadDir);
        }
        });
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

// Aceptar solo archivos de imagen
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimeType && extName) {
        return cb(null, true);
    }
    cb(null, false);
};

// Configuración de Multer
const uploadProfilePhoto = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }).single('foto_perfil');

module.exports = uploadProfilePhoto;