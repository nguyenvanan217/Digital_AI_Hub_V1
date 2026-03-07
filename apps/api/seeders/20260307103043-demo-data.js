'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {

    const password = bcrypt.hashSync('1212', 10);

    const avatar = 'https://avatars.githubusercontent.com/u/6412038?s=200&v=4';

    /* ================= USERS ================= */

    await queryInterface.bulkInsert('users', [
      {
        id:1,
        username:'Nguyễn Văn An',
        email:'admin@gmail.com',
        password_hash:password,
        vip_expired_at:'2025-04-10',
        role:'admin',
        created_at:'2025-01-01',
        updated_at:'2025-01-05'
      },
      {
        id:2,
        username:'minhtam',
        email:'tam02@example.com',
        password_hash:password,
        vip_expired_at:'2025-04-10',
        role:'user',
        created_at:'2025-01-02',
        updated_at:'2025-01-06'
      },
      {
        id:3,
        username:'trucnguyen',
        email:'truc03@example.com',
        password_hash:password,
        vip_expired_at:'2025-04-10',
        role:'user',
        created_at:'2025-01-05',
        updated_at:'2025-01-07'
      },
      {
        id:4,
        username:'quanghuy',
        email:'huy04@example.com',
        password_hash:password,
        vip_expired_at:'2025-04-10',
        role:'user',
        created_at:'2025-01-06',
        updated_at:'2025-01-06'
      },
      {
        id:5,
        username:'nhihuynh',
        email:'nhi05@example.com',
        password_hash:password,
        vip_expired_at:'2025-04-10',
        role:'user',
        created_at:'2025-01-10',
        updated_at:'2025-01-10'
      }
    ]);



    /* ================= CHAT GROUPS ================= */

    await queryInterface.bulkInsert('chat_groups', [
      {
        id:1,
        name:'Nhóm học Toán',
        slug:'nhom-hoc-toan',
        description:'Ôn bài kiểm tra tuần',
        user_id:1,
        rules:'Không chửi bậy nói thề',
        is_public:1,
        avatar_url:avatar,
        created_at:'2025-01-05',
        updated_at:'2025-01-05'
      },
      {
        id:2,
        name:'Nhóm AI cơ bản',
        slug:'nhom-ai-co-ban',
        description:'Thảo luận về AI',
        user_id:3,
        rules:'Không chửi bậy nói thề',
        is_public:1,
        avatar_url:avatar,
        created_at:'2025-01-06',
        updated_at:'2025-01-06'
      },
      {
        id:3,
        name:'Nhóm react cơ bản',
        slug:'nhom-react-co-ban',
        description:'Lên ý tưởng đồ án',
        user_id:2,
        rules:'Không chửi bậy nói thề',
        is_public:0,
        avatar_url:avatar,
        created_at:'2025-01-07',
        updated_at:'2025-01-07'
      }
    ]);


    /* ================= GROUP MEMBERS ================= */

    await queryInterface.bulkInsert('chat_group_members', [
      { id:1, group_id:1, user_id:1, role:'admin', status:'active', last_read_message_id:7, joined_at:'2025-01-05' },
      { id:2, group_id:1, user_id:2, role:'member', status:'active', last_read_message_id:5, joined_at:'2025-01-05' },
      { id:3, group_id:1, user_id:3, role:'member', status:'active', last_read_message_id:2, joined_at:'2025-01-05' },
      { id:4, group_id:2, user_id:3, role:'member', status:'banned', last_read_message_id:1, joined_at:'2025-01-06' },
      { id:5, group_id:2, user_id:4, role:'member', status:'active', last_read_message_id:3, joined_at:'2025-01-06' },
      { id:6, group_id:3, user_id:2, role:'member', status:'pending', last_read_message_id:4, joined_at:'2025-01-07' },
      { id:7, group_id:3, user_id:5, role:'member', status:'active', last_read_message_id:3, joined_at:'2025-01-07' }
    ]);


    /* ================= CHAT MESSAGES ================= */

    await queryInterface.bulkInsert('chat_messages', [
      { id:1, group_id:1, user_id:1, content:'Chào mọi người! Hôm nay học phần nào?', url:null, hidden:false, created_at:'2025-01-05 09:00' },
      { id:2, group_id:1, user_id:2, content:'Chiều nay có bài tập toán đó.', url:null, hidden:false, created_at:'2025-01-05 09:05' },
      { id:3, group_id:1, user_id:3, content:'Mình chưa làm bài 3.', url:null, hidden:false, created_at:'2025-01-05 09:07' },
      { id:4, group_id:2, user_id:3, content:'AI có thể viết code không?', url:'/images/', hidden:false, created_at:'2025-01-06 10:00' },
      { id:5, group_id:2, user_id:4, content:'Có, nhưng cần prompt rõ.', url:'/images/', hidden:true, created_at:'2025-01-06 10:02' },
      { id:6, group_id:3, user_id:2, content:'Đồ án nên làm web AI.', url:'/images/', hidden:false, created_at:'2025-01-07 15:00' }
    ]);


    /* ================= AI REQUEST ================= */

    await queryInterface.bulkInsert('ai_requests', [
      { id:1, user_id:1, group_id:1, request_type:'summary', prompt:'Tóm tắt tin nhắn chưa đọc', created_at:'2025-01-05' },
      { id:2, user_id:3, group_id:2, request_type:'explain', prompt:'AI có thể viết code không', created_at:'2025-01-06' },
      { id:3, user_id:2, group_id:3, request_type:'chat', prompt:'Gợi ý ý tưởng đồ án AI', created_at:'2025-01-07' }
    ]);


    /* ================= AI RESPONSES ================= */

    await queryInterface.bulkInsert('ai_responses', [
      { id:1, request_id:1, output_text:'Nhóm đang thảo luận bài tập toán buổi chiều.', created_at:'2025-01-05' },
      { id:2, request_id:2, output_text:'AI có thể hỗ trợ viết code nếu prompt rõ ràng.', created_at:'2025-01-06' },
      { id:3, request_id:3, output_text:'Nhóm đang đề xuất làm web tích hợp AI cho đồ án.', created_at:'2025-01-07' }
    ]);


    /* ================= MESSAGE REACTIONS ================= */

    await queryInterface.bulkInsert('message_reactions', [
      { id:1, message_id:1, user_id:2, reaction_type:'like', created_at:'2025-01-05' },
      { id:2, message_id:2, user_id:1, reaction_type:'like', created_at:'2025-01-05' },
      { id:3, message_id:4, user_id:4, reaction_type:'like', created_at:'2025-01-06' }
    ]);


    /* ================= GROUP JOIN REQUEST ================= */

    await queryInterface.bulkInsert('group_join_requests', [
      { id:1, group_id:3, user_id:1, status:'pending', created_at:'2025-01-07' },
      { id:2, group_id:3, user_id:4, status:'approved', created_at:'2025-01-07' }
    ]);


    /* ================= GROUP INVITE ================= */

    await queryInterface.bulkInsert('group_invite_links', [
      { id:1, group_id:1, invite_code:'ABC123', expired_at:'2025-02-01', created_at:'2025-01-05' },
      { id:2, group_id:2, invite_code:'XYZ456', expired_at:'2025-02-01', created_at:'2025-01-06' }
    ]);


    /* ================= VIP PACKAGES ================= */

    await queryInterface.bulkInsert('vip_packages', [
      { id:1, name:'VIP 3 tháng', price:50000, duration_days:90, created_at:'2025-01-01' },
      { id:2, name:'VIP 6 tháng', price:90000, duration_days:180, created_at:'2025-01-01' },
      { id:3, name:'VIP 12 tháng', price:160000, duration_days:365, created_at:'2025-01-01' }
    ]);


    /* ================= VIP TRANSACTIONS ================= */

    await queryInterface.bulkInsert('vip_transactions', [
      { id:1, user_id:1, package_id:1, status:'success', created_at:'2025-01-10', updated_at:'2025-01-05' },
      { id:2, user_id:3, package_id:1, status:'fail', created_at:'2025-01-11', updated_at:'2025-01-06' }
    ]);


    /* ================= BANK TRANSACTIONS ================= */

    await queryInterface.bulkInsert('bank_transactions', [
      { id:1, user_id:1, transaction_code:'VCB123456', amount:50000, created_at:'2025-01-10' },
      { id:2, user_id:3, transaction_code:'TCB987654', amount:50000, created_at:'2025-01-11' }
    ]);


    /* ================= GAMES ================= */

    await queryInterface.bulkInsert('games', [
      { id:1, name:'game tài xỉu', slug:'game-tai-xiu', description:'game tài xỉu', is_active:true },
      { id:2, name:'game đào vàng', slug:'game-dao-vang', description:'game đào vàng', is_active:true },
      { id:3, name:'game rắn săn mồi', slug:'game-ran-san-moi', description:'game rắn săn mồi', is_active:false }
    ]);


    /* ================= AI LOGS ================= */

    await queryInterface.bulkInsert('ai_logs', [
      { id:1, user_id:1, type:'chat', input_text:'Giải thích định luật Ohm.', output_text:'Định luật Ohm: V = I × R.', output_url:null, created_at:'2025-01-02' },
      { id:2, user_id:1, type:'tts', input_text:'Hôm nay trời đẹp quá.', output_text:null, output_url:'/tts/voice_1.mp3', created_at:'2025-01-02' },
      { id:3, user_id:2, type:'image', input_text:'Vẽ con mèo đang học bài.', output_text:null, output_url:'/images/cat_study.png', created_at:'2025-01-03' }
    ]);


    /* ================= NOTIFICATIONS ================= */

    await queryInterface.bulkInsert('notifications', [
      { id:1, user_id:3, type:'mention', content:'username ... trong nhóm ...', is_read:true, target_id:3, created_at:'2025-01-05' },
      { id:2, user_id:5, type:'approved', content:'Nhóm học react', is_read:false, target_id:3, created_at:'2025-01-06' },
      { id:3, user_id:2, type:'join_request', content:'user6 muốn vào nhóm React', is_read:false, target_id:3, created_at:'2025-01-06' }
    ]);


    /* ================= ADMIN LOGS ================= */

    await queryInterface.bulkInsert('admin_logs', [
      { id:1, admin_id:1, action:'delete_message', target_type:'chat_messages', target_id:5, description:'Thu hồi tin nhắn vi phạm', created_at:'2025-01-05' },
      { id:2, admin_id:1, action:'ban_user', target_type:'users', target_id:4, description:'Ban user spam', created_at:'2025-01-06' },
      { id:3, admin_id:1, action:'approve_join_request', target_type:'group_join_requests', target_id:2, description:'Duyệt user vào nhóm', created_at:'2025-01-07' },
      { id:4, admin_id:1, action:'disable_game', target_type:'games', target_id:3, description:'Ẩn game rắn săn mồi', created_at:'2025-01-08' }
    ]);

  },

  async down(queryInterface) {

    const tables = [
      'admin_logs',
      'notifications',
      'ai_logs',
      'games',
      'bank_transactions',
      'vip_transactions',
      'vip_packages',
      'group_invite_links',
      'group_join_requests',
      'message_reactions',
      'ai_responses',
      'ai_requests',
      'chat_messages',
      'chat_group_members',
      'chat_groups',
      'users'
    ];

    for (const table of tables) {
      await queryInterface.bulkDelete(table, null, {});
    }

  }
};