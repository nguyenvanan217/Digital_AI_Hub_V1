'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('ai_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      user_id: Sequelize.INTEGER,

      type: Sequelize.STRING,

      input_text: Sequelize.TEXT,

      output_text: Sequelize.TEXT,

      output_url: Sequelize.STRING,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }

    });

    await queryInterface.addIndex('ai_logs', ['user_id'], { name: 'idx_ai_logs_user_id' });
    await queryInterface.addIndex('ai_logs', ['type'], { name: 'idx_ai_logs_type' });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('ai_logs', 'idx_ai_logs_user_id');
    await queryInterface.removeIndex('ai_logs', 'idx_ai_logs_type');
    await queryInterface.dropTable('ai_logs');
  }
};