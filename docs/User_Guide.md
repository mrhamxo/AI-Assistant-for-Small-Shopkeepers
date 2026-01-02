# ShopKeeperAI - User Guide

## How to Use the AI Chat Assistant

---

**Version:** 2.1.0 | **Date:** January 2026

---

## Getting Started

### Step 1: Create Account
1. Go to signup page
2. Enter name, email, password, shop name
3. Click "Sign Up"

### Step 2: Add Your Products
Type these commands to add your first products:

```
Bought 50 rice at 70
Bought 30 cooking oil at 280
Bought 40 sugar at 90
```

---

## Quick Command Reference

| Action | Command |
|--------|---------|
| **Add Stock** | `Bought 50 rice at 70` |
| **Record Sale** | `Sold 5 rice at 85` |
| **Create Invoice** | `Invoice for Ali: 3 rice at 85` |
| **View Inventory** | `Show inventory` |
| **Daily Report** | `Today's summary` |
| **Low Stock Check** | `What should I reorder?` |
| **Price Advice** | `What price for rice?` |

---

## 1. Recording Purchases (Adding Stock)

Use this to add new products or restock existing items.

**Format:** `Bought [quantity] [product] at [price]`

**Examples:**
| Command | Result |
|---------|--------|
| `Bought 50 rice at 70` | Adds 50 rice at Rs.70 cost |
| `Bought 20 cooking oil at 280` | Adds 20 cooking oil |
| `Bought 30 face cream at 180` | Adds 30 face cream |

**Response:**
```
✅ Purchase recorded!
📦 Product: rice
📊 Quantity: 50
💰 Cost: Rs.70/-
💵 Total: Rs.3500/-
📈 New Stock: 50 units
🆕 New product added to inventory!
```

---

## 2. Recording Sales

Record sales when customers buy products.

**Format:** `Sold [quantity] [product] at [price]`

**Examples:**
| Command | Result |
|---------|--------|
| `Sold 5 rice at 85` | Records 5 rice sold at Rs.85 |
| `Sold 2 cooking oil at 320` | Records sale, updates stock |

**Response:**
```
✅ Sale recorded!
📦 Product: rice
📊 Quantity: 5
💰 Price: Rs.85/-
💵 Total: Rs.425.00/-

⚠️ LOW STOCK: Only 8 units remaining!
```

---

## 3. Creating Invoices

Generate invoices with multiple items.

**Format:** `Invoice for [customer]: [qty] [product] at [price], [qty] [product] at [price]`

**Example:**
```
Invoice for Ahmed: 5 rice at 85, 2 oil at 320
```

**Response:**
```
✅ Invoice created!
📄 Invoice #: INV-20260102153045
👤 Customer: Ahmed
💵 Total: Rs.1065.00/-
```

---

## 4. Checking Inventory

**Commands:**
- `Show inventory`
- `My products`
- `Check stock`

Shows all products with stock levels and prices.

---

## 5. Daily Summary

**Commands:**
- `Today's summary`
- `Daily report`
- `Sales report`

**Response:**
```
📊 Daily Summary (2026-01-02)

💰 Total Sales: Rs.2,450.00/-
📈 Total Profit: Rs.485.00/-
🛒 Items Sold: 28
🏆 Top Seller: rice
```

---

## 6. Reorder Suggestions

**Commands:**
- `What should I reorder?`
- `Low stock items`

**Response (if low stock):**
```
⚠️ Items needing reorder:
• rice: 5 left
• cooking oil: 3 left
• sugar: 0 left
```

**Response (if well-stocked):**
```
✅ All items are well-stocked! No reordering needed.
```

---

## 7. Price Recommendations

**Command:** `What price for rice?`

**Response:**
```
💡 Price Recommendation for rice
Cost: Rs.70/-
Recommended: Rs.84/- (20% margin)
```

---

## Tips for Best Results

1. **Always include prices:**
   - ✅ `Sold 5 rice at 85`
   - ❌ `Sold 5 rice`

2. **Multi-word products work:**
   - ✅ `Bought 20 cooking oil at 280`

3. **Invoice format:**
   - Use colon after customer name
   - Separate items with commas

4. **Check stock daily:**
   - `What should I reorder?`

---

## Sample Daily Workflow

### Morning
```
Hello
What should I reorder?
```

### During Business
```
Sold 5 rice at 85
Sold 2 cooking oil at 320
Invoice for Ali: 3 rice at 85
```

### End of Day
```
Today's summary
```

### Restocking
```
Bought 50 rice at 70
Bought 20 cooking oil at 280
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "I don't understand" | Check command format, include price |
| Empty inventory | Add products: `Bought 50 rice at 70` |
| Product not found | Create it first with a purchase |

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Shopkeeper | demo@shopkeeper.com | demo123 |
| Admin | admin@shopkeeper.com | admin123 |

---

## Live Demo

- **Website:** https://ai-assistant-for-small-shopkeepers.vercel.app
- **API Docs:** https://shopkeeperai-backend-tnfddrjd.deployra.app/docs

---

*ShopKeeperAI - Your Intelligent Shop Assistant*

*© 2026 - All Rights Reserved*

