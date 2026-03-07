'use strict';

module.exports = (sequelize, DataTypes) => {
  const AiResponse = sequelize.define('AiResponse', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    output_text: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'ai_responses',
    timestamps: false,
  });

  return AiResponse;
};
