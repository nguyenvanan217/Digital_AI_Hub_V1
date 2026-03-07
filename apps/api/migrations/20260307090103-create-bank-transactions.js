'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('bank_transactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      user_id: Sequelize.INTEGER,

      transaction_code: Sequelize.STRING,

      amount: Sequelize.INTEGER,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }

    });

    await queryInterface.addIndex('bank_transactions', ['user_id'], { name: 'idx_bank_tx_user_id' });
    await queryInterface.addIndex('bank_transactions', ['transaction_code'], {
      name: 'idx_bank_tx_code',
      unique: true,
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('bank_transactions', 'idx_bank_tx_user_id');
    await queryInterface.removeIndex('bank_transactions', 'idx_bank_tx_code');
    await queryInterface.dropTable('bank_transactions');
  }
};