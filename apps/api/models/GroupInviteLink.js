'use strict';

module.exports = (sequelize, DataTypes) => {
  const GroupInviteLink = sequelize.define('GroupInviteLink', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    invite_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expired_at: DataTypes.DATE,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'group_invite_links',
    timestamps: false,
  });

  return GroupInviteLink;
};
