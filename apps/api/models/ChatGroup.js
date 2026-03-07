'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChatGroup = sequelize.define('ChatGroup', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: DataTypes.TEXT,
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rules: DataTypes.TEXT,
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    avatar_url: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'chat_groups',
    timestamps: false,
  });

  return ChatGroup;
};
