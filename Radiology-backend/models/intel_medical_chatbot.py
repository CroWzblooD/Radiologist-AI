from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import intel_extension_for_pytorch as ipex
from optimum.intel import OVModelForCausalLM
from core.model_manager import IntelModelManager
import logging

class IntelMedicalChatbot:
    def __init__(self):
        self.model_manager = IntelModelManager()
        self.model_name = "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext"
        self.load_model()
        
    def load_model(self):
        """Load and optimize chatbot model with Intel optimizations"""
        try:
            # Load tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            
            # Load base model
            base_model = AutoModelForCausalLM.from_pretrained(self.model_name)
            
            # Optimize with Intel PyTorch extensions
            base_model = self.model_manager.optimize_torch_model(base_model)
            
            # Convert to OpenVINO
            ov_model = OVModelForCausalLM.from_pretrained(
                base_model,
                export=True,
                load_in_8bit=True
            )
            
            # Compile and optimize for target hardware
            self.model = self.model_manager.load_and_optimize_model(
                ov_model.model_path,
                "chatbot",
                "INT8"
            )
            
        except Exception as e:
            logging.error(f"Failed to load chatbot model: {str(e)}")
            raise
            
    def generate_response(self, query: str, context: str = "", max_length: int = 512):
        """Generate optimized responses using Intel hardware"""
        try:
            # Prepare input
            input_text = f"Context: {context}\nQuestion: {query}\nAnswer:"
            inputs = self.tokenizer(
                input_text,
                return_tensors="pt",
                padding=True,
                truncation=True
            )
            
            # Generate response using optimized model
            with torch.inference_mode():
                output_ids = self.model([inputs["input_ids"].numpy()])[0]
                
            # Decode response
            response = self.tokenizer.decode(
                output_ids[0],
                skip_special_tokens=True,
                max_length=max_length
            )
            
            return response.split("Answer:")[-1].strip()
            
        except Exception as e:
            logging.error(f"Error generating response: {str(e)}")
            return f"I apologize, but I encountered an error: {str(e)}" 