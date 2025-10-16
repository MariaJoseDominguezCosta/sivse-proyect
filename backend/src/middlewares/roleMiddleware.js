// src/middlewares/roleMiddleware.js - Middleware para autorización por roles
const authorize = (allowedRoles) => (req, res, next) => {
  // Asume que authenticate ya puso req.user con { id, role }
    if (!req.user) {
        return res.status(401).json({ message: "Autenticación requerida" }); // Seguridad: No proceder sin user
    }

    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Acceso denegado: Rol insuficiente" }); // 403 para autorización fallida
    }

    next(); // Procede si el rol es válido
};

export default authorize;