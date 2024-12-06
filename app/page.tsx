'use client'

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { BrainCircuit, Microscope, Bot, MessageSquare, FileSearch, ChartBar, Upload, Users, Shield, Activity, Send } from 'lucide-react'
import { useImageAnalysis } from '@/hooks/useImageAnalysis'
import { chatWithGemini } from '@/lib/gemini'

const features = [
  {
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms detect abnormalities with 99% accuracy in medical images.',
    icon: BrainCircuit
  },
  {
    title: 'Real-time Processing',
    description: 'Process X-rays in seconds, not hours. Get instant insights for faster diagnosis.',
    icon: Activity
  },
  {
    title: 'Smart Assistant',
    description: 'AI chatbot trained on medical databases to assist with image interpretation.',
    icon: Bot
  },
  {
    title: 'Secure Platform',
    description: 'HIPAA-compliant platform with end-to-end encryption for patient data protection.',
    icon: Shield
  },
  {
    title: 'Collaboration Tools',
    description: 'Share and discuss cases with colleagues in real-time for better diagnosis.',
    icon: Users
  },
  {
    title: 'Easy Integration',
    description: 'Seamlessly integrates with existing hospital PACS and EMR systems.',
    icon: Upload
  }
]

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: FileSearch },
  { id: 'analysis', label: 'Image Analysis', icon: Microscope },
  { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: ChartBar }
]

const caseStudies = [
  {
    title: 'Early Detection Success',
    hospital: 'Metro General Hospital',
    improvement: '45% faster diagnosis',
    description: 'Detected early-stage lung abnormalities that were initially missed in routine screening.'
  },
  {
    title: 'Rural Healthcare Impact',
    hospital: 'Rural Health Network',
    improvement: '24/7 AI assistance',
    description: 'Provided expert-level analysis in areas with limited access to radiologists.'
  },
  {
    title: 'Emergency Response',
    hospital: 'City Emergency Center',
    improvement: '3min average analysis time',
    description: 'Rapid trauma analysis helping emergency teams make quick decisions.'
  }
]

// Add this new component for tab content
const TabContent = ({ activeTab }: { activeTab: string }) => {
  const [messages, setMessages] = useState<Array<{ type: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      setIsLoading(true);
      const userMessage = { type: 'user', content: input.trim() };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      try {
        const response = await chatWithGemini(userMessage.content, []);
        const botMessage = { type: 'bot', content: response };
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = { 
          type: 'bot', 
          content: 'Sorry, I encountered an error. Please try again.' 
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const { analysis, isAnalyzing, analyzeXRay } = useImageAnalysis();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      analyzeXRay(file);
    }
  };

  switch (activeTab) {
    case 'dashboard':
      return (
        <div className="space-y-8">
          {/* Dashboard Content */}
          <div className="grid grid-cols-4 gap-4">
            {/* Quick Stats */}
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10">
              <h3 className="text-gray-400 text-sm">Total Scans</h3>
              <p className="text-2xl font-bold text-white mt-2">1,234</p>
              <div className="text-cyan-400 text-sm mt-2">↑ 12% this month</div>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10">
              <h3 className="text-gray-400 text-sm">Accuracy Rate</h3>
              <p className="text-2xl font-bold text-white mt-2">99.2%</p>
              <div className="text-cyan-400 text-sm mt-2">↑ 2% improvement</div>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10">
              <h3 className="text-gray-400 text-sm">Processing Time</h3>
              <p className="text-2xl font-bold text-white mt-2">3.2s</p>
              <div className="text-cyan-400 text-sm mt-2"> 0.5s faster</div>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10">
              <h3 className="text-gray-400 text-sm">Active Users</h3>
              <p className="text-2xl font-bold text-white mt-2">156</p>
              <div className="text-cyan-400 text-sm mt-2">↑ 8 new today</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Chest X-Ray Analysis Completed</h3>
                    <p className="text-gray-400 text-sm">3 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10"
              >
                <feature.icon className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case 'analysis':
      return (
        <div className="space-y-8">
          {/* Image Upload Area */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-8 border border-white/10">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <div 
              className="text-center p-12 border-2 border-dashed border-cyan-400/30 rounded-xl hover:border-cyan-400/60 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Upload X-Ray Image</h3>
              <p className="text-gray-300 mb-4">Drag and drop your medical images or click to browse</p>
              <button className="px-6 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors">
                Select Files
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          {isAnalyzing && (
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <span className="ml-3 text-white">Analyzing image...</span>
              </div>
            </div>
          )}

          {analysis && (
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Analysis Results</h2>
              <div className="prose prose-invert">
                <pre className="whitespace-pre-wrap text-gray-300">{analysis}</pre>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10 hover:border-cyan-400/50 transition-colors"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Quick Analysis</h3>
              <p className="text-gray-300 mb-4">Get instant results for common conditions</p>
              <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-center">
                Start Quick Scan
              </div>
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10 hover:border-cyan-400/50 transition-colors"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Deep Analysis</h3>
              <p className="text-gray-300 mb-4">Comprehensive scan for detailed insights</p>
              <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-center">
                Start Deep Scan
              </div>
            </button>
          </div>

          {/* Previous Analyses */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Previous Analyses</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <FileSearch className="w-6 h-6 text-cyan-400" />
                    <div>
                      <h3 className="text-white font-medium">Chest X-Ray Analysis</h3>
                      <p className="text-gray-400 text-sm">Completed on March {10 + i}, 2024</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                    View Results
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

   // In your TabContent component, update the assistant case:
case 'assistant':
  return (
    <div className="space-y-4">
      {/* Chat Header */}
      <div className="backdrop-blur-md bg-white/5 rounded-t-2xl p-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
          {isLoading && (
            <div className="flex items-center gap-2 ml-auto">
              <div className="animate-pulse text-cyan-400">Processing</div>
              <div className="animate-spin h-4 w-4 border-2 border-cyan-400 rounded-full border-t-transparent" />
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-[600px] overflow-y-auto backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-cyan-500/20">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-cyan-400 opacity-50" />
              <p>Start a conversation with your AI assistant</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-cyan-500/20 text-white'
                      : 'bg-purple-500/20 text-gray-100'
                  } backdrop-blur-sm border border-white/10`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything about medical imaging..."
          className="w-full bg-white/5 border border-cyan-500/20 rounded-2xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 backdrop-blur-md"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl 
            ${input.trim() && !isLoading
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
              : 'bg-white/5 text-gray-400'
            } transition-all duration-200`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );

    case 'analytics':
      return (
        <div className="space-y-8">
          {/* Analytics Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10">
              <h3 className="text-gray-400 text-sm">Analysis Accuracy</h3>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-bold text-white">99.2%</span>
                <span className="text-cyan-400 text-sm">↑ 2.1%</span>
              </div>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10">
              <h3 className="text-gray-400 text-sm">Average Processing Time</h3>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-bold text-white">3.2s</span>
                <span className="text-cyan-400 text-sm">↓ 0.5s</span>
              </div>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10">
              <h3 className="text-gray-400 text-sm">Total Analyses</h3>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-bold text-white">1,234</span>
                <span className="text-cyan-400 text-sm">↑ 12%</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Performance Metrics</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">CPU Usage</span>
                  <span className="text-cyan-400">75%</span>
                </div>
                <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Memory Usage</span>
                  <span className="text-cyan-400">60%</span>
                </div>
                <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden">
                  <div className="h-full w-3/5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Storage Usage</span>
                  <span className="text-cyan-400">45%</span>
                </div>
                <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden">
                  <div className="h-full w-2/5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Analytics */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Recent Analytics</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <ChartBar className="w-6 h-6 text-cyan-400" />
                    <div>
                      <h3 className="text-white font-medium">Performance Report</h3>
                      <p className="text-gray-400 text-sm">March {10 + i}, 2024</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ type: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    setIsLoading(true);
    const userMessage = { type: 'user', content: content.trim() };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await chatWithGemini(content);
      const botMessage = { type: 'bot', content: response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        type: 'bot', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Navigation */}
      <nav className="relative backdrop-blur-sm bg-white/10 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
              RadiologyAI
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Case Studies</a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Pricing</a>
            <button className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity">
              Try Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Model */}
      <section className="relative pt-20 pb-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 animate-gradient">
               Radiology with AI
            </h1>
            <p className="text-xl text-cyan-100 mb-12">
              Transform your radiology practice with AI-powered analysis. Get instant insights,
              reduce manual workload, and improve patient outcomes with our advanced platform.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity">
                Start Free Trial
              </button>
              <button className="px-8 py-3 rounded-full border border-cyan-400 text-cyan-400 font-medium hover:bg-cyan-400/10 transition-colors">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-16 flex gap-8">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 sticky top-4 border border-white/10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <TabContent activeTab={activeTab} />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="w-6 h-6 text-cyan-400" />
                <span className="text-lg font-bold text-white">RadiologyAI</span>
              </div>
              <p className="text-gray-400">Empowering radiologists with next-generation AI technology.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            © 2024 RadiologyAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}