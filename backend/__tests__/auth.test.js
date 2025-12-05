// __tests__/auth.test.js

const request = require('supertest');
const server = require('../src/index'); // Importamos el servidor

describe('API de Autenticación', () => {


    // Prueba para el registro de un nuevo egresado
    describe('POST /api/auth/register', () => {
        it('debería registrar un nuevo egresado y devolver un estado 201', async () => {
            const res = await request(server)
                .post('/api/auth/register')
                .send({
                    nombre_completo: 'Usuario de Prueba',
                    telefono: '1234567890',
                    generacion: '2020-2025',
                    carrera: 'Ingeniería en Sistemas',
                    email: 'test@example.com',
                    password: 'password123',
                    confirm_password: 'password123'
                });
            
            expect(res.statusCode).toEqual(201);
            expect(res.body.message).toBe('Egresado registrado');
        });

        it('debería devolver un error 400 si el email ya existe', async () => {
            const res = await request(server)
                .post('/api/auth/register')
                .send({
                    nombre_completo: 'Otro Usuario',
                    email: 'test@example.com', // Email duplicado
                    password: 'password123',
                    confirm_password: 'password123',
                    generacion: '2020-2025',
                    carrera: 'Ingeniería en Sistemas',
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toBe('Email ya existe');
        });
    });

    // Prueba para el inicio de sesión
    describe('POST /api/auth/login', () => {
        it('debería iniciar sesión con credenciales correctas y devolver un token', async () => {
            const res = await request(server)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('debería devolver un error 401 con una contraseña incorrecta', async () => {
            const res = await request(server)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toBe('Credenciales inválidas');
        });
    });
});