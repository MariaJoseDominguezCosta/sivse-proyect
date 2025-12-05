'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Egresados', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre_completo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      estado_laboral: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'desempleado',
      },
      telefono: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ubicacion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      generacion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      carrera: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      empresa_actual: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      puesto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      redes: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      historial: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      foto_perfil: {
        type: Sequelize.BLOB,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
    // CORRECCIÓN CLAVE: Eliminar las tablas dependientes antes de Egresados
    
    // 1. Eliminar Postulaciones y Favoritos (aunque ya deberían estar eliminadas, se repite por seguridad)
    // Se asume que HistorialActualizaciones existe en tu DB, por eso PostgreSQL da el error.
    try {
        // Estas tablas dependen de Egresados, deben ser eliminadas PRIMERO
        await queryInterface.dropTable('Postulaciones'); 
        await queryInterface.dropTable('Favoritos');
        await queryInterface.dropTable('historial_actualizaciones'); // <-- ¡CRÍTICO: Eliminar la tabla que bloquea!
    } catch(e) {
        console.warn(`Advertencia al eliminar tablas dependientes de Egresados: ${e.message}`);
        // Si fallan aquí, es porque ya fueron eliminadas por otra migración (lo cual es ideal).
    }

    // 2. Eliminar la tabla Egresados
    await queryInterface.dropTable('Egresados');
  }
};
