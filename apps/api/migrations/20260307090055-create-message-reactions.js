'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('message_reactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      message_id: Sequelize.INTEGER,

      user_id: Sequelize.INTEGER,

      reaction_type: Sequelize.STRING,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }

    });

    // 1 user chỉ react 1 lần trên 1 message
    await queryInterface.addIndex('message_reactions', ['message_id', 'user_id'], {
      name: 'idx_reactions_message_user',
      unique: true,
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('message_reactions', 'idx_reactions_message_user');
    await queryInterface.dropTable('message_reactions');
  }
};