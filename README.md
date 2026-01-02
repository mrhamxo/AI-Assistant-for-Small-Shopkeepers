# 🏪 ShopKeeperAI - AI-Powered Shop Assistant

A production-ready, AI-powered assistant for small retail shopkeepers. Manage invoices, inventory, sales, and get smart insights using simple natural language commands.

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.10+-yellow.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)

## 🌐 Live Demo

| Service | Platform | URL |
|---------|----------|-----|
| **Frontend** | Vercel | [ai-assistant-for-small-shopkeepers.vercel.app](https://ai-assistant-for-small-shopkeepers.vercel.app) |
| **Backend** | Deployra | [shopkeeperai-backend-tnfddrjd.deployra.app](https://shopkeeperai-backend-tnfddrjd.deployra.app) |
| **API Docs** | Swagger | [/docs](https://shopkeeperai-backend-tnfddrjd.deployra.app/docs) |

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Shopkeeper | demo@shopkeeper.com | demo123 |
| Admin | admin@shopkeeper.com | admin123 |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Chat** | Natural language commands with Groq API (LLaMA 3.1) |
| 📦 **Inventory** | Real-time stock tracking with low-stock alerts |
| 📄 **Invoices** | Quick invoice generation via chat |
| 📊 **Analytics** | Daily sales summaries with profit tracking |
| 🌐 **Translation** | English to Urdu translation |
| 👥 **Multi-user** | JWT authentication with Admin/Shopkeeper roles |

---

## 💬 Chat Commands

| Action | Command Example |
|--------|-----------------|
| **Add Stock** | `Bought 50 rice at 70` |
| **Record Sale** | `Sold 5 rice at 85` |
| **Create Invoice** | `Invoice for Ali: 3 rice at 85, 2 oil at 320` |
| **View Inventory** | `Show inventory` |
| **Daily Report** | `Today's summary` |
| **Low Stock** | `What should I reorder?` |
| **Price Advice** | `What price for rice?` |

> 📖 See [docs/User_Guide.md](docs/User_Guide.md) for complete command reference.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend Setup

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python seed_demo_data.py   # Optional: add demo data
python run.py
```

Backend runs at: **http://localhost:8000**

### Frontend Setup

```powershell
cd frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 📁 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application
│   ├── business_logic.py    # Core business logic
│   ├── ai_intent_parser.py  # AI/NLP processing
│   ├── auth.py              # JWT authentication
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # React components
│   │   └── services/        # API client
│   └── package.json
│
├── docs/
│   ├── Project_Report.md    # Technical documentation
│   └── User_Guide.md        # How to use the app
│
├── Dockerfile               # Backend deployment
├── Dockerfile.frontend      # Frontend deployment
└── README.md
```

---

## 🛠 Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, React Router, Axios |
| **Backend** | Python 3.10+, FastAPI, Uvicorn |
| **Database** | SQLite |
| **AI/NLP** | Groq API (LLaMA 3.1), Helsinki-NLP |
| **Auth** | JWT, bcrypt |
| **Deployment** | Vercel, Deployra (Docker) |

---

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_secure_secret
FRONTEND_URL=https://your-frontend.vercel.app
```

**Frontend**
```env
REACT_APP_API_URL=https://your-backend.deployra.app
```

### Get Free Groq API Key
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free
3. Create an API key

---

## 🌐 Deployment

### Backend (Deployra)
1. Create Web Service at [deployra.com](https://deployra.com)
2. Set **Path to Dockerfile**: `./Dockerfile`
3. Set **Internal Port**: `8000`
4. Add environment variables

### Frontend (Vercel)
1. Import repo at [vercel.com](https://vercel.com)
2. Set **Root Directory**: `frontend`
3. Add `REACT_APP_API_URL` environment variable

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [docs/Project_Report.md](docs/Project_Report.md) | Technical project report |
| [docs/User_Guide.md](docs/User_Guide.md) | How to use ShopKeeperAI |
| [QUICK_START.md](QUICK_START.md) | Quick start guide |

---

## 📜 License

MIT License - Free for personal and commercial use.

---

Made with ❤️ for small businesses
