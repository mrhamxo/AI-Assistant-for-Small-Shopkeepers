"""
Demo Data Seeder - Adds unique sample data for all users
Run: python seed_demo_data.py
"""
import sqlite3
import json
from datetime import datetime, timedelta
from passlib.context import CryptContext
import random

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Different product catalogs for different shop types
SHOP_CATALOGS = {
    "general": [
        ("rice", 70, 85), ("wheat flour", 55, 65), ("sugar", 90, 105),
        ("cooking oil", 280, 320), ("dal", 140, 160), ("salt", 20, 25),
        ("tea", 450, 520), ("milk powder", 380, 440), ("soap", 35, 45),
        ("shampoo", 120, 150), ("toothpaste", 85, 100), ("biscuits", 25, 35),
        ("chips", 15, 20), ("cold drinks", 40, 50), ("bread", 80, 100),
    ],
    "electronics": [
        ("usb cable", 150, 200), ("earphones", 250, 350), ("charger", 300, 400),
        ("power bank", 800, 1100), ("mouse", 400, 550), ("keyboard", 600, 800),
        ("led bulb", 80, 120), ("extension cord", 200, 280), ("batteries", 30, 45),
        ("memory card", 350, 480), ("phone cover", 100, 180), ("screen guard", 50, 100),
    ],
    "cosmetics": [
        ("face cream", 180, 250), ("lipstick", 120, 180), ("foundation", 350, 480),
        ("mascara", 200, 290), ("nail polish", 60, 95), ("perfume", 450, 620),
        ("face wash", 150, 210), ("hair oil", 180, 250), ("body lotion", 220, 300),
        ("sunscreen", 280, 380), ("compact powder", 150, 220), ("kajal", 80, 120),
    ],
    "grocery": [
        ("rice basmati", 180, 220), ("atta", 85, 100), ("ghee", 450, 520),
        ("milk", 120, 140), ("eggs", 200, 240), ("chicken", 380, 450),
        ("vegetables mix", 100, 130), ("fruits", 150, 200), ("yogurt", 80, 100),
        ("butter", 250, 300), ("cheese", 180, 220), ("juice pack", 65, 85),
        ("noodles", 30, 45), ("pasta", 120, 150), ("sauce", 85, 110),
    ],
    "stationery": [
        ("notebook", 40, 60), ("pen", 15, 25), ("pencil", 8, 15),
        ("eraser", 10, 18), ("ruler", 20, 35), ("marker", 35, 55),
        ("highlighter", 45, 70), ("stapler", 120, 180), ("tape", 30, 50),
        ("glue stick", 40, 65), ("scissors", 60, 95), ("file folder", 50, 80),
        ("register", 80, 120), ("sticky notes", 55, 85), ("calculator", 250, 380),
    ],
}

CUSTOMER_NAMES = [
    "Ali Hassan", "Bilal Ahmed", "Imran Khan", "Faisal Shah", "Usman Malik",
    "Ahmed Raza", "Kamran Ali", "Tariq Mehmood", "Sajid Hussain", "Waseem Khan",
    "Amir Sohail", "Junaid Ahmed", "Zubair Ali", "Kashif Nawaz", "Rizwan Ahmed",
    "Fatima Bibi", "Ayesha Khan", "Sana Malik", "Hira Ahmed", "Zara Hussain",
]

def get_random_catalog():
    """Get a random product catalog"""
    catalog_type = random.choice(list(SHOP_CATALOGS.keys()))
    return catalog_type, SHOP_CATALOGS[catalog_type]

def seed_user_data(cursor, user_id, user_name):
    """Seed unique data for a specific user"""
    print(f"  [+] Seeding data for user {user_id}: {user_name}")
    
    # Clear existing data for this user
    cursor.execute("DELETE FROM products WHERE user_id = ?", (user_id,))
    cursor.execute("DELETE FROM sales WHERE user_id = ?", (user_id,))
    cursor.execute("DELETE FROM purchases WHERE user_id = ?", (user_id,))
    cursor.execute("DELETE FROM invoices WHERE user_id = ?", (user_id,))
    
    # Get random catalog for variety
    catalog_type, products = get_random_catalog()
    
    # Add products with random stock
    product_ids = {}
    for name, cost, selling in products:
        stock = random.randint(20, 200)
        cursor.execute("""
            INSERT INTO products (user_id, name, cost_price, selling_price, stock, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, name, cost, selling, stock, datetime.now().isoformat()))
        product_ids[name] = cursor.lastrowid
    
    print(f"      - Added {len(products)} {catalog_type} products")
    
    # Generate sales for last 14 days (more data)
    sales_count = 0
    for days_ago in range(14):
        date = datetime.now() - timedelta(days=days_ago)
        # More sales on recent days
        num_sales = random.randint(8, 25) if days_ago < 3 else random.randint(3, 12)
        
        for _ in range(num_sales):
            product = random.choice(products)
            name, cost, selling = product
            quantity = random.randint(1, 15)
            
            # Slight price variation
            actual_selling = selling + random.randint(-5, 10)
            
            cursor.execute("""
                INSERT INTO sales (user_id, product_id, product_name, quantity, selling_price, cost_price, date)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (user_id, product_ids.get(name), name, quantity, actual_selling, cost, date.isoformat()))
            
            # Update stock
            cursor.execute("UPDATE products SET stock = stock - ? WHERE id = ?", 
                          (min(quantity, 5), product_ids.get(name)))
            sales_count += 1
    
    print(f"      - Added {sales_count} sales records")
    
    # Generate purchases for last 30 days
    purchases_count = 0
    for days_ago in range(7, 30, 3):  # Every 3 days
        date = datetime.now() - timedelta(days=days_ago)
        num_purchases = random.randint(2, 6)
        
        for _ in range(num_purchases):
            product = random.choice(products)
            name, cost, _ = product
            quantity = random.randint(20, 100)
            
            cursor.execute("""
                INSERT INTO purchases (user_id, product_id, product_name, quantity, cost_price, date)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (user_id, product_ids.get(name), name, quantity, cost, date.isoformat()))
            
            # Update stock
            cursor.execute("UPDATE products SET stock = stock + ? WHERE id = ?", 
                          (quantity, product_ids.get(name)))
            purchases_count += 1
    
    print(f"      - Added {purchases_count} purchase records")
    
    # Generate invoices for last 10 days
    invoices_count = 0
    for days_ago in range(10):
        date = datetime.now() - timedelta(days=days_ago)
        # 1-3 invoices per day
        num_invoices = random.randint(1, 3)
        
        for _ in range(num_invoices):
            customer = random.choice(CUSTOMER_NAMES)
            
            # Random items for invoice
            num_items = random.randint(2, 6)
            items = []
            total = 0
            
            for _ in range(num_items):
                product = random.choice(products)
                name, _, selling = product
                qty = random.randint(1, 8)
                price = selling + random.randint(-3, 5)
                items.append({"name": name, "quantity": qty, "price": price})
                total += qty * price
            
            invoice_number = f"INV-{user_id}-{date.strftime('%Y%m%d')}{random.randint(100, 999)}"
            
            cursor.execute("""
                INSERT INTO invoices (user_id, invoice_number, customer_name, total_amount, items, date)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (user_id, invoice_number, customer, total, json.dumps(items), date.isoformat()))
            invoices_count += 1
    
    print(f"      - Added {invoices_count} invoices")
    return sales_count, purchases_count, invoices_count

def seed_demo_data():
    conn = sqlite3.connect('shopkeeper_assistant.db')
    cursor = conn.cursor()
    
    print("[*] Starting comprehensive demo data seeding...")
    print("")
    
    # Ensure demo users exist
    demo_users = [
        ("Demo Shopkeeper", "demo@shopkeeper.com", "demo123", "shopkeeper", "Demo General Store"),
        ("Ali Electronics", "ali@demo.com", "demo123", "shopkeeper", "Ali Electronics Shop"),
        ("Fatima Cosmetics", "fatima@demo.com", "demo123", "shopkeeper", "Fatima Beauty Store"),
        ("Hassan Grocery", "hassan@demo.com", "demo123", "shopkeeper", "Hassan Mart"),
    ]
    
    for name, email, password, role, shop_name in demo_users:
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO users (name, email, password_hash, role, shop_name, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (name, email, pwd_context.hash(password), role, shop_name, 1, datetime.now().isoformat()))
            print(f"[+] Created user: {email}")
    
    conn.commit()
    
    # Get all non-admin users and seed data for each
    cursor.execute("SELECT id, name FROM users WHERE role != 'admin'")
    users = cursor.fetchall()
    
    print(f"\n[*] Seeding data for {len(users)} users...\n")
    
    total_sales = 0
    total_purchases = 0
    total_invoices = 0
    
    for user_id, user_name in users:
        s, p, i = seed_user_data(cursor, user_id, user_name)
        total_sales += s
        total_purchases += p
        total_invoices += i
        conn.commit()
    
    print(f"\n[SUCCESS] Demo data seeding complete!")
    print(f"\n   Total Users Seeded: {len(users)}")
    print(f"   Total Sales: {total_sales}")
    print(f"   Total Purchases: {total_purchases}")
    print(f"   Total Invoices: {total_invoices}")
    print(f"\n   Demo Accounts:")
    print(f"   - demo@shopkeeper.com / demo123")
    print(f"   - ali@demo.com / demo123")
    print(f"   - fatima@demo.com / demo123")
    print(f"   - hassan@demo.com / demo123")
    print(f"   - admin@shopkeeper.com / admin123 (Admin)")
    
    conn.close()

if __name__ == "__main__":
    seed_demo_data()
