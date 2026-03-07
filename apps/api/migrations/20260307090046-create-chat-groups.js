'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('chat_groups', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      name: Sequelize.STRING,

      slug: {
        type: Sequelize.STRING,
        unique: true
      },

      description: Sequelize.TEXT,

      user_id: Sequelize.INTEGER,

      rules: Sequelize.TEXT,

      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      },

      avatar_url: Sequelize.STRING,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },

      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }

    });

    await queryInterface.addIndex('chat_groups', ['user_id'], { name: 'idx_chat_groups_user_id' });
    await queryInterface.addIndex('chat_groups', ['is_public'], { name: 'idx_chat_groups_is_public' });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('chat_groups', 'idx_chat_groups_user_id');
    await queryInterface.removeIndex('chat_groups', 'idx_chat_groups_is_public');
    await queryInterface.dropTable('chat_groups');
  }
};