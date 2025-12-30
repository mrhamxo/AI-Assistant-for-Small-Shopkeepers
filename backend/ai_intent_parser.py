"""
AI Intent Parser - Uses Groq API (free) or regex fallback
"""
import re
import json
from config import GROQ_API_KEY
from logger_config import logger

def parse_with_groq(message: str) -> dict:
    """Parse intent using Groq API"""
    try:
        from groq import Groq
        
        client = Groq(api_key=GROQ_API_KEY)
        
        system_prompt = """You are an intent parser for a shopkeeper assistant. 
Extract the intent and entities from the user message.

Available intents:
- record_sale: User sold something (entities: product, quantity, price)
- record_purchase: User bought/restocked something (entities: product, quantity, price)
- create_invoice: Create invoice (entities: customer, items[{name, quantity, price}])
- show_inventory: Show inventory list
- show_summary: Show daily summary
- suggest_reorder: Show items to reorder
- recommend_price: Get price recommendation (entities: product)
- greeting: Hello/hi messages
- help: Help request
- unknown: Cannot understand

Respond ONLY with valid JSON like:
{"intent": "record_sale", "entities": {"product": "rice", "quantity": 5, "price": 80}}

Parse this message:"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            temperature=0.1,
            max_tokens=200
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Extract JSON from response
        json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        
        return {"intent": "unknown", "entities": {}}
        
    except Exception as e:
        logger.warning(f"Groq API error: {e}")
        return None

def parse_with_regex(message: str) -> dict:
    """Fallback regex-based intent parser"""
    message_lower = message.lower().strip()
    
    # Greeting patterns
    if re.match(r'^(hi|hello|hey|good morning|good evening)', message_lower):
        return {"intent": "greeting", "entities": {}}
    
    # Help patterns
    if re.match(r'^(help|what can you do|commands)', message_lower):
        return {"intent": "help", "entities": {}}
    
    # Sale patterns
    sale_patterns = [
        r'sold?\s+(\d+\.?\d*)\s*(?:kg|pieces?|pcs?|units?)?\s*(?:of\s+)?(\w+)\s*(?:at|@|for)\s*(?:rs\.?|₹)?\s*(\d+\.?\d*)',
        r'sold?\s+(\d+\.?\d*)\s+(\w+)\s*(?:at|@|for)\s*(?:rs\.?|₹)?\s*(\d+\.?\d*)',
        r'(\d+\.?\d*)\s*(\w+)\s+sold\s*(?:at|@|for)\s*(?:rs\.?|₹)?\s*(\d+\.?\d*)',
    ]
    
    for pattern in sale_patterns:
        match = re.search(pattern, message_lower)
        if match:
            return {
                "intent": "record_sale",
                "entities": {
                    "quantity": float(match.group(1)),
                    "product": match.group(2),
                    "price": float(match.group(3))
                }
            }
    
    # Purchase patterns
    purchase_patterns = [
        r'(?:bought|purchased?|restocked?|got)\s+(\d+\.?\d*)\s*(?:kg|pieces?|pcs?|units?)?\s*(?:of\s+)?(\w+)\s*(?:at|@|for)\s*(?:rs\.?|₹)?\s*(\d+\.?\d*)',
        r'(?:bought|purchased?)\s+(\d+\.?\d*)\s+(\w+)\s*(?:at|@|for)\s*(?:rs\.?|₹)?\s*(\d+\.?\d*)',
    ]
    
    for pattern in purchase_patterns:
        match = re.search(pattern, message_lower)
        if match:
            return {
                "intent": "record_purchase",
                "entities": {
                    "quantity": float(match.group(1)),
                    "product": match.group(2),
                    "price": float(match.group(3))
                }
            }
    
    # Invoice patterns
    invoice_match = re.search(
        r'invoice\s+(?:for\s+)?(\w+)(?:\s*:\s*|\s+)(.+)',
        message_lower
    )
    if invoice_match:
        customer = invoice_match.group(1)
        items_str = invoice_match.group(2)
        items = []
        
        # Parse items like "5 rice at 80, 2 oil at 150"
        item_pattern = r'(\d+\.?\d*)\s*(?:kg|pcs?)?\s*(\w+)\s*(?:at|@)\s*(?:rs\.?|₹)?\s*(\d+\.?\d*)'
        for item_match in re.finditer(item_pattern, items_str):
            items.append({
                "name": item_match.group(2),
                "quantity": float(item_match.group(1)),
                "price": float(item_match.group(3))
            })
        
        if items:
            return {
                "intent": "create_invoice",
                "entities": {"customer": customer, "items": items}
            }
    
    # Inventory patterns
    if re.search(r'(show|list|view|check|my)\s*(inventory|products?|stock|items)', message_lower):
        return {"intent": "show_inventory", "entities": {}}
    
    # Summary patterns
    if re.search(r'(summary|total|report|sales|today|daily)', message_lower):
        return {"intent": "show_summary", "entities": {}}
    
    # Reorder patterns
    if re.search(r'(reorder|restock|low stock|what.*order|need.*buy)', message_lower):
        return {"intent": "suggest_reorder", "entities": {}}
    
    # Price recommendation patterns
    price_match = re.search(r'(?:what|suggest).*price.*(?:for\s+)?(\w+)', message_lower)
    if price_match:
        return {
            "intent": "recommend_price",
            "entities": {"product": price_match.group(1)}
        }
    
    return {"intent": "unknown", "entities": {}}

def parse_intent(message: str) -> dict:
    """Main intent parsing function"""
    # Try Groq API first if available
    if GROQ_API_KEY:
        result = parse_with_groq(message)
        if result and result.get("intent") != "unknown":
            logger.debug(f"Groq parsed: {result}")
            return result
    
    # Fallback to regex
    result = parse_with_regex(message)
    logger.debug(f"Regex parsed: {result}")
    return result
