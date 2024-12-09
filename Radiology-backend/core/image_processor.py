import cv2
import numpy as np
from openvino.runtime import Core
from pathlib import Path
import logging

class ImageProcessor:
    def __init__(self):
        self.ie = Core()
        self.load_models()
        
    def load_models(self):
        """Load OpenVINO models for different imaging modalities"""
        try:
            model_path = Path("models/medical_imaging")
            self.xray_model = self.ie.read_model(
                model=str(model_path / "xray_model.xml"),
                weights=str(model_path / "xray_model.bin")
            )
            self.ct_model = self.ie.read_model(
                model=str(model_path / "ct_model.xml"),
                weights=str(model_path / "ct_model.bin")
            )
            
            # Compile models for optimal performance
            self.xray_compiled = self.ie.compile_model(
                model=self.xray_model, device_name="CPU"
            )
            self.ct_compiled = self.ie.compile_model(
                model=self.ct_model, device_name="CPU"
            )
            
        except Exception as e:
            logging.error(f"Error loading models: {str(e)}")
            raise
    
    def preprocess_image(self, image_path, modality):
        """Preprocess medical images based on modality"""
        try:
            image = cv2.imread(str(image_path))
            if image is None:
                raise ValueError("Failed to load image")
                
            # Standard preprocessing
            image = cv2.resize(image, (224, 224))
            image = image.astype(np.float32) / 255.0
            
            if modality == "xray":
                # X-ray specific preprocessing
                image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                image = np.expand_dims(image, axis=2)
            
            return np.transpose(image, (2, 0, 1))
            
        except Exception as e:
            logging.error(f"Error preprocessing image: {str(e)}")
            raise

    def analyze_image(self, image_path, modality):
        """Analyze medical images using appropriate AI models"""
        try:
            # Preprocess image
            processed_image = self.preprocess_image(image_path, modality)
            
            # Select appropriate model
            model = self.xray_compiled if modality == "xray" else self.ct_compiled
            
            # Run inference
            results = model([processed_image])[0]
            
            # Post-process results
            findings = self.post_process_results(results, modality)
            
            return {
                "status": "success",
                "findings": findings,
                "confidence_score": float(np.max(results)),
                "modality": modality
            }
            
        except Exception as e:
            logging.error(f"Error analyzing image: {str(e)}")
            return {
                "status": "error",
                "message": str(e)
            }

    def post_process_results(self, results, modality):
        """Post-process model outputs based on modality"""
        if modality == "xray":
            # X-ray specific post-processing
            return self.process_xray_results(results)
        else:
            # CT scan specific post-processing
            return self.process_ct_results(results) 