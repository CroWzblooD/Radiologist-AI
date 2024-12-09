from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from typing import List
import tempfile
from pathlib import Path

from core.image_processor import ImageProcessor
from core.security import SecurityManager
from models.chatbot_model import MedicalChatbot

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
image_processor = ImageProcessor()
chatbot = MedicalChatbot()

@router.post("/analyze/image")
async def analyze_medical_image(
    file: UploadFile = File(...),
    modality: str = "xray",
    token: str = Depends(oauth2_scheme)
):
    """Analyze uploaded medical images"""
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            contents = await file.read()
            temp_file.write(contents)
            temp_path = temp_file.name
        
        # Process image
        results = image_processor.analyze_image(temp_path, modality)
        
        # Cleanup
        Path(temp_path).unlink()
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/medical")
async def chat_with_ai(
    query: str,
    context: str = "",
    token: str = Depends(oauth2_scheme)
):
    """Interact with medical chatbot"""
    try:
        response = chatbot.generate_response(query, context)
        return {"response": response}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 