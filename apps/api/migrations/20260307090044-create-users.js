'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      username: {
        type: Sequelize.STRING,
        allowNull: false
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },

      vip_expired_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      role: {
        type: Sequelize.STRING,
        defaultValue: "user"
      },

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },

      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }

    });

    await queryInterface.addIndex('users', ['username'], { name: 'idx_users_username' });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeIndex('users', 'idx_users_username');
    await queryInterface.dropTable('users');

  }
};