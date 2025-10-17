'use strict';

const bcrypt = require('bcrypt');
const { QueryInterface } = require('sequelize');

module.exports = {
  async up (queryInterface, Sequelize) {
    // Configuración de bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds); // Contraseña inicial

    // Datos iniciales para USUARIO
    await queryInterface.bulkInsert('USUARIO', [
      {
        id: 1,
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date('2025-10-15'),
        updatedAt: new Date('2025-10-15'),
      },
      {
        id: 2,
        email: 'egresado@example.com',
        password: hashedPassword,
        role: 'egresado',
        createdAt: new Date('2025-10-15'),
        updatedAt: new Date('2025-10-15'),
      },
    ], {});

    // Datos iniciales para EGRESADO
    await queryInterface.bulkInsert('EGRESADO', [
      {
        id: 1,
        nombre_completo: 'Juan Pérez', // Alineado con egresado.js
        email: 'egresado@example.com',
        estado_laboral: 'Desempleado',
        telefono: '123456789',
        ubicacion: 'Ciudad de México',
        generacion: '2000-2005',
        carrera: 'Ingeniería de Sistemas',
        empresa_actual: null,
        puesto: null,
        user_id: 2,
        createdAt: new Date('2025-10-15'),
        updatedAt: new Date('2025-10-15'),
      },
    ], {});

    // Datos iniciales para EMPRESA
    await queryInterface.bulkInsert('EMPRESA', [
      {
        id: 1,
        razon_social: 'TechCorp',
        sector: 'Tecnología',
        tipo_convenio: 'Colaboración',
        direccion: 'Calle Falsa 123, Ciudad de México',
        correo_contacto: 'info@techcorp.com', // Alineado con empresa.js
        telefono: '987654321',
        sitio_web: 'https://www.techcorp.com', // Alineado con validación de URL
        createdAt: new Date('2025-10-15'),
        updatedAt: new Date('2025-10-15'),
      },
    ], {});

    // Datos iniciales para VACANTE
    await queryInterface.bulkInsert('VACANTE', [
      {
        id: 1,
        empresa_id: 1,
        titulo: 'Desarrollador FullStack',
        descripcion: 'Desarrollo de aplicaciones web y móviles con tecnologías modernas.',
        requisitos: 'Experiencia en React y Node.js',
        ubicacion: 'Ciudad de México',
        modalidad: 'Remoto',
        salario_estimado: 50000.00, // Alineado con vacante.js
        estado: 'Activa',
        fecha_publicacion: new Date('2025-10-15'),
        es_favorito: false,
        empresa_id: 1,
        createdAt: new Date('2025-10-15'),
        updatedAt: new Date('2025-10-15'),
      },
    ], {});

    // Datos iniciales para POSTULACION
    await queryInterface.bulkInsert('POSTULACION', [
      {
        id: 1,
        egresado_id: 1,
        vacante_id: 1,
        fecha_postulacion: new Date('2025-10-15'),
        createdAt: new Date('2025-10-15'),
        updatedAt: new Date('2025-10-15'),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('POSTULACION', null, {});
    await queryInterface.bulkDelete('VACANTE', null, {});
    await queryInterface.bulkDelete('EMPRESA', null, {});
    await queryInterface.bulkDelete('EGRESADO', null, {});
    await queryInterface.bulkDelete('USUARIO', null, {});
  }
};