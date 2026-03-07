'use strict';

/**
 * Central Association File
 * Tất cả mối quan hệ giữa các model được định nghĩa tập trung tại đây.
 * KHÔNG định nghĩa association trong từng model file riêng lẻ.
 *
 * Cấu trúc quan hệ:
 *
 *  users
 *    ├── chat_groups          (user là creator)
 *    ├── chat_group_members
 *    ├── chat_messages
 *    ├── message_reactions
 *    ├── group_join_requests
 *    ├── ai_requests
 *    ├── ai_logs
 *    ├── vip_transactions
 *    ├── bank_transactions
 *    ├── notifications
 *    └── admin_logs           (admin_id → users.id)
 *
 *  chat_groups
 *    ├── chat_group_members
 *    ├── chat_messages
 *    ├── group_join_requests
 *    ├── group_invite_links
 *    └── ai_requests
 *
 *  chat_messages
 *    └── message_reactions
 *
 *  ai_requests
 *    └── ai_responses         (1-1)
 *
 *  vip_packages
 *    └── vip_transactions
 */

module.exports = (db) => {
  const {
    User,
    ChatGroup,
    ChatGroupMember,
    ChatMessage,
    MessageReaction,
    GroupJoinRequest,
    GroupInviteLink,
    AiRequest,
    AiResponse,
    AiLog,
    VipPackage,
    VipTransaction,
    BankTransaction,
    Notification,
    AdminLog,
  } = db;

  // ─── User → Groups (creator) ────────────────────────────────────────────────
  User.hasMany(ChatGroup, { foreignKey: 'user_id', as: 'ownedGroups' });
  ChatGroup.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });

  // ─── User ↔ ChatGroupMembers ─────────────────────────────────────────────────
  User.hasMany(ChatGroupMember, { foreignKey: 'user_id', as: 'groupMemberships' });
  ChatGroupMember.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // ─── ChatGroup ↔ ChatGroupMembers ────────────────────────────────────────────
  ChatGroup.hasMany(ChatGroupMember, { foreignKey: 'group_id', as: 'members' });
  ChatGroupMember.belongsTo(ChatGroup, { foreignKey: 'group_id', as: 'group' });

  // ─── Many-to-many: User ↔ ChatGroup (via ChatGroupMember) ───────────────────
  User.belongsToMany(ChatGroup, {
    through: ChatGroupMember,
    foreignKey: 'user_id',
    otherKey: 'group_id',
    as: 'joinedGroups',
    onDelete: 'CASCADE'
  });
  ChatGroup.belongsToMany(User, {
    through: ChatGroupMember,
    foreignKey: 'group_id',
    otherKey: 'user_id',
    as: 'groupUsers',
    onDelete: 'CASCADE'
  });

  // ─── ChatGroup ↔ ChatMessages ────────────────────────────────────────────────
  ChatGroup.hasMany(ChatMessage, { foreignKey: 'group_id', as: 'messages' });
  ChatMessage.belongsTo(ChatGroup, { foreignKey: 'group_id', as: 'group' });

  // ─── User ↔ ChatMessages ─────────────────────────────────────────────────────
  User.hasMany(ChatMessage, { foreignKey: 'user_id', as: 'messages' });
  ChatMessage.belongsTo(User, { foreignKey: 'user_id', as: 'sender' });

  // ─── ChatMessage ↔ MessageReactions ─────────────────────────────────────────
  ChatMessage.hasMany(MessageReaction, { foreignKey: 'message_id', as: 'reactions' });
  MessageReaction.belongsTo(ChatMessage, { foreignKey: 'message_id', as: 'message' });

  User.hasMany(MessageReaction, { foreignKey: 'user_id', as: 'reactions' });
  MessageReaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // ─── last_read_message (ChatGroupMember → ChatMessage) ──────────────────────
  ChatGroupMember.belongsTo(ChatMessage, {
    foreignKey: 'last_read_message_id',
    as: 'lastReadMessage',
  });

  // ─── ChatGroup ↔ GroupJoinRequests ───────────────────────────────────────────
  ChatGroup.hasMany(GroupJoinRequest, { foreignKey: 'group_id', as: 'joinRequests' });
  GroupJoinRequest.belongsTo(ChatGroup, { foreignKey: 'group_id', as: 'group' });

  User.hasMany(GroupJoinRequest, { foreignKey: 'user_id', as: 'joinRequests' });
  GroupJoinRequest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // ─── ChatGroup ↔ GroupInviteLinks ────────────────────────────────────────────
  ChatGroup.hasMany(GroupInviteLink, { foreignKey: 'group_id', as: 'inviteLinks' });
  GroupInviteLink.belongsTo(ChatGroup, { foreignKey: 'group_id', as: 'group' });

  // ─── User ↔ AiRequests ───────────────────────────────────────────────────────
  User.hasMany(AiRequest, { foreignKey: 'user_id', as: 'aiRequests' });
  AiRequest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  ChatGroup.hasMany(AiRequest, { foreignKey: 'group_id', as: 'aiRequests' });
  AiRequest.belongsTo(ChatGroup, { foreignKey: 'group_id', as: 'group' });

  // ─── AiRequest ↔ AiResponse (1-1) ────────────────────────────────────────────
  AiRequest.hasOne(AiResponse, { foreignKey: 'request_id', as: 'response' });
  AiResponse.belongsTo(AiRequest, { foreignKey: 'request_id', as: 'request' });

  // ─── User ↔ AiLogs ───────────────────────────────────────────────────────────
  User.hasMany(AiLog, { foreignKey: 'user_id', as: 'aiLogs' });
  AiLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // ─── VipPackage ↔ VipTransactions ────────────────────────────────────────────
  VipPackage.hasMany(VipTransaction, { foreignKey: 'package_id', as: 'transactions' });
  VipTransaction.belongsTo(VipPackage, { foreignKey: 'package_id', as: 'package' });

  User.hasMany(VipTransaction, { foreignKey: 'user_id', as: 'vipTransactions' });
  VipTransaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // ─── User ↔ BankTransactions ─────────────────────────────────────────────────
  User.hasMany(BankTransaction, { foreignKey: 'user_id', as: 'bankTransactions' });
  BankTransaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // ─── User ↔ Notifications ────────────────────────────────────────────────────
  User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // ─── Admin ↔ AdminLogs ───────────────────────────────────────────────────────
  User.hasMany(AdminLog, { foreignKey: 'admin_id', as: 'adminLogs' });
  AdminLog.belongsTo(User, { foreignKey: 'admin_id', as: 'admin' });
};
