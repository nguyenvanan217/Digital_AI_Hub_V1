'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('chat_group_members', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      group_id: Sequelize.INTEGER,

      user_id: Sequelize.INTEGER,

      role: Sequelize.STRING,

      status: Sequelize.STRING,

      last_read_message_id: Sequelize.INTEGER,

      joined_at: Sequelize.DATE

    });

    // Composite unique: 1 user chỉ join 1 group 1 lần
    await queryInterface.addIndex('chat_group_members', ['group_id', 'user_id'], {
      name: 'idx_cgm_group_user',
      unique: true,
    });
    await queryInterface.addIndex('chat_group_members', ['user_id'], { name: 'idx_cgm_user_id' });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('chat_group_members', 'idx_cgm_group_user');
    await queryInterface.removeIndex('chat_group_members', 'idx_cgm_user_id');
    await queryInterface.dropTable('chat_group_members');
  }
};