// src/middlewares/authMiddleware.js - Verifica JWT para rutas protegidas
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token

    if (!token) return res.status(401).json({ message: "Token requerido" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Agrega user a req para uso en controladores
        next();
    } catch (err) {
        res.status(401).json({ message: "Token inválido" });
    }
};

module.exports = authenticate;
