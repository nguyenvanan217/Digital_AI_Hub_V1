'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('group_join_requests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      group_id: Sequelize.INTEGER,

      user_id: Sequelize.INTEGER,

      status: Sequelize.STRING,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }

    });

    await queryInterface.addIndex('group_join_requests', ['group_id'], { name: 'idx_gjr_group_id' });
    await queryInterface.addIndex('group_join_requests', ['user_id'], { name: 'idx_gjr_user_id' });
    await queryInterface.addIndex('group_join_requests', ['status'], { name: 'idx_gjr_status' });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('group_join_requests', 'idx_gjr_group_id');
    await queryInterface.removeIndex('group_join_requests', 'idx_gjr_user_id');
    await queryInterface.removeIndex('group_join_requests', 'idx_gjr_status');
    await queryInterface.dropTable('group_join_requests');
  }
};