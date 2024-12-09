from openvino.runtime import Core, get_available_devices
from openvino.runtime.ie_api import CompiledModel
import intel_extension_for_pytorch as ipex
import torch
from transformers import AutoModel
import logging
from pathlib import Path
from typing import Dict, Optional

class IntelModelManager:
    def __init__(self):
        self.ie = Core()
        self.available_devices = get_available_devices()
        self.device_priorities = ['GPU', 'NPU', 'CPU']
        self.selected_device = self._select_optimal_device()
        self.models: Dict[str, CompiledModel] = {}
        logging.info(f"Using device: {self.selected_device}")
        
    def _select_optimal_device(self) -> str:
        """Select the best available device based on priority"""
        for device in self.device_priorities:
            if device in self.available_devices:
                return device
        return 'CPU'
    
    def optimize_torch_model(self, model: torch.nn.Module) -> torch.nn.Module:
        """Optimize PyTorch model using Intel extensions"""
        model = model.eval()
        if torch.cuda.is_available():
            model = model.to('cuda')
        # Apply Intel PyTorch extensions optimization
        model = ipex.optimize(model)
        return model
    
    def load_and_optimize_model(
        self, 
        model_path: Path, 
        model_type: str,
        precision: str = 'FP16'
    ) -> CompiledModel:
        """Load and optimize model for Intel hardware"""
        try:
            # Read model
            model = self.ie.read_model(model=str(model_path))
            
            # Configure optimization options
            config = self._get_optimization_config(precision)
            
            # Compile model with optimizations
            compiled_model = self.ie.compile_model(
                model=model,
                device_name=self.selected_device,
                config=config
            )
            
            self.models[model_type] = compiled_model
            return compiled_model
            
        except Exception as e:
            logging.error(f"Error optimizing model: {str(e)}")
            raise
    
    def _get_optimization_config(self, precision: str) -> dict:
        """Get hardware-specific optimization configuration"""
        config = {
            "PERFORMANCE_HINT": "LATENCY",
            "INFERENCE_PRECISION_HINT": precision
        }
        
        if self.selected_device == 'GPU':
            config.update({
                "CACHE_DIR": "./cache",
                "GPU_THROUGHPUT_STREAMS": "2"
            })
        elif self.selected_device == 'NPU':
            config.update({
                "VPU_CUSTOM_LAYERS": "YES",
                "VPU_HW_STAGES_OPTIMIZATION": "YES"
            })
            
        return config 