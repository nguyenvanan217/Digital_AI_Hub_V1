'use strict';

module.exports = (sequelize, DataTypes) => {
  const AiRequest = sequelize.define('AiRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    group_id: DataTypes.INTEGER,
    request_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prompt: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'ai_requests',
    timestamps: false,
  });

  return AiRequest;
};
