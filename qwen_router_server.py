"""
Qwen3 14B Router Server for GPU
Flask server for intent classification and PII detection using Qwen2.5-14B-Instruct

Requirements:
    pip install -r requirements_gpu.txt

Usage:
    # Full precision (requires 28GB+ VRAM)
    python qwen3_router_server.py --port 8081 --model Qwen/Qwen2.5-14B-Instruct
    
    # 8-bit quantization (requires 16GB VRAM) - RECOMMENDED
    python qwen3_router_server.py --port 8081 --model Qwen/Qwen2.5-14B-Instruct --quantize 8bit
    
    # 4-bit quantization (requires 10GB VRAM)
    python qwen3_router_server.py --port 8081 --model Qwen/Qwen2.5-14B-Instruct --quantize 4bit
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import re
import os
import torch
from typing import Dict, List, Any, Optional
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Global variables
model = None
tokenizer = None
model_name = None
USE_MOCK = True

def load_qwen3_model(model_path: str, quantization: Optional[str] = None):
    """Load Qwen3 14B model with optional quantization
    
    Args:
        model_path: HuggingFace model path (e.g., 'Qwen/Qwen2.5-14B-Instruct')
        quantization: '4bit', '8bit', or None for full precision
    """
    global model, tokenizer, model_name, USE_MOCK
    
    try:
        from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
        
        logger.info("="*60)
        logger.info(f"🔧 Loading model: {model_path}")
        logger.info(f"⚙️  Quantization: {quantization or 'None (Full Precision)'}")
        logger.info(f"🎮 CUDA Available: {torch.cuda.is_available()}")
        
        if torch.cuda.is_available():
            logger.info(f"🖥️  GPU: {torch.cuda.get_device_name(0)}")
            logger.info(f"💾 VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB")
        else:
            logger.error("❌ No CUDA GPU detected!")
            return False
        
        # Load tokenizer
        logger.info("📚 Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(
            model_path,
            trust_remote_code=True,
            use_fast=True
        )
        logger.info("✓ Tokenizer loaded")
        
        # Configure model loading
        model_kwargs = {
            "device_map": "auto",
            "trust_remote_code": True,
            "torch_dtype": torch.float16,
        }
        
        if quantization == '4bit':
            logger.info("⚡ Using 4-bit quantization (~10GB VRAM)")
            quantization_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_compute_dtype=torch.float16,
                bnb_4bit_use_double_quant=True,
                bnb_4bit_quant_type="nf4"
            )
            model_kwargs["quantization_config"] = quantization_config
        elif quantization == '8bit':
            logger.info("⚡ Using 8-bit quantization (~16GB VRAM)")
            quantization_config = BitsAndBytesConfig(load_in_8bit=True)
            model_kwargs["quantization_config"] = quantization_config
        else:
            logger.info("💪 Using full precision (~28GB+ VRAM)")
        
        # Load model
        logger.info("🚀 Loading model... (this may take 2-5 minutes)")
        model = AutoModelForCausalLM.from_pretrained(model_path, **model_kwargs)
        model.eval()
        
        model_name = model_path
        USE_MOCK = False
        
        logger.info("✓ Model loaded successfully!")
        logger.info(f"📊 Parameters: {sum(p.numel() for p in model.parameters()) / 1e9:.2f}B")
        
        # Test inference
        logger.info("🧪 Running test inference...")
        test_input = "Hello, how are you?"
        inputs = tokenizer(test_input, return_tensors="pt").to(model.device)
        with torch.no_grad():
            outputs = model.generate(**inputs, max_new_tokens=5)
        logger.info("✓ Test inference successful!")
        logger.info("="*60)
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        logger.warning("⚠️  Falling back to MOCK mode")
        USE_MOCK = True
        return False


def classify_intent_mock(user_input: str) -> Dict[str, Any]:
    """
    Mock classification using rules (fallback)
    """
    input_lower = user_input.lower()
    
    # Emergency keywords
    emergency_keywords = [
        "đau ngực", "khó thở", "ho ra máu", "đau đầu dữ dội",
        "liệt", "bất tỉnh", "co giật", "tự tử", "muốn chết",
        "chest pain", "bleeding", "unconscious", "seizure"
    ]
    
    for keyword in emergency_keywords:
        if keyword in input_lower:
            return {
                "intent": "EMERGENCY",
                "confidence": 1.0,
                "action": "EMERGENCY_RESPONSE",
                "safety_flags": ["EMERGENCY_DETECTED"],
                "requires_auth": False
            }
    
    # Personal data query
    personal_indicators = ["của tôi", "lần trước", "xét nghiệm cũ", "đơn thuốc", "my test", "my record"]
    if any(ind in input_lower for ind in personal_indicators):
        return {
            "intent": "PERSONAL_DB_QUERY",
            "confidence": 0.9,
            "action": "SEARCH_DB",
            "db_query_spec": {
                "target_collection": "all",
                "time_frame": "latest"
            },
            "requires_auth": True
        }
    
    # Real-time data analysis
    if re.search(r'\d+/\d+', user_input) or "vừa đo" in input_lower:
        return {
            "intent": "USER_INPUT_ANALYSIS",
            "confidence": 0.85,
            "action": "CALL_GEMINI",
            "requires_auth": False
        }
    
    # Admin/operational
    if any(word in input_lower for word in ["đặt lịch", "giá", "địa chỉ", "booking", "price"]):
        return {
            "intent": "OPERATIONAL_ADMIN",
            "confidence": 0.8,
            "action": "CALL_ADMIN_TOOL",
            "requires_auth": False
        }
    
    # Social/greeting
    if any(word in input_lower for word in ["xin chào", "hello", "cảm ơn", "hi", "thanks"]):
        return {
            "intent": "OUT_OF_SCOPE",
            "confidence": 0.95,
            "action": "REPLY_LOCALLY",
            "local_reply_content": "Chào bạn! Tôi là trợ lý y tế AI. Tôi có thể giúp gì cho bạn?",
            "requires_auth": False
        }
    
    # Default: general medical QA
    return {
        "intent": "GENERAL_MEDICAL_QA",
        "confidence": 0.7,
        "action": "CALL_GEMINI",
        "requires_auth": False
    }


def classify_intent_with_model(user_input: str) -> Dict[str, Any]:
    """
    Qwen3 model inference for intent classification
    Uses Qwen2.5-14B-Instruct with optimized prompt
    """
    try:
        # Build classification prompt
        system_prompt = """You are an intent classifier for a medical chatbot. Analyze the user's question and return ONLY a JSON object with this exact format:
{
  "intent": "EMERGENCY | PERSONAL_DB_QUERY | USER_INPUT_ANALYSIS | GENERAL_MEDICAL_QA | OPERATIONAL_ADMIN | OUT_OF_SCOPE",
  "confidence": 0.95,
  "action": "EMERGENCY_RESPONSE | SEARCH_DB | CALL_GEMINI | CALL_ADMIN_TOOL | REPLY_LOCALLY",
  "requires_auth": false,
  "safety_flags": []
}

Intent definitions:
- EMERGENCY: Life-threatening symptoms (chest pain, severe bleeding, unconscious, stroke, suicide)
- PERSONAL_DB_QUERY: User asks about their past medical records ("my test", "my prescription")
- USER_INPUT_ANALYSIS: User provides current vital signs for analysis (blood pressure, glucose)
- GENERAL_MEDICAL_QA: General medical knowledge questions
- OPERATIONAL_ADMIN: Booking appointments, pricing, hospital info
- OUT_OF_SCOPE: Greetings, small talk, or non-medical topics

Return ONLY valid JSON, no explanations."""

        # Format conversation
        conversation = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Classify: {user_input}"}
        ]
        
        # Apply chat template
        prompt = tokenizer.apply_chat_template(
            conversation,
            tokenize=False,
            add_generation_prompt=True
        )
        
        # Tokenize and move to device
        inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=2048)
        inputs = {k: v.to(model.device) for k, v in inputs.items()}
        
        # Generate with optimized parameters
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=512,
                temperature=0.3,
                top_p=0.8,
                do_sample=True,
                pad_token_id=tokenizer.pad_token_id if tokenizer.pad_token_id else tokenizer.eos_token_id,
                eos_token_id=tokenizer.eos_token_id,
            )
        
        # Decode response
        response_ids = outputs[0][inputs['input_ids'].shape[1]:]
        response = tokenizer.decode(response_ids, skip_special_tokens=True).strip()
        
        logger.debug(f"Model response: {response}")
        
        # Extract JSON from response
        json_match = re.search(r'\{[^}]+\}', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            result = json.loads(json_str)
            logger.info(f"✓ Classified as: {result.get('intent')} (confidence: {result.get('confidence')})")
            return result
        else:
            logger.warning("⚠️  No JSON in model response, using fallback")
            return classify_intent_mock(user_input)
            
    except Exception as e:
        logger.error(f"❌ Model inference error: {e}")
        return classify_intent_mock(user_input)


@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    """OpenAI-compatible endpoint"""
    try:
        data = request.json
        messages = data.get('messages', [])
        
        if not messages:
            return jsonify({"error": "No messages provided"}), 400
        
        user_message = messages[-1].get('content', '')
        
        # Classify intent
        if USE_MOCK:
            result = classify_intent_mock(user_message)
        else:
            result = classify_intent_with_model(user_message)
        
        # Return in OpenAI format
        return jsonify({
            "choices": [{
                "message": {
                    "content": json.dumps(result, ensure_ascii=False)
                }
            }]
        })
    
    except Exception as e:
        logger.error(f"Error in chat_completions: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint with GPU info"""
    gpu_info = {}
    if torch.cuda.is_available():
        gpu_info = {
            "available": True,
            "device_name": torch.cuda.get_device_name(0),
            "total_memory_gb": f"{torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f}",
            "allocated_memory_gb": f"{torch.cuda.memory_allocated(0) / 1024**3:.2f}",
            "cached_memory_gb": f"{torch.cuda.memory_reserved(0) / 1024**3:.2f}"
        }
    else:
        gpu_info = {"available": False, "message": "No GPU detected"}
    
    return jsonify({
        "status": "ok",
        "model": model_name if model_name else "Mock",
        "mode": "mock" if USE_MOCK else "model",
        "gpu": gpu_info
    })


@app.route('/classify', methods=['POST'])
def classify():
    """Direct classification endpoint"""
    try:
        data = request.json
        user_input = data.get('input', '')
        
        if not user_input:
            return jsonify({"error": "No input provided"}), 400
        
        if USE_MOCK:
            result = classify_intent_mock(user_input)
        else:
            result = classify_intent_with_model(user_input)
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in classify: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Qwen3 14B Router Server for GPU')
    parser.add_argument('--port', type=int, default=8081, help='Port to run server')
    parser.add_argument('--host', type=str, default='0.0.0.0', help='Host to bind')
    parser.add_argument('--mock', action='store_true', help='Use mock classification (no GPU)')
    parser.add_argument('--model', type=str, default='Qwen/Qwen2.5-14B-Instruct', 
                        help='Model path from HuggingFace')
    parser.add_argument('--quantize', type=str, choices=['4bit', '8bit'], default='8bit',
                        help='Quantization: 4bit (10GB), 8bit (16GB), or none for full precision')
    args = parser.parse_args()
    
    logger.info("="*60)
    logger.info("🏥 Qwen3 14B Router Server for Medical Chatbot")
    logger.info("="*60)
    
    if args.mock:
        logger.info("🔧 Mode: MOCK (No GPU required)")
        USE_MOCK = True
    else:
        logger.info("🚀 Mode: REAL MODEL (GPU required)")
        logger.info(f"📦 Model: {args.model}")
        logger.info(f"⚙️  Quantization: {args.quantize or 'None (Full Precision)'}")
        
        # Load model
        success = load_qwen3_model(args.model, args.quantize)
        if not success:
            logger.error("❌ Failed to load model, server will run in MOCK mode")
    
    logger.info("="*60)
    logger.info(f"🌐 Server: http://{args.host}:{args.port}")
    logger.info(f"📊 Health: http://{args.host}:{args.port}/health")
    logger.info(f"🤖 Mode: {'MOCK' if USE_MOCK else 'MODEL'}")
    logger.info("="*60)
    
    app.run(host=args.host, port=args.port, debug=False, threaded=True)
