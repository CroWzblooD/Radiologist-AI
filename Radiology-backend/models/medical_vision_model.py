import torch
import intel_extension_for_pytorch as ipex
from transformers import AutoImageProcessor, AutoModelForImageClassification
from pathlib import Path
import logging
from core.model_manager import IntelModelManager

class MedicalVisionModel:
    def __init__(self):
        self.model_manager = IntelModelManager()
        self.models = {}
        self.processors = {}
        self.load_models()
        
    def load_models(self):
        """Load and optimize different medical imaging models"""
        model_configs = {
            'xray': {
                'model_id': 'microsoft/swin-base-patch4-window7-224-in22k-fine-tuned-chest-xray',
                'precision': 'FP16'
            },
            'ct': {
                'model_id': 'nvidia/med-seg-ct',
                'precision': 'FP16'
            },
            'mri': {
                'model_id': 'microsoft/swin-base-patch4-window7-224-in22k-fine-tuned-brain-mri',
                'precision': 'FP16'
            }
        }
        
        for modality, config in model_configs.items():
            try:
                # Load processor and model
                self.processors[modality] = AutoImageProcessor.from_pretrained(
                    config['model_id']
                )
                
                model = AutoModelForImageClassification.from_pretrained(
                    config['model_id']
                )
                
                # Optimize with Intel extensions
                model = self.model_manager.optimize_torch_model(model)
                
                # Convert to OpenVINO
                ov_model_path = Path(f"models/medical_imaging/{modality}_model")
                if not ov_model_path.exists():
                    self._convert_to_openvino(model, ov_model_path, modality)
                
                # Load and optimize with OpenVINO
                self.models[modality] = self.model_manager.load_and_optimize_model(
                    ov_model_path / "openvino_model.xml",
                    modality,
                    config['precision']
                )
                
            except Exception as e:
                logging.error(f"Error loading {modality} model: {str(e)}")
                raise
    
    def _convert_to_openvino(self, model, save_path, modality):
        """Convert PyTorch model to OpenVINO format"""
        from optimum.intel import OVModelForImageClassification
        
        # Convert to OpenVINO
        ov_model = OVModelForImageClassification.from_pretrained(
            model,
            export=True,
            load_in_8bit=True
        )
        
        # Save the model
        ov_model.save_pretrained(save_path) 