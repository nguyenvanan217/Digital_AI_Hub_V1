# 🚀 DoAnTN-AI-System – Monorepo V1

Dự án web sử dụng kiến trúc Monorepo, tách frontend / backend rõ ràng, dễ scale và dễ maintain.

---

## 🧠 Công nghệ sử dụng

- 🟦 **Node.js + Express + TypeScript** – Backend API
- 🟨 **Next.js + React** – Web frontend
- 🟪 **Vite + React** – Admin dashboard
- 🧬 **Sequelize ORM** – MySQL
- 🐬 **MySQL**
- 📦 **pnpm workspaces** – Quản lý monorepo

---

## 📁 Cấu trúc dự án

```
DoAnTN-AI-System/
├── apps/
│   ├── api/              # Backend API (Express + TS + Sequelize)
│   ├── web/              # Frontend (Next.js)
│   └── admin/            # Admin dashboard (Vite + React)
│
├── packages/             # (optional) shared packages / configs
│
├── .env                  # Env dùng chung (nếu có)
├── package.json          # Root scripts (pnpm workspace)
└── pnpm-workspace.yaml
```

---

## ⚙️ Hướng dẫn cài đặt & chạy dự án

### ✅ Bước 1: Cài đặt dependency (tại root)

```bash
pnpm install
```

### ✅ Bước 2: Tạo database MySQL

Bạn cần tạo database tên là `digital_ai_hub` trên MySQL.

```sql
CREATE DATABASE digital_ai_hub;
```

### ✅ Bước 3: Chạy migration (tại apps/api)

```bash
cd apps/api
npx sequelize-cli db:migrate
```

### ✅ Bước 4: Seed data admin (tại apps/api)

```bash
npx sequelize-cli db:seed:all
```

### ✅ Bước 5: Chạy dự án

**Chạy dev ở root để start tất cả cùng lúc:**

```bash
pnpm dev
```

**Hoặc start từng phần:**

```bash
# Backend
cd apps/api
pnpm dev

# Frontend
cd apps/web
pnpm dev

# Admin
cd apps/admin
pnpm dev
```

---

## 📝 License

MIT
