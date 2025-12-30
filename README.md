# 🏪 ShopKeeperAI - AI-Powered Shop Assistant

A production-ready, AI-powered assistant for small retail shopkeepers. Manage invoices, inventory, sales, and get smart insights using simple natural language commands.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.10+-yellow.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)

## ✨ Features

### 🤖 AI-Powered Chat Interface
- Natural language command processing
- Smart intent recognition using Groq API (free LLM)
- Fallback regex parser for offline use

### 📦 Inventory Management
- Real-time stock tracking
- Low stock alerts
- Product search and filtering
- Automatic price recommendations

### 📄 Invoice Generation
- Quick invoice creation via chat
- Professional invoice format
- Print-ready invoices

### 📊 Sales Analytics
- Daily sales summaries
- Profit tracking
- Top-selling items analysis
- Visual reports

### 🌐 Multi-Language Support
- English to Urdu translation

### 👥 User Management
- Secure authentication (JWT)
- Role-based access (Admin/Shopkeeper)
- Advanced admin panel with analytics

### 🎯 User Experience
- Beautiful dark theme UI
- Responsive design
- Onboarding tutorial
- Settings & preferences

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### 1. Backend Setup

```powershell
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed demo data (optional but recommended)
python seed_demo_data.py

# Start server
python run.py
```

Backend runs at: **http://localhost:8000**

### 2. Frontend Setup

```powershell
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs at: **http://localhost:3000**

## 📋 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Shopkeeper | demo@shopkeeper.com | demo123 |
| Admin | admin@shopkeeper.com | admin123 |

## 💬 Chat Commands

| Command | Description |
|---------|-------------|
| `Sold 5kg rice at 80` | Record a sale |
| `Bought 10 pens at 20 each` | Record a purchase |
| `Invoice for Ahmed: 3 rice at 80, 2 oil at 150` | Create invoice |
| `Show inventory` | View all products |
| `Today's summary` | Get daily report |
| `What should I reorder?` | Low stock alerts |
| `What price for rice?` | Price recommendations |

## 📁 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application
│   ├── auth.py              # Authentication
│   ├── database.py          # Database setup
│   ├── business_logic.py    # Core business logic
│   ├── ai_intent_parser.py  # AI intent parsing
│   ├── translation.py       # Translation module
│   ├── seed_demo_data.py    # Demo data seeder
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/      # Navbar, Footer, ProfileDropdown
│   │   │   ├── Chat/        # Chat components
│   │   │   └── Onboarding/  # Welcome modal
│   │   ├── pages/
│   │   │   ├── Home.js      # Landing page
│   │   │   ├── About.js     # About page
│   │   │   ├── Contact.js   # Contact page
│   │   │   ├── Help.js      # Help/tutorial page
│   │   │   ├── Dashboard.js # Chat interface
│   │   │   ├── Inventory.js # Inventory management
│   │   │   ├── Invoices.js  # Invoice management
│   │   │   ├── Reports.js   # Analytics
│   │   │   ├── Admin.js     # Admin panel
│   │   │   └── Settings.js  # User settings
│   │   ├── context/         # React context
│   │   └── services/        # API services
│   └── package.json
│
└── README.md
```

## 🔧 Configuration

### Environment Variables (backend/.env)

```env
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your-secure-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=43200
DB_PATH=shopkeeper_assistant.db
```

### Getting Free Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free
3. Create an API key
4. Add to `.env` file

## 📱 Pages Overview

| Page | Description |
|------|-------------|
| **Home** | Landing page with features showcase |
| **About** | Company information |
| **Contact** | Contact form and FAQ |
| **Help** | Comprehensive user guide |
| **Dashboard** | Main chat interface |
| **Inventory** | Product management |
| **Invoices** | Invoice list and preview |
| **Reports** | Sales analytics |
| **Admin** | User management (admin only) |
| **Settings** | Profile & preferences |

## 🔐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/signup` | POST | Register new user |
| `/login` | POST | User login |
| `/chat` | POST | Send chat message |
| `/inventory` | GET | Get inventory |
| `/summary` | GET | Get daily summary |
| `/invoices` | GET | List invoices |
| `/translate` | POST | Translate to Urdu |
| `/admin/users` | GET | List users (admin) |
| `/admin/stats` | GET | System stats (admin) |

## 🛠 Technology Stack

- **Backend**: FastAPI, SQLite, Python 3.10+
- **Frontend**: React 18, React Router, Axios
- **AI**: Groq API (LLaMA 3.1), Helsinki-NLP
- **Auth**: JWT, bcrypt

## 🌐 Deployment

### Live Demo
- **Frontend**: [ai-assistant-for-small-shopkeepers.vercel.app](https://ai-assistant-for-small-shopkeepers.vercel.app)
- **Backend API**: [shopkeeperai-backend-tnfddrjd.deployra.app](https://shopkeeperai-backend-tnfddrjd.deployra.app)

### Deploy Your Own

#### Backend (Deployra)

1. Create account at [deployra.com](https://deployra.com)
2. Connect your GitHub repository
3. Create a **Web Service** with:
   - **Path to Dockerfile**: `./Dockerfile`
   - **Internal Port**: `8000`
4. Add environment variables:
   - `GROQ_API_KEY` - Your Groq API key
   - `SECRET_KEY` - Random secure string
   - `FRONTEND_URL` - Your frontend URL

#### Frontend (Vercel)

1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set **Root Directory**: `frontend`
4. Add environment variable:
   - `REACT_APP_API_URL` - Your backend URL

### Deployment Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Backend Docker configuration |
| `Dockerfile.frontend` | Frontend Docker configuration |
| `frontend/vercel.json` | Vercel routing configuration |

## 📁 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application
│   ├── auth.py              # Authentication
│   ├── database.py          # Database setup
│   ├── business_logic.py    # Core business logic
│   ├── ai_intent_parser.py  # AI intent parsing
│   ├── translation.py       # Translation module
│   ├── seed_demo_data.py    # Demo data seeder
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   ├── vercel.json          # Vercel config
│   └── package.json
│
├── Dockerfile               # Backend deployment
├── Dockerfile.frontend      # Frontend deployment
└── README.md
```

## 📜 License

MIT License - Free for personal and commercial use.

---

Made with ❤️ for small businesses
