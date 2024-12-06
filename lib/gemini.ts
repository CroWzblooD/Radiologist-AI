import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI;

export const initGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
};

export const getGeminiClient = () => {
  if (!genAI) {
    throw new Error("Gemini client not initialized");
  }
  return genAI;
};

// Function to analyze images
export const analyzeImage = async (base64Image: string): Promise<string> => {
  try {
    // Remove the data URL prefix if present
    const imageData = base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    
    // Convert base64 to Uint8Array
    const binaryData = Buffer.from(imageData, 'base64');
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Create image part
    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: "image/jpeg"
      }
    };

    // Generate content
    const result = await model.generateContent([imagePart]);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image');
  }
};

// Export the Gemini instance for chat functionality
export const chatWithGemini = async (
  prompt: string, 
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error in chat:', error);
    throw error;
  }
};

export { genAI }; 