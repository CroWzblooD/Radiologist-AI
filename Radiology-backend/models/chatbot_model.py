from transformers import AutoTokenizer, AutoModelForCausalLM
from openvino.runtime import Core
import torch
import numpy as np
from pathlib import Path
from config.settings import CHATBOT_MODEL_PATH

class MedicalChatbot:
    def __init__(self):
        self.ie = Core()
        self.model_name = "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext"
        self.load_model()
        
    def load_model(self):
        """Load and optimize chatbot model"""
        try:
            # Load tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            
            # Check if OpenVINO model exists, if not convert and save
            if not (CHATBOT_MODEL_PATH / "openvino_model.xml").exists():
                # Load PyTorch model
                pt_model = AutoModelForCausalLM.from_pretrained(self.model_name)
                
                # Convert to ONNX and then to OpenVINO
                self._convert_to_openvino(pt_model)
            
            # Load OpenVINO model
            self.model = self.ie.read_model(
                model=str(CHATBOT_MODEL_PATH / "openvino_model.xml")
            )
            self.compiled_model = self.ie.compile_model(self.model, "CPU")
            
        except Exception as e:
            raise Exception(f"Failed to load chatbot model: {str(e)}")
    
    def _convert_to_openvino(self, pt_model):
        """Convert PyTorch model to OpenVINO format"""
        import subprocess
        
        # Save PyTorch model temporarily
        temp_path = CHATBOT_MODEL_PATH / "temp"
        pt_model.save_pretrained(temp_path)
        
        # Convert to OpenVINO using optimum-cli
        cmd = f"optimum-cli export openvino \
                --model {temp_path} \
                --task text-generation \
                --fp16 \
                --output {CHATBOT_MODEL_PATH}"
        subprocess.run(cmd, shell=True, check=True)
    
    def generate_response(self, query: str, context: str = "") -> str:
        """Generate medical-context aware responses"""
        try:
            # Prepare input
            input_text = f"Context: {context}\nQuestion: {query}\nAnswer:"
            inputs = self.tokenizer(input_text, return_tensors="pt")
            
            # Generate response
            output_ids = self.compiled_model([inputs["input_ids"].numpy()])[0]
            
            # Decode response
            response = self.tokenizer.decode(output_ids[0], skip_special_tokens=True)
            
            return response.split("Answer:")[-1].strip()
            
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}" 