'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('group_invite_links', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      group_id: Sequelize.INTEGER,

      invite_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      expired_at: Sequelize.DATE,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }

    });

    await queryInterface.addIndex('group_invite_links', ['group_id'], { name: 'idx_gil_group_id' });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('group_invite_links', 'idx_gil_group_id');
    await queryInterface.dropTable('group_invite_links');
  }
};