'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('USUARIO', [
      { id: 1, email: 'admin@example.com', password: 'hashedpassword', role: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, email: 'egresado@example.com', password: 'hashedpassword', role: 'egresado', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Inserta EGRESADO asegurando que user_id coincida
    await queryInterface.bulkInsert('EGRESADO', [
      { id: 1, nombre: 'Juan Pérez', email: 'egresado@example.com', telefono: '123456789', ubicacion: 'Ciudad', generacion: '2000', carrera: 'Ingeniería de Sistemas', estado_laboral: 'Desempleado', user_id: 2, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Inserta EMPRESA con ID explícito
    await queryInterface.bulkInsert('EMPRESA', [
      { id: 1, nombre: 'TechCorp', sector: 'Tecnología', contacto: 'contact@techcorp.com', direccion: 'Calle Falsa 123', telefono: '987654321', email: 'info@techcorp.com', web: 'www.techcorp.com', tipo_convenio: 'Colaboración', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Inserta VACANTE asegurando que empresa_id coincida
    await queryInterface.bulkInsert('VACANTE', [
      { id: 1, titulo: 'Desarrollador FullStack', descripcion: 'Desarrollo web', modalidad: 'Remoto', empresa_id: 1, salario: 50000, ubicacion: 'Ciudad', estado: 'Activa', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Inserta POSTULACION asegurando que egresado_id y vacante_id coincidan
    await queryInterface.bulkInsert('POSTULACION', [
      { id: 1, egresado_id: 1, vacante_id: 1, fecha_postulacion: new Date(), createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('POSTULACION', null, {});
    await queryInterface.bulkDelete('VACANTE', null, {});
    await queryInterface.bulkDelete('EMPRESA', null, {});
    await queryInterface.bulkDelete('EGRESADO', null, {});
    await queryInterface.bulkDelete('USUARIO', null, {});
  }
};
