import { useState } from 'react';
import { analyzeImage } from '@/lib/gemini';

export const useImageAnalysis = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeXRay = async (file: File) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Convert file to base64
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
      });
      
      reader.readAsDataURL(file);
      
      const base64Image = await base64Promise;
      const result = await analyzeImage(base64Image);
      setAnalysis(result);
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Failed to analyze image. Please try again.');
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analysis,
    isAnalyzing,
    error,
    analyzeXRay
  };
}; 