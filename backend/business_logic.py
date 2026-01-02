"""
Business logic for shop operations
"""
import json
import sqlite3
import re
from datetime import datetime
from typing import Optional
from database import get_db_connection
from ai_intent_parser import parse_intent
from logger_config import logger

def get_or_create_product(user_id: int, product_name: str, cost_price: float = 0, selling_price: float = None):
    """Get existing product or create new one"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Normalize product name
        product_name = product_name.strip().lower()
        
        cursor.execute("""
            SELECT id, cost_price, selling_price, stock FROM products 
            WHERE user_id = ? AND LOWER(name) = ?
        """, (user_id, product_name))
        
        product = cursor.fetchone()
        
        if product:
            product_id = product[0]
            # Update price if provided
            if cost_price > 0:
                cursor.execute("UPDATE products SET cost_price = ? WHERE id = ?", (cost_price, product_id))
            if selling_price and selling_price > 0:
                cursor.execute("UPDATE products SET selling_price = ? WHERE id = ?", (selling_price, product_id))
            conn.commit()
        else:
            # Create new product
            cursor.execute("""
                INSERT INTO products (user_id, name, cost_price, selling_price, stock, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (user_id, product_name, cost_price, selling_price or cost_price, 0, datetime.now().isoformat()))
            product_id = cursor.lastrowid
            conn.commit()
        
        return product_id
    except Exception as e:
        logger.error(f"Get/create product error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def record_sale(user_id: int, product_name: str, quantity: float, selling_price: float, cost_price: float = None):
    """Record a sale transaction"""
    conn = None
    try:
        # First get or create product
        product_id = get_or_create_product(user_id, product_name, cost_price or 0, selling_price)
        
        # Now record the sale with a new connection
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check current stock
        cursor.execute("SELECT stock FROM products WHERE id = ?", (product_id,))
        current_stock = cursor.fetchone()[0] or 0
        
        # Record the sale
        cursor.execute("""
            INSERT INTO sales (user_id, product_id, product_name, quantity, selling_price, cost_price, date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, product_id, product_name.strip().lower(), quantity, selling_price, cost_price, datetime.now().isoformat()))
        
        # Update stock (decrease) - but never go below 0
        new_stock = max(0, current_stock - quantity)
        cursor.execute("UPDATE products SET stock = ? WHERE id = ?", (new_stock, product_id))
        
        conn.commit()
        
        total = quantity * selling_price
        logger.info(f"Sale recorded: {quantity} x {product_name} @ {selling_price}")
        
        # Check for low stock warning
        low_stock_warning = None
        if new_stock <= 0:
            low_stock_warning = f"⚠️ OUT OF STOCK: {product_name} is now out of stock! Please reorder."
        elif new_stock < 10:
            low_stock_warning = f"⚠️ LOW STOCK: Only {int(new_stock)} units of {product_name} remaining!"
        
        return {
            "product": product_name,
            "quantity": quantity,
            "price": selling_price,
            "total": total,
            "remaining_stock": new_stock,
            "low_stock_warning": low_stock_warning
        }
    except Exception as e:
        logger.error(f"Record sale error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def record_purchase(user_id: int, product_name: str, quantity: float, cost_price: float):
    """Record a purchase/restock transaction"""
    conn = None
    try:
        # First get or create product
        product_id = get_or_create_product(user_id, product_name, cost_price)
        
        # Now record the purchase with a new connection
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get current stock before update
        cursor.execute("SELECT stock FROM products WHERE id = ?", (product_id,))
        current_stock = cursor.fetchone()[0] or 0
        
        # Record the purchase
        cursor.execute("""
            INSERT INTO purchases (user_id, product_id, product_name, quantity, cost_price, date)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, product_id, product_name.strip().lower(), quantity, cost_price, datetime.now().isoformat()))
        
        # Update stock (increase)
        cursor.execute("UPDATE products SET stock = stock + ? WHERE id = ?", (quantity, product_id))
        
        conn.commit()
        
        new_stock = current_stock + quantity
        total = quantity * cost_price
        logger.info(f"Purchase recorded: {quantity} x {product_name} @ {cost_price}")
        return {
            "product": product_name,
            "quantity": quantity,
            "cost_price": cost_price,
            "total": total,
            "new_stock": new_stock,
            "is_new_product": current_stock == 0
        }
    except Exception as e:
        logger.error(f"Record purchase error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def create_invoice(user_id: int, customer_name: str, items: list):
    """Create a new invoice"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Generate invoice number
        invoice_number = f"INV-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Calculate total
        total_amount = sum(item["quantity"] * item["price"] for item in items)
        
        # Insert invoice
        cursor.execute("""
            INSERT INTO invoices (user_id, invoice_number, customer_name, total_amount, items, date)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, invoice_number, customer_name, total_amount, json.dumps(items), datetime.now().isoformat()))
        
        # Record each item as a sale (inline to avoid nested connections)
        low_stock_warnings = []
        for item in items:
            product_name = item["name"].strip().lower()
            quantity = float(item["quantity"])
            selling_price = float(item["price"])
            
            # Check if product exists
            cursor.execute("""
                SELECT id, cost_price, stock FROM products 
                WHERE user_id = ? AND LOWER(name) = ?
            """, (user_id, product_name))
            
            product = cursor.fetchone()
            
            if product:
                product_id = product[0]
                cost_price = product[1]
                current_stock = product[2] or 0
            else:
                # Create new product
                cursor.execute("""
                    INSERT INTO products (user_id, name, cost_price, selling_price, stock, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (user_id, product_name, selling_price * 0.7, selling_price, 0, datetime.now().isoformat()))
                product_id = cursor.lastrowid
                cost_price = selling_price * 0.7
                current_stock = 0
            
            # Record sale
            cursor.execute("""
                INSERT INTO sales (user_id, product_id, product_name, quantity, selling_price, cost_price, date)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (user_id, product_id, product_name, quantity, selling_price, cost_price, datetime.now().isoformat()))
            
            # Update stock - never go below 0
            new_stock = max(0, current_stock - quantity)
            cursor.execute("UPDATE products SET stock = ? WHERE id = ?", (new_stock, product_id))
            
            # Check for low stock warning
            if new_stock <= 0:
                low_stock_warnings.append(f"{product_name} (OUT OF STOCK)")
            elif new_stock < 10:
                low_stock_warnings.append(f"{product_name} ({int(new_stock)} left)")
        
        conn.commit()
        
        logger.info(f"Invoice created: {invoice_number} for {customer_name}")
        return {
            "invoice_number": invoice_number,
            "customer_name": customer_name,
            "items": items,
            "total_amount": total_amount,
            "low_stock_warnings": low_stock_warnings if low_stock_warnings else None
        }
    except Exception as e:
        logger.error(f"Create invoice error: {e}")
        if conn:
            conn.rollback()
        raise
    finally:
        if conn:
            conn.close()

