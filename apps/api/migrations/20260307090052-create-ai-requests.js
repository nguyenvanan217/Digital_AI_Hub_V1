'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('ai_requests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      user_id: Sequelize.INTEGER,

      group_id: Sequelize.INTEGER,

      request_type: Sequelize.STRING,

      prompt: Sequelize.TEXT,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }

    });

    await queryInterface.addIndex('ai_requests', ['user_id'], { name: 'idx_ai_requests_user_id' });
    await queryInterface.addIndex('ai_requests', ['group_id'], { name: 'idx_ai_requests_group_id' });
    await queryInterface.addIndex('ai_requests', ['request_type'], { name: 'idx_ai_requests_type' });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('ai_requests', 'idx_ai_requests_user_id');
    await queryInterface.removeIndex('ai_requests', 'idx_ai_requests_group_id');
    await queryInterface.removeIndex('ai_requests', 'idx_ai_requests_type');
    await queryInterface.dropTable('ai_requests');
  }
};