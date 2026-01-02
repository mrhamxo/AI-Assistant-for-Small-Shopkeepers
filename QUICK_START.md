# 🚀 Quick Start Guide

## Live Demo

**Try it now:** [ai-assistant-for-small-shopkeepers.vercel.app](https://ai-assistant-for-small-shopkeepers.vercel.app)

| Role | Email | Password |
|------|-------|----------|
| Shopkeeper | demo@shopkeeper.com | demo123 |
| Admin | admin@shopkeeper.com | admin123 |

---

## Local Development

### Step 1: Start Backend

```powershell
cd backend
.\venv\Scripts\activate          # Activate virtual environment
pip install -r requirements.txt  # First time only
python seed_demo_data.py         # Optional: add demo data
python run.py                    # Start server
```

Backend: **http://localhost:8000**

### Step 2: Start Frontend

Open a **NEW** terminal:

```powershell
cd frontend
npm install    # First time only
npm start      # Start server
```

Frontend: **http://localhost:3000**

---

## 🎯 Getting Started (New User)

### 1. Create Account
Go to `/signup` and register

### 2. Add Your First Products
Type these commands in the chat:

```
Bought 50 rice at 70
Bought 30 cooking oil at 280
Bought 40 sugar at 90
```

### 3. Start Selling
```
Sold 5 rice at 85
Sold 2 cooking oil at 320
```

### 4. Create Invoices
```
Invoice for Ali: 3 rice at 85, 2 oil at 320
```

### 5. Check Reports
```
Today's summary
What should I reorder?
```

---

## 💬 Quick Commands Reference

| Action | Command |
|--------|---------|
| **Add Stock** | `Bought 50 rice at 70` |
| **Record Sale** | `Sold 5 rice at 85` |
| **Create Invoice** | `Invoice for Ali: 3 rice at 85` |
| **View Inventory** | `Show inventory` |
| **Daily Report** | `Today's summary` |
| **Low Stock** | `What should I reorder?` |
| **Price Advice** | `What price for rice?` |
| **Help** | `Help` |

---

## 📱 Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | /dashboard | AI Chat interface |
| Inventory | /inventory | Manage products |
| Invoices | /invoices | View invoices |
| Reports | /reports | Sales analytics |
| Settings | /settings | Profile settings |
| Admin | /admin | User management |

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Activate venv: `.\venv\Scripts\activate` |
| Frontend won't start | Delete node_modules and run `npm install` |
| Login not working | Run `python seed_demo_data.py` |
| Chat not responding | App works without Groq API (uses fallback) |
| Empty inventory | Add products: `Bought 50 rice at 70` |

---

## 🔑 Groq API Key (Optional)

1. Go to [console.groq.com](https://console.groq.com)
2. Create free account
3. Generate API key
4. Add to `backend/.env`:
   ```
   GROQ_API_KEY=your_key_here
   ```

---

## 📖 More Documentation

- [docs/User_Guide.md](docs/User_Guide.md) - Complete user guide
- [docs/Project_Report.md](docs/Project_Report.md) - Technical documentation
- [README.md](README.md) - Full project readme
