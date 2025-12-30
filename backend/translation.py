"""
Translation module - English to Urdu using Groq API or Helsinki-NLP model
"""
from logger_config import logger
from config import GROQ_API_KEY

# Global translator instance
_translator = None
_model_loaded = False
_groq_client = None

def get_groq_client():
    """Get or create Groq client"""
    global _groq_client
    if _groq_client is None and GROQ_API_KEY:
        try:
            from groq import Groq
            _groq_client = Groq(api_key=GROQ_API_KEY)
            logger.info("Groq client initialized for translation")
        except Exception as e:
            logger.error(f"Failed to initialize Groq client: {e}")
    return _groq_client

def translate_with_groq(text: str) -> str:
    """Translate using Groq API"""
    client = get_groq_client()
    if not client:
        return None
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "You are a translator. Translate the following English text to Urdu. Only provide the Urdu translation, nothing else. Use proper Urdu script."
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            temperature=0.3,
            max_tokens=1024
        )
        translated = response.choices[0].message.content.strip()
        logger.info(f"Groq translated: {text[:30]}... -> {translated[:30]}...")
        return translated
    except Exception as e:
        logger.error(f"Groq translation error: {e}")
        return None

def load_translator():
    """Load the Helsinki-NLP translation model lazily"""
    global _translator, _model_loaded
    
    if _model_loaded:
        return _translator
    
    try:
        from transformers import pipeline
        logger.info("Loading Helsinki-NLP translation model...")
        _translator = pipeline("translation", model="Helsinki-NLP/opus-mt-en-ur")
        _model_loaded = True
        logger.info("Translation model loaded successfully")
        return _translator
    except Exception as e:
        logger.error(f"Failed to load translation model: {e}")
        _model_loaded = True  # Don't retry
        return None

def translate_to_urdu(text: str) -> str:
    """Translate English text to Urdu - uses Groq API first, then Helsinki-NLP as fallback"""
    try:
        # Try Groq API first (faster and more reliable)
        groq_result = translate_with_groq(text)
        if groq_result:
            return groq_result
        
        # Fallback to Helsinki-NLP model
        translator = load_translator()
        
        if translator is None:
            # Last fallback: return original text with note
            return f"[ترجمہ دستیاب نہیں] {text}"
        
        result = translator(text, max_length=512)
        translated = result[0]["translation_text"]
        logger.info(f"Helsinki translated: {text[:30]}... -> {translated[:30]}...")
        return translated
        
    except Exception as e:
        logger.error(f"Translation error: {e}")
        return f"[ترجمہ میں خرابی] {text}"