def get_daily_summary(user_id: int):
    """Get daily sales summary with analytics"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        today = datetime.now().strftime('%Y-%m-%d')
        
        # Get today's sales
        cursor.execute("""
            SELECT SUM(quantity * selling_price), SUM(quantity * (selling_price - COALESCE(cost_price, 0))),
                   SUM(quantity)
            FROM sales WHERE user_id = ? AND date LIKE ?
        """, (user_id, f"{today}%"))
        
        row = cursor.fetchone()
        total_sales = row[0] or 0
        total_profit = row[1] or 0
        total_items_sold = row[2] or 0
        
        # Get top selling items
        cursor.execute("""
            SELECT product_name, SUM(quantity) as qty, SUM(quantity * selling_price) as revenue
            FROM sales WHERE user_id = ? AND date LIKE ?
            GROUP BY product_name ORDER BY qty DESC LIMIT 5
        """, (user_id, f"{today}%"))
        
        top_items = []
        top_selling_item = None
        for row in cursor.fetchall():
            item = {"name": row[0], "quantity": row[1], "revenue": row[2]}
            top_items.append(item)
            if not top_selling_item:
                top_selling_item = row[0]
        
        # Get low stock items
        cursor.execute("""
            SELECT name, stock FROM products 
            WHERE user_id = ? AND stock < 10 
            ORDER BY stock ASC LIMIT 5
        """, (user_id,))
        
        low_stock_items = [{"name": row[0], "stock": max(0, row[1] or 0)} for row in cursor.fetchall()]
        
        return {
            "total_sales": total_sales,
            "total_profit": total_profit,
            "total_items_sold": total_items_sold,
            "top_selling_item": top_selling_item,
            "top_selling_items": top_items,
            "low_stock_items": low_stock_items,
            "date": today
        }
    except Exception as e:
        logger.error(f"Get summary error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def get_inventory(user_id: int):
    """Get user's inventory"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, name, cost_price, selling_price, stock 
            FROM products WHERE user_id = ? ORDER BY name
        """, (user_id,))
        
        inventory = [{
            "id": row[0],
            "name": row[1],
            "cost_price": row[2],
            "selling_price": row[3],
            "stock": max(0, row[4] or 0)  # Never show negative stock
        } for row in cursor.fetchall()]
        
        return inventory
    except Exception as e:
        logger.error(f"Get inventory error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def get_all_invoices(user_id: int):
    """Get all invoices for a user"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, invoice_number, customer_name, total_amount, items, date
            FROM invoices WHERE user_id = ? ORDER BY date DESC
        """, (user_id,))
        
        invoices = [{
            "id": row[0],
            "invoice_number": row[1],
            "customer_name": row[2],
            "total_amount": row[3],
            "items": row[4],
            "date": row[5]
        } for row in cursor.fetchall()]
        
        return invoices
    except Exception as e:
        logger.error(f"Get invoices error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def suggest_reorder(user_id: int):
    """Suggest items that need reordering"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # First check if user has any products
        cursor.execute("SELECT COUNT(*) FROM products WHERE user_id = ?", (user_id,))
        total_products = cursor.fetchone()[0]
        
        if total_products == 0:
            return {"no_products": True, "items": []}
        
        cursor.execute("""
            SELECT name, stock, cost_price FROM products 
            WHERE user_id = ? AND stock < 10 ORDER BY stock ASC
        """, (user_id,))
        
        items = [{"name": row[0], "stock": max(0, row[1] or 0), "cost_price": row[2]} for row in cursor.fetchall()]
        
        return {"no_products": False, "items": items}
    except Exception as e:
        logger.error(f"Suggest reorder error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def get_low_stock_notifications(user_id: int):
    """Get low stock and out of stock notifications"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get out of stock items
        cursor.execute("""
            SELECT name, stock FROM products 
            WHERE user_id = ? AND stock <= 0 
            ORDER BY name ASC
        """, (user_id,))
        out_of_stock = [{"name": row[0], "stock": 0, "status": "out_of_stock"} for row in cursor.fetchall()]
        
        # Get low stock items (less than 10 but more than 0)
        cursor.execute("""
            SELECT name, stock FROM products 
            WHERE user_id = ? AND stock > 0 AND stock < 10 
            ORDER BY stock ASC
        """, (user_id,))
        low_stock = [{"name": row[0], "stock": max(0, row[1] or 0), "status": "low_stock"} for row in cursor.fetchall()]
        
        return {
            "out_of_stock": out_of_stock,
            "low_stock": low_stock,
            "total_alerts": len(out_of_stock) + len(low_stock)
        }
    except Exception as e:
        logger.error(f"Get low stock notifications error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def recommend_price(user_id: int, product_name: str, target_margin: float = 0.2):
    """Recommend selling price based on cost and target margin"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT cost_price FROM products 
            WHERE user_id = ? AND LOWER(name) LIKE ?
        """, (user_id, f"%{product_name.lower()}%"))
        
        row = cursor.fetchone()
        
        if row:
            cost = row[0]
            recommended = cost * (1 + target_margin)
            return {
                "product": product_name,
                "cost_price": cost,
                "recommended_price": round(recommended, 2),
                "margin": f"{target_margin * 100}%"
            }
        return None
    except Exception as e:
        logger.error(f"Recommend price error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def process_chat_message(message: str, user_id: int):
    """Process a chat message and execute the appropriate action"""
    try:
        # Parse intent using AI or fallback
        intent = parse_intent(message)
        
        intent_type = intent.get("intent", "unknown")
        entities = intent.get("entities", {})
        
        logger.info(f"Parsed intent: {intent_type} with entities: {entities}")
        
        # Handle sale intent
        if intent_type == "record_sale":
            product = entities.get("product", "item")
            quantity = float(entities.get("quantity", 1))
            price = float(entities.get("price", 0))
            
            if price <= 0:
                return {"response": "Please specify the selling price. Example: 'Sold 5 pens at 10 each'"}
            
            result = record_sale(user_id, product, quantity, price)
            response_msg = f"✅ Sale recorded!\n\n📦 Product: {product}\n📊 Quantity: {quantity}\n💰 Price: Rs.{price}/-\n💵 Total: Rs.{result['total']:.2f}/-"
            
            # Add low stock warning if applicable
            if result.get("low_stock_warning"):
                response_msg += f"\n\n{result['low_stock_warning']}"
            
            return {
                "response": response_msg,
                "data": result
            }
        
        # Handle purchase intent
        elif intent_type == "record_purchase":
            product = entities.get("product", "item")
            quantity = float(entities.get("quantity", 1))
            price = float(entities.get("price", 0))
            
            if price <= 0:
                return {"response": "Please specify the cost price. Example: 'Bought 10 notebooks at 25 each'"}
            
            result = record_purchase(user_id, product, quantity, price)
            
            # Build response message
            response_msg = f"✅ Purchase recorded!\n\n📦 Product: {product}\n📊 Quantity: {quantity}\n💰 Cost: Rs.{price}/-\n💵 Total: Rs.{result['total']:.2f}/-\n📈 New Stock: {int(result['new_stock'])} units"
            
            if result.get('is_new_product'):
                response_msg += "\n\n🆕 New product added to inventory!"
            
            return {
                "response": response_msg,
                "data": result
            }
        
        # Handle invoice intent
        elif intent_type == "create_invoice":
            customer = entities.get("customer", "Customer")
            items = entities.get("items", [])
            
            # Handle case where items come as JSON string from AI
            if isinstance(items, str):
                try:
                    items = json.loads(items)
                except:
                    items = []
            
            if not items:
                return {"response": "Please specify items for the invoice. Example: 'Invoice for Ahmed: 5 rice at 80, 2 oil at 150'"}
            
            result = create_invoice(user_id, customer, items)
            response_msg = f"✅ Invoice created!\n\n📄 Invoice #: {result['invoice_number']}\n👤 Customer: {customer}\n💵 Total: Rs.{result['total_amount']:.2f}/-"
            
            # Add low stock warnings if applicable
            if result.get("low_stock_warnings"):
                response_msg += "\n\n⚠️ Low Stock Alert:\n"
                for warning in result["low_stock_warnings"]:
                    response_msg += f"• {warning}\n"
            
            return {
                "response": response_msg,
                "data": result
            }
        
        # Handle inventory intent
        elif intent_type == "show_inventory":
            inventory = get_inventory(user_id)
            if not inventory:
                return {"response": "📦 Your inventory is empty. Start adding products by recording purchases!"}
            
            return {
                "response": f"📦 Your Inventory ({len(inventory)} items)",
                "data": inventory
            }
        
        # Handle summary intent
        elif intent_type == "show_summary":
            summary = get_daily_summary(user_id)
            
            # Check if there are any sales today
            if summary['total_sales'] == 0 and summary['total_items_sold'] == 0:
                # Check if user has any products
                inventory = get_inventory(user_id)
                if not inventory:
                    return {
                        "response": f"📊 Daily Summary ({summary['date']})\n\n" +
                        "📦 No products in inventory yet.\n\n" +
                        "Start by adding products:\n" +
                        "• \"Bought 50 rice at 70\"\n" +
                        "• \"Bought 20 cooking oil at 280\"",
                        "data": summary
                    }
                return {
                    "response": f"📊 Daily Summary ({summary['date']})\n\n" +
                    "📭 No sales recorded today yet.\n\n" +
                    "Record a sale by saying:\n" +
                    "• \"Sold 5 rice at 85\"",
                    "data": summary
                }
            
            response = f"📊 Daily Summary ({summary['date']})\n\n"
            response += f"💰 Total Sales: Rs.{summary['total_sales']:.2f}/-\n"
            response += f"📈 Total Profit: Rs.{summary['total_profit']:.2f}/-\n"
            response += f"🛒 Items Sold: {int(summary['total_items_sold'])}"
            
            if summary['top_selling_item']:
                response += f"\n🏆 Top Seller: {summary['top_selling_item']}"
            
            if summary['low_stock_items']:
                response += f"\n\n⚠️ Low Stock: {len(summary['low_stock_items'])} items need reordering"
            
            return {"response": response, "data": summary}
        
        # Handle reorder suggestion
        elif intent_type == "suggest_reorder":
            result = suggest_reorder(user_id)
            
            # Check if user has no products at all
            if result.get("no_products"):
                return {
                    "response": "📦 Your inventory is empty!\n\n" +
                    "To add products, record a purchase first:\n" +
                    "• \"Bought 50 rice at 70\"\n" +
                    "• \"Bought 20 oil at 280\"\n" +
                    "• \"Bought 100 sugar at 90\"\n\n" +
                    "This will add products to your inventory with stock."
                }
            
            items = result.get("items", [])
            if not items:
                return {"response": "✅ All items are well-stocked! No reordering needed."}
            
            response = "⚠️ Items needing reorder:\n\n"
            for item in items:
                response += f"• {item['name']}: {item['stock']} left\n"
            
            return {"response": response, "data": items}
        
        # Handle price recommendation
        elif intent_type == "recommend_price":
            product = entities.get("product", "")
            if not product:
                return {"response": "Please specify the product name. Example: 'What price for rice?'"}
            
            result = recommend_price(user_id, product)
            if result:
                return {
                    "response": f"💡 Price Recommendation for {product}\n\nCost: Rs.{result['cost_price']}/-\nRecommended: Rs.{result['recommended_price']}/- ({result['margin']} margin)",
                    "data": result
                }
            else:
                return {"response": f"Product '{product}' not found in inventory."}
        
        # Handle greeting
        elif intent_type == "greeting":
            # Check if user has products
            inventory = get_inventory(user_id)
            if not inventory:
                return {
                    "response": "👋 Welcome! I see you're new here.\n\n" +
                    "📦 **Getting Started:**\n\n" +
                    "First, add your products by recording purchases:\n" +
                    "• \"Bought 50 rice at 70\"\n" +
                    "• \"Bought 20 cooking oil at 280\"\n" +
                    "• \"Bought 100 sugar at 90\"\n\n" +
                    "This will add products with stock to your inventory!"
                }
            return {
                "response": "👋 Hello! How can I help you today?\n\nI can help you with:\n• Recording sales and purchases\n• Creating invoices\n• Checking inventory\n• Daily summaries\n• Reorder suggestions"
            }
        
        # Handle help
        elif intent_type == "help":
            return {
                "response": "📚 Here's what I can do:\n\n" +
                "**Sales:** \"Sold 5 rice at 80\"\n" +
                "**Purchases:** \"Bought 10 pens at 20\"\n" +
                "**Invoice:** \"Invoice for Ahmed: 3 rice at 80\"\n" +
                "**Inventory:** \"Show inventory\"\n" +
                "**Summary:** \"Today's summary\"\n" +
                "**Reorder:** \"What to reorder?\"\n" +
                "**Price:** \"What price for rice?\""
            }
        
        # Unknown intent
        else:
            return {
                "response": "🤔 I didn't understand that. Try saying:\n\n" +
                "• \"Sold 5 items at 100\"\n" +
                "• \"Bought 10 pens at 20\"\n" +
                "• \"Show my inventory\"\n" +
                "• \"Today's summary\"\n\n" +
                "Type 'help' for more commands."
            }
            
    except Exception as e:
        logger.error(f"Process chat error: {e}")
        return {"response": f"Sorry, something went wrong. Please try again."}
