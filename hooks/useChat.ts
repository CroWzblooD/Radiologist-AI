import { useState } from 'react';
import { chatWithGemini } from '@/lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      
      const userMessage: Message = { role: 'user', content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      const chatHistory = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await chatWithGemini(content, chatHistory);

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response 
      };
      setMessages([...newMessages, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages([...messages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
}; 