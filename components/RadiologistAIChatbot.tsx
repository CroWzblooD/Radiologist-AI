import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, Bot, User, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { genAI } from '@/lib/gemini';

interface Message {
  type: 'user' | 'bot';
  content: string;
  suggestions?: string[];
}

interface MessageBubbleProps {
  message: Message;
}

interface SuggestionButtonProps {
  suggestion: string;
  onClick: () => void;
}

const SYSTEM_PROMPT = `You are VishwaVyapaar's AI Trade Assistant, an expert in international business expansion and trade.

RESPONSE FORMATTING RULES:
1. Always structure responses with clear sections using markdown:
   • Main headings: Use ## for primary sections
   • Subheadings: Use ### for subsections
   • Use bullet points (•) for lists
   • Use numbered lists (1.) for steps or sequences
   • Use bold (**text**) for key terms
   • Use tables for comparative data

2. Every response must include:
   • A brief introduction (1-2 lines)
   • Clearly structured main content
   • A concise conclusion or next steps
   • 2-3 relevant follow-up questions

EXAMPLE STRUCTURE:
## [Topic Name]
Brief introduction...

### Key Points
• Point 1
• Point 2
• Point 3

### Detailed Breakdown
1. First step...
2. Second step...

### Next Steps
• Recommendation 1
• Recommendation 2

💡 Follow-up Questions:
• Question 1?
• Question 2?

EXPERTISE AREAS:
1. Market Entry & Expansion
   • Entry strategies
   • Market analysis
   • Risk assessment
   • Partner selection

2. Trade Operations
   • Export/Import procedures
   • Supply chain optimization
   • Logistics management
   • Documentation

3. Compliance & Regulations
   • Trade compliance
   • Legal requirements
   • Standards & certifications
   • Risk management

4. Financial Aspects
   • Trade finance
   • Currency management
   • Payment terms
   • Risk mitigation

5. Cultural & Business Practices
   • Business etiquette
   • Negotiation styles
   • Communication protocols
   • Relationship building

For off-topic queries: Politely redirect with a business-focused alternative suggestion.`;

const QuickActionChip: React.FC<{text: string; onClick: () => void}> = ({text, onClick}) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 
    transition-colors text-sm font-medium flex items-center gap-2"
  >
    {text}
    <ArrowRight className="w-4 h-4" />
  </button>
);

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => (
  <div className={`w-full ${
    message.type === 'user' 
      ? 'bg-blue-600 text-white rounded-t-2xl rounded-bl-2xl rounded-br-lg' 
      : 'bg-white shadow-md rounded-t-2xl rounded-br-2xl rounded-bl-lg'
  } p-6`}>
    <div className={`prose prose-sm max-w-none ${
      message.type === 'user' ? 'text-white' : 'text-gray-800'
    }`}>
      {message.type === 'bot' ? (
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3 text-blue-600" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />,
            ul: ({node, ...props}) => <ul className="my-3 space-y-2" {...props} />,
            li: ({node, ...props}) => (
              <li className="flex items-start gap-2" {...props}>
                <span className="text-blue-500 mt-1">•</span>
                <span>{props.children}</span>
              </li>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      ) : (
        message.content
      )}
    </div>
  </div>
);

const SuggestionButton: React.FC<SuggestionButtonProps> = ({ suggestion, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-2 px-4 py-2 
      bg-white/95 
      text-sm text-blue-600
      border border-blue-100
      hover:bg-blue-50
      hover:border-blue-200
      rounded-full
      transition-colors
      shadow-sm"
  >
    <span>{suggestion}</span>
    <ArrowRight className="w-3 h-3 text-blue-400" />
  </button>
);

const RadiologistAIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    type: 'bot',
    content: `# Welcome to AI Radiology Assistant

I specialize in medical imaging interpretation and can help you with:

## Key Areas
• Imaging protocol selection
• Scan interpretation guidelines
• Radiation safety considerations
• Diagnostic recommendations

How can I assist with your medical imaging needs today?`,
    suggestions: [
      'What imaging is best for suspected fractures?',
      'Explain CT scan radiation risks',
      'Compare MRI vs CT advantages',
      'Review chest X-ray protocols'
    ]
  }]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateRadiologySuggestions = (content: string): string[] => {
    return [
      'Detailed imaging findings',
      'Recommended follow-up',
      'Alternative imaging options',
      'Clinical correlation'
    ];
  };

  const isRadiologyRelated = (text: string): boolean => {
    const radiologyKeywords = [
      'x-ray', 'ct', 'mri', 'ultrasound', 'imaging',
      'radiograph', 'contrast', 'scan', 'radiation',
      'radiology', 'diagnostic', 'image', 'finding',
      'protocol', 'interpretation', 'report'
    ];
    
    return radiologyKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const handleSuggestionClick = (suggestion: string): void => {
    handleSend(suggestion);
  };

  const handleSend = async (text: string = input): Promise<void> => {
    if (!text.trim()) return;

    const userMessage: Message = { type: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!isRadiologyRelated(text)) {
        const offTopicResponse: Message = {
          type: 'bot',
          content: "I specialize in radiology and medical imaging. Please ask me about image interpretation, protocols, or radiation safety. How can I assist with your medical imaging needs?",
          suggestions: [
            'X-ray interpretation',
            'CT protocols',
            'MRI guidelines',
            'Radiation safety'
          ]
        };
        setMessages(prev => [...prev, offTopicResponse]);
        setIsLoading(false);
        return;
      }

      const response = await genAI.chatWithGemini(text, []);
      const formattedResponse = response.text();

      const botResponse: Message = {
        type: 'bot',
        content: formattedResponse,
        suggestions: generateRadiologySuggestions(formattedResponse)
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorResponse: Message = {
        type: 'bot',
        content: "I apologize, but I'm having trouble processing your request. Please try rephrasing your question about medical imaging.",
        suggestions: [
          'Basic image interpretation',
          'Imaging protocols',
          'Safety guidelines'
        ]
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50">
            <Bot className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Radiology Assistant</h2>
            <p className="text-sm text-gray-600">Expert medical imaging consultation</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex flex-col max-w-[80%] space-y-3">
              <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-white border-2 border-blue-100'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <MessageBubble message={message} />
              </div>

              {message.suggestions && (
                <div className="flex flex-wrap gap-2 ml-11">
                  {message.suggestions.map((suggestion, i) => (
                    <SuggestionButton 
                      key={i}
                      suggestion={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Loader className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about medical imaging interpretation..."
            className="flex-1 px-4 py-3 rounded-xl
              bg-gray-50 border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-blue-200
              placeholder:text-gray-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl
              bg-blue-600 hover:bg-blue-700
              text-white disabled:opacity-50
              transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RadiologistAIChatbot; 