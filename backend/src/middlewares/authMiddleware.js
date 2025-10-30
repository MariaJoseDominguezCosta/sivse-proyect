// src/middlewares/authMiddleware.js - Verifica JWT para rutas protegidas
const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extrae el token del Bearer
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Asigna userId y role a req.user
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};


const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) return res.status(403).json({ message: 'Unauthorized' });
  next();
};

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Token no proporcionado' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = { requireAuth, requireRole, authenticate };    
