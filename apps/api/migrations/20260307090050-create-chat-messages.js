'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('chat_messages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      group_id: Sequelize.INTEGER,

      user_id: Sequelize.INTEGER,

      content: Sequelize.TEXT,

      url: Sequelize.STRING,

      hidden: Sequelize.BOOLEAN,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }

    });

    await queryInterface.addIndex('chat_messages', ['group_id'], { name: 'idx_chat_messages_group_id' });
    await queryInterface.addIndex('chat_messages', ['user_id'], { name: 'idx_chat_messages_user_id' });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('chat_messages', 'idx_chat_messages_group_id');
    await queryInterface.removeIndex('chat_messages', 'idx_chat_messages_user_id');
    await queryInterface.dropTable('chat_messages');
  }
};