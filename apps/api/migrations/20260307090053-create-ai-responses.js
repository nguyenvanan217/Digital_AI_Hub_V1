'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('ai_responses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      request_id: Sequelize.INTEGER,

      output_text: Sequelize.TEXT,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }

    });

    await queryInterface.addIndex('ai_responses', ['request_id'], {
      name: 'idx_ai_responses_request_id',
      unique: true,
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('ai_responses', 'idx_ai_responses_request_id');
    await queryInterface.dropTable('ai_responses');
  }
};