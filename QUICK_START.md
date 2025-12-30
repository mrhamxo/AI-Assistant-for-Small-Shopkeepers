# 🚀 Quick Start Guide

## Step 1: Start Backend

```powershell
# Navigate to backend
cd backend

# Activate virtual environment
.\venv\Scripts\activate

# (First time only) Install dependencies
pip install -r requirements.txt

# (Optional) Add demo data
python seed_demo_data.py

# Start server
python run.py
```

Backend starts at: **http://localhost:8000**

---

## Step 2: Start Frontend

Open a **NEW** terminal:

```powershell
# Navigate to frontend
cd frontend

# (First time only) Install dependencies
npm install

# Start development server
npm start
```

Frontend starts at: **http://localhost:3000**

---

## Step 3: Login

Use demo credentials:

| Role | Email | Password |
|------|-------|----------|
| **Shopkeeper** | demo@shopkeeper.com | demo123 |
| **Admin** | admin@shopkeeper.com | admin123 |

---

## 🎯 User Workflow

### For Shopkeepers

1. **Login** → Go to http://localhost:3000/login
2. **First Time?** → Complete the onboarding tour
3. **Record Sales** → Type "Sold 5 rice at 80" in chat
4. **Record Purchases** → Type "Bought 10 pens at 20"
5. **Create Invoices** → Type "Invoice for Ahmed: 3 rice at 80"
6. **Check Inventory** → Click "Inventory" or type "Show inventory"
7. **View Reports** → Click "Reports" for analytics
8. **Get Alerts** → Type "What should I reorder?"

### For Admins

1. **Login** with admin credentials
2. **View Dashboard** → System overview
3. **Manage Users** → Activate/deactivate accounts
4. **View Statistics** → Total users, products, sales
5. **Check System Health** → API, Database status

---

## 📱 Pages Overview

| Page | How to Access | Purpose |
|------|---------------|---------|
| **Home** | http://localhost:3000 | Landing page |
| **Login** | /login | Sign in |
| **Signup** | /signup | Create account |
| **Dashboard** | /dashboard | AI Chat interface |
| **Inventory** | /inventory | Manage products |
| **Invoices** | /invoices | View/print invoices |
| **Reports** | /reports | Sales analytics |
| **Settings** | /settings | Profile & preferences |
| **Admin** | /admin | User management |
| **Help** | /help | User guide |

---

## 💬 Quick Commands

```
Sold 5kg rice at 80
Bought 10 pens at 20 each
Invoice for Ahmed: 3 rice at 80, 2 oil at 150
Show inventory
Today's summary
What should I reorder?
```

---

## ⚠️ Troubleshooting

### Backend won't start?
```powershell
# Make sure venv is activated
.\venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend won't start?
```powershell
# Delete and reinstall
Remove-Item -Recurse -Force node_modules
npm install
npm start
```

### Login not working?
1. Make sure backend is running on port 8000
2. Run `python seed_demo_data.py` to create demo users
3. Clear browser localStorage and try again

### Chat not responding?
1. Check if GROQ_API_KEY is in backend/.env
2. The app works without it (uses regex fallback)
3. Check backend terminal for errors

---

## 🔑 Getting Groq API Key (Free)

1. Visit [console.groq.com](https://console.groq.com)
2. Create free account
3. Go to "API Keys" section
4. Click "Create API Key"
5. Add to `backend/.env`:
   ```
   GROQ_API_KEY=your_key_here
   ```

---

## 📞 Need Help?

- Check the **Help** page at /help
- Read the README.md for full documentation
- Visit the **Contact** page for support
