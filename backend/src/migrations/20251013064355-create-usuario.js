'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('admin', 'egresado'),
        defaultValue: 'egresado',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface) {
     // 1. Eliminar las tablas que dependen de Usuarios (en orden de dependencia)
    try {
        // Notificaciones depende de Usuarios
        await queryInterface.dropTable('Notificaciones'); 
        
        // Egresados depende de Usuarios. Ya debería haber sido eliminada por su propia migración, 
        // pero la incluimos en el try/catch si no lo está.
        await queryInterface.dropTable('Egresados'); 
        
    } catch(e) {
        console.warn(`Advertencia al eliminar tablas dependientes de Usuarios: ${e.message}`);
        // Se ignora si ya fueron eliminadas por otra migración.
    }

    // 2. Eliminar la tabla Usuarios
    await queryInterface.dropTable('Usuarios');
  }
};
