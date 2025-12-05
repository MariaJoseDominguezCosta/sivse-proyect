'use strict';

const bcrypt = require('bcrypt');
const { QueryInterface } = require('sequelize');

//Funcion auxiliar para resetear la secuencia de auto-incremento
async function resetSequence(queryInterface, tableName) {
  if (queryInterface.sequelize.getDialect() === 'postgres') {
    await queryInterface.sequelize.query(`SELECT setval(pg_get_serial_sequence('"${tableName}"', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "${tableName}";`);
  }
  
}

module.exports = {
  async up (queryInterface, Sequelize) {
    // Configuración de bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds); // Contraseña inicial

    // Datos iniciales para USUARIO
    await queryInterface.bulkInsert('Usuarios', [
      {
        id: 1,
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', saltRounds),
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

    await resetSequence(queryInterface, 'Usuarios');

    // Datos iniciales para EGRESADO
    await queryInterface.bulkInsert('Egresados', [
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

    await resetSequence(queryInterface, 'Egresados');

    // Datos iniciales para EMPRESA
    await queryInterface.bulkInsert('Empresas', [
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

    await resetSequence(queryInterface, 'Empresas');

    // Datos iniciales para VACANTE
    await queryInterface.bulkInsert('Vacantes', [
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

    await resetSequence(queryInterface, 'Vacantes');

    // Datos iniciales para POSTULACION
    await queryInterface.bulkInsert('Postulaciones', [
      {
        id: 1,
        egresado_id: 1,
        vacante_id: 1,
        fecha_postulacion: new Date('2025-10-15'),
        createdAt: new Date('2025-10-15'),
        updatedAt: new Date('2025-10-15'),
      },
    ], {});

    await resetSequence(queryInterface, 'Postulaciones');
  },

  async down (queryInterface, Sequelize) {
    try {
        // Hijos de Vacantes y Egresados
        await queryInterface.bulkDelete('Postulaciones', null, {});
        await queryInterface.bulkDelete('Favoritos', null, {});

        // Hijos de Usuarios
        // (No hay datos iniciales de Notificaciones, pero si los tuvieras, irían aquí)

        // Tablas Padre/Intermedias
        await queryInterface.bulkDelete('Vacantes', null, {});
        await queryInterface.bulkDelete('Empresas', null, {});
        await queryInterface.bulkDelete('Egresados', null, {});
        await queryInterface.bulkDelete('Usuarios', null, {});
    } catch (error) {
        // En un seeder, si un bulkDelete falla por no existir la tabla, 
        // simplemente lo registramos y continuamos. 
        console.warn(`Advertencia al intentar eliminar datos: ${error.message}. Asumiendo que la tabla fue eliminada por una migración.`);
    }
  }
};