'use strict';

module.exports = (sequelize, DataTypes) => {
  const AiLog = sequelize.define('AiLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    input_text: DataTypes.TEXT,
    output_text: DataTypes.TEXT,
    output_url: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'ai_logs',
    timestamps: false,
  });

  return AiLog;
};
