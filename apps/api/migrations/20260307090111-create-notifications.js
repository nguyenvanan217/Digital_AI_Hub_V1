'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      user_id: Sequelize.INTEGER,

      type: Sequelize.STRING,

      content: Sequelize.TEXT,

      is_read: Sequelize.BOOLEAN,

      target_id: Sequelize.INTEGER,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }

    });

    await queryInterface.addIndex('notifications', ['user_id'], { name: 'idx_notifications_user_id' });
    await queryInterface.addIndex('notifications', ['is_read'], { name: 'idx_notifications_is_read' });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('notifications', 'idx_notifications_user_id');
    await queryInterface.removeIndex('notifications', 'idx_notifications_is_read');
    await queryInterface.dropTable('notifications');
  }
};