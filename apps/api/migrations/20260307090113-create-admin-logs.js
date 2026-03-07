'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('admin_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      admin_id: Sequelize.INTEGER,

      action: Sequelize.STRING,

      target_type: Sequelize.STRING,

      target_id: Sequelize.INTEGER,

      description: Sequelize.TEXT,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }

    });

    await queryInterface.addIndex('admin_logs', ['admin_id'], { name: 'idx_admin_logs_admin_id' });
    await queryInterface.addIndex('admin_logs', ['action'], { name: 'idx_admin_logs_action' });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('admin_logs', 'idx_admin_logs_admin_id');
    await queryInterface.removeIndex('admin_logs', 'idx_admin_logs_action');
    await queryInterface.dropTable('admin_logs');
  }
};