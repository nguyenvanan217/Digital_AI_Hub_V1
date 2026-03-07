'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('vip_transactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      user_id: Sequelize.INTEGER,

      package_id: Sequelize.INTEGER,

      status: Sequelize.STRING,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },

      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }

    });

    await queryInterface.addIndex('vip_transactions', ['user_id'], { name: 'idx_vip_tx_user_id' });
    await queryInterface.addIndex('vip_transactions', ['package_id'], { name: 'idx_vip_tx_package_id' });
    await queryInterface.addIndex('vip_transactions', ['status'], { name: 'idx_vip_tx_status' });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('vip_transactions', 'idx_vip_tx_user_id');
    await queryInterface.removeIndex('vip_transactions', 'idx_vip_tx_package_id');
    await queryInterface.removeIndex('vip_transactions', 'idx_vip_tx_status');
    await queryInterface.dropTable('vip_transactions');
  }
};