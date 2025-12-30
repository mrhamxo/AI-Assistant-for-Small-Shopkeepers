"""
ShopKeeperAI - Advanced AI Assistant for Small Shopkeepers
Production-ready FastAPI backend
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import json

from database import init_database, get_db_connection
from auth import (
    get_password_hash, verify_password, create_access_token, 
    get_current_user, require_admin, ACCESS_TOKEN_EXPIRE_MINUTES
)
from business_logic import (
    process_chat_message, get_inventory, get_daily_summary,
    get_all_invoices, get_low_stock_notifications
)
from translation import translate_to_urdu
from logger_config import logger
from config import GROQ_API_KEY

# Initialize FastAPI app
app = FastAPI(
    title="ShopKeeperAI API",
    description="AI-powered assistant for small retail shopkeepers",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    shop_name: Optional[str] = "My Shop"

class ChatMessage(BaseModel):
    message: str

class TranslateRequest(BaseModel):
    text: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    try:
        init_database()
        logger.info("Application started successfully")
        if GROQ_API_KEY:
            logger.info("Groq API key configured")
        else:
            logger.warning("Groq API key not found - using fallback parser")
    except Exception as e:
        logger.error(f"Failed to initialize application: {e}")
        raise

# Root endpoint with API info
@app.get("/")
async def root():
    return {
        "name": "ShopKeeperAI API",
        "version": "2.0.0",
        "description": "AI-powered assistant for small retail shopkeepers",
        "docs": "/docs",
        "redoc": "/redoc",
        "endpoints": {
            "auth": ["/signup", "/login"],
            "chat": "/chat",
            "inventory": "/inventory",
            "invoices": "/invoices",
            "summary": "/summary",
            "translate": "/translate",
            "admin": ["/admin/users", "/admin/stats"]
        },
        "status": "running"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "2.0.0"}

# Authentication endpoints
@app.post("/signup", response_model=dict)
async def signup(user_data: UserSignup):
    """Register a new shopkeeper account"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if email exists
        cursor.execute("SELECT id FROM users WHERE email = ?", (user_data.email,))
        if cursor.fetchone():
            conn.close()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        from datetime import datetime
        password_hash = get_password_hash(user_data.password)
        cursor.execute("""
            INSERT INTO users (name, email, password_hash, role, shop_name, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            user_data.name,
            user_data.email,
            password_hash,
            "shopkeeper",
            user_data.shop_name,
            1,
            datetime.now().isoformat()
        ))
        
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        
        logger.info(f"New user registered: {user_data.email}")
        return {"message": "Account created successfully", "user_id": user_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create account"
        )

@app.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and get access token"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, name, email, password_hash, role, shop_name, is_active
            FROM users WHERE email = ?
        """, (form_data.username,))
        
        user_row = cursor.fetchone()
        conn.close()
        
        if not user_row:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user = {
            "id": user_row[0],
            "name": user_row[1],
            "email": user_row[2],
            "password_hash": user_row[3],
            "role": user_row[4],
            "shop_name": user_row[5],
            "is_active": user_row[6]
        }
        
        if not verify_password(form_data.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not user["is_active"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
        
        # Create token
        access_token = create_access_token(
            data={"sub": str(user["id"])},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        logger.info(f"User logged in: {user['email']}")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "shop_name": user["shop_name"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

# Chat endpoint
@app.post("/chat")
async def chat(message: ChatMessage, current_user: dict = Depends(get_current_user)):
    """Process natural language commands via AI chat"""
    try:
        result = process_chat_message(message.message, current_user["id"])
        logger.info(f"Chat processed for user {current_user['id']}: {message.message[:50]}...")
        return result
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process message"
        )

# Inventory endpoint
@app.get("/inventory")
async def get_inventory_list(current_user: dict = Depends(get_current_user)):
    """Get user's inventory list"""
    try:
        inventory = get_inventory(current_user["id"])
        return {"inventory": inventory, "count": len(inventory)}
    except Exception as e:
        logger.error(f"Inventory error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get inventory"
        )

# Low stock notifications endpoint
@app.get("/notifications/low-stock")
async def get_stock_notifications(current_user: dict = Depends(get_current_user)):
    """Get low stock and out of stock notifications"""
    try:
        notifications = get_low_stock_notifications(current_user["id"])
        return notifications
    except Exception as e:
        logger.error(f"Notifications error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get notifications"
        )

# Summary endpoint
@app.get("/summary")
async def get_summary(current_user: dict = Depends(get_current_user)):
    """Get daily sales summary and analytics"""
    try:
        summary = get_daily_summary(current_user["id"])
        return summary
    except Exception as e:
        logger.error(f"Summary error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get summary"
        )

# Invoices endpoint
@app.get("/invoices")
async def get_invoices(current_user: dict = Depends(get_current_user)):
    """Get all invoices for current user"""
    try:
        invoices = get_all_invoices(current_user["id"])
        return {"invoices": invoices, "count": len(invoices)}
    except Exception as e:
        logger.error(f"Invoices error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get invoices"
        )

# Translation endpoint
@app.post("/translate")
async def translate_bill(request: TranslateRequest, current_user: dict = Depends(get_current_user)):
    """Translate English text to Urdu"""
    try:
        translated = translate_to_urdu(request.text)
        return {"translated_text": translated, "original_text": request.text}
    except Exception as e:
        logger.error(f"Translation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Translation failed"
        )

# Admin endpoints
@app.get("/admin/users")
async def admin_get_users(current_user: dict = Depends(require_admin)):
    """Get all users (admin only)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, email, role, shop_name, is_active, created_at
            FROM users ORDER BY created_at DESC
        """)
        rows = cursor.fetchall()
        conn.close()
        
        users = [{
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "role": row[3],
            "shop_name": row[4],
            "is_active": bool(row[5]),
            "created_at": row[6]
        } for row in rows]
        
        return {"users": users}
    except Exception as e:
        logger.error(f"Admin users error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get users"
        )

@app.get("/admin/stats")
async def admin_get_stats(current_user: dict = Depends(require_admin)):
    """Get system statistics (admin only)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM users")
        total_users = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM products")
        total_products = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM sales")
        total_sales = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM invoices")
        total_invoices = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            "total_users": total_users,
            "total_products": total_products,
            "total_sales": total_sales,
            "total_invoices": total_invoices
        }
    except Exception as e:
        logger.error(f"Admin stats error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get stats"
        )

@app.post("/admin/users/{user_id}/toggle")
async def admin_toggle_user(user_id: int, current_user: dict = Depends(require_admin)):
    """Toggle user active status (admin only)"""
    try:
        if user_id == current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot deactivate yourself"
            )
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT is_active FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        
        if not row:
            conn.close()
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        new_status = 0 if row[0] else 1
        cursor.execute("UPDATE users SET is_active = ? WHERE id = ?", (new_status, user_id))
        conn.commit()
        conn.close()
        
        logger.info(f"User {user_id} status changed to {new_status} by admin {current_user['id']}")
        return {"message": "User status updated", "is_active": bool(new_status)}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Toggle user error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
