'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChatGroupMember = sequelize.define('ChatGroupMember', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'member',
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
    last_read_message_id: DataTypes.INTEGER,
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'chat_group_members',
    timestamps: false,
  });

  return ChatGroupMember;
};
