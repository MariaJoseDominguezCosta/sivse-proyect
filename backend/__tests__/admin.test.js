// __tests__/admin.test.js

const request = require('supertest');
const server = require('../src/index');

// Mock del middleware de autenticación
// Esto intercepta la llamada real y la reemplaza con nuestra implementación falsa
jest.mock('../src/middlewares/authMiddleware', () => ({
    requireAuth: (req, res, next) => next(),
    requireRole: (role) => (req, res, next) => {
        // Simulamos un usuario administrador en la solicitud
        req.user = { userId: 1, role: 'admin' };
        if (role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Unauthorized' });
        }
    }
}));


describe('API de Administración - Empresas', () => {

    describe('POST /api/admin/empresas', () => {
        it('debería crear una nueva empresa si el usuario es admin', async () => {
            const res = await request(server)
                .post('/api/admin/empresas')
                .send({
                    razon_social: 'Empresa de Prueba S.A. de C.V.',
                    sector: 'Tecnología',
                    tipo_convenio: 'Colaboración',
                    direccion: 'Calle Falsa 123',
                    correo_contacto: 'contacto@empresa.com',
                    telefono: '5512345678',
                    sitio_web: 'https://empresa.com'
                });
            
            expect(res.statusCode).toEqual(201);
            expect(res.body.razon_social).toBe('Empresa de Prueba S.A. de C.V.');
        });
    });

    describe('GET /api/admin/empresas', () => {
        it('debería obtener la lista de empresas si el usuario es admin', async () => {
            const res = await request(server).get('/api/admin/empresas');
            
            expect(res.statusCode).toEqual(200);
            // Esperamos que la respuesta sea un array que contiene la empresa que creamos
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });
});