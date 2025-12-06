
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Send, MessageSquare, Scale, Loader2, Image as ImageIcon, Mic, Globe, Signal, TrendingUp, AlertTriangle } from 'lucide-react';
import { analyzePigImage, getFarmingAdvice } from '../services/geminiService';
import { User, NotificationConfig } from '../types';

// Mock Web Speech API
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface SmartAssistantProps {
  user?: User;
  onUpdateUser?: (user: User) => void;
  config?: NotificationConfig;
  onUpdateConfig?: (config: NotificationConfig) => void;
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ user, onUpdateUser, config, onUpdateConfig }) => {
  const [activeTab, setActiveTab] = useState<'Chat' | 'Markets' | 'Settings'>('Chat');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const key = localStorage.getItem('ECO_GEMINI_API_KEY');
    if (key) setApiKey(key);
  }, []);

  const handleSaveKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('ECO_GEMINI_API_KEY', newKey);
  };

  // Chat/Vision Unified State
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, type?: 'text' | 'image-result' }[]>([
    { role: 'ai', content: user?.language === 'Shona' ? 'Mhoroi Manager. Ndingakubatsirai nei nhasi? (Chitsano AI)' : user?.language === 'Ndebele' ? 'Salibonani Manager. Ngingalisiza ngani namuhla? (Chitsano AI)' : 'Hello. I am Chitsano AI. Ask me questions or upload a photo for diagnosis.', type: 'text' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Markets State (Mock)
  const [marketPrices] = useState([
    { commodity: 'Maize (White)', unit: 'Ton', price: 320, trend: 'up' },
    { commodity: 'Soya Beans', unit: 'Ton', price: 580, trend: 'down' },
    { commodity: 'Wheat', unit: 'Ton', price: 410, trend: 'stable' },
    { commodity: 'Porkers', unit: 'Kg', price: 3.50, trend: 'up' },
    { commodity: 'Broilers', unit: 'Kg', price: 2.10, trend: 'stable' },
  ]);

  // Voice Handler
  const handleVoiceInput = () => {
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = user?.language === 'Shona' ? 'sn-ZW' : 'en-US';
    recognition.continuous = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  // Image Upload Handler
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];

        // Add user message indicating upload
        const newMessages = [...messages, { role: 'user' as const, content: '📸 Analyzing Image...' }];
        setMessages(newMessages);
        setLoading(true);
        setLoadingText('Chitsano Vision is analyzing...');

        performAnalysis(base64Data, newMessages);
      };
      reader.readAsDataURL(file);
    }
    // Reset inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const performAnalysis = async (base64Data: string, currentMessages: typeof messages) => {
    try {
      // We assume the service handles analysis. 
      // For Demo: Use the analyzePigImage service
      const result = await analyzePigImage(base64Data);

      setMessages([...currentMessages, { role: 'ai', content: result, type: 'image-result' }]);
    } catch (error) {
      setMessages([...currentMessages, { role: 'ai', content: 'Sorry, I failed to analyze the image.', type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  // Text Message Handler
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);
    setLoadingText('Chitsano is thinking...');

    try {
      const advice = await getFarmingAdvice(inputMessage, `Farm Location: Zimbabwe. Language: ${user?.language || 'English'}`);
      setMessages([...newMessages, { role: 'ai', content: advice }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'ai', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">

      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chitsano<span className="text-ecomattGreen">AI</span></h2>
          <p className="text-xs text-gray-500">Unified Intelligent Core</p>
        </div>

        {/* Concise Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <TabButton active={activeTab === 'Chat'} onClick={() => setActiveTab('Chat')} icon={MessageSquare} label="Chat" />
          <TabButton active={activeTab === 'Markets'} onClick={() => setActiveTab('Markets')} icon={TrendingUp} label="Markets" />
          <TabButton active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} icon={Globe} label="Settings" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col">

        {/* Chat Interface (Unified) */}
        {activeTab === 'Chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 bg-ecomattGreen rounded-full flex items-center justify-center mr-2 text-white text-xs font-bold shrink-0 mt-1">AI</div>
                  )}
                  <div className={`
                    max-w-[85%] p-4 rounded-2xl text-sm shadow-sm whitespace-pre-line
                    ${msg.role === 'user' ? 'bg-gray-900 text-white rounded-br-none' : 'bg-gray-50 text-gray-800 rounded-bl-none border border-gray-100'}
                    ${msg.type === 'image-result' ? 'border-l-4 border-l-ecomattGreen' : ''}
                   `}>
                    {msg.type === 'image-result' && <div className="text-xs font-bold text-ecomattGreen mb-1 flex items-center gap-1"><Camera size={12} /> Visual Analysis</div>}
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 bg-ecomattGreen rounded-full flex items-center justify-center mr-2 text-white text-xs font-bold shrink-0">AI</div>
                  <div className="bg-gray-50 p-4 rounded-2xl rounded-bl-none flex items-center gap-3 border border-gray-100">
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">{loadingText}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-4 border-t border-gray-100 bg-gray-50/50 flex gap-2 items-center">

              <button
                onClick={handleVoiceInput}
                className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                title="Voice Input"
              >
                <Mic size={20} />
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors"
                title="Upload Photo for Analysis"
              >
                <Camera size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />

              <input
                type="text"
                className="flex-1 border border-gray-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ecomattGreen bg-white shadow-sm text-sm"
                placeholder={isListening ? "Listening..." : "Ask Chitsano..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />

              <button
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
                className="bg-ecomattGreen text-white p-3 rounded-full hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </>
        )}

        {/* Markets Interface */}
        {activeTab === 'Markets' && (
          <div className="p-6 overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Market Pulse</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="p-3 rounded-l-lg">Commodity</th>
                    <th className="p-3">Unit</th>
                    <th className="p-3">Avg Price (USD)</th>
                    <th className="p-3 rounded-r-lg">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {marketPrices.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-bold text-gray-800">{item.commodity}</td>
                      <td className="p-3 text-sm text-gray-500">{item.unit}</td>
                      <td className="p-3 font-mono font-bold text-ecomattGreen">${item.price.toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 w-fit ${item.trend === 'up' ? 'bg-green-100 text-green-700' : item.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                          <i className={`fas fa-arrow-${item.trend === 'up' ? 'up' : item.trend === 'down' ? 'down' : 'right'}`}></i>
                          {item.trend.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Interface */}
        {activeTab === 'Settings' && (
          <div className="p-6 space-y-6 overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900">System Configuration</h3>

            {/* API Key Configuration */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="block text-sm font-bold text-gray-700 mb-2">Google Gemini API Key</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={handleSaveKey}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ecomattGreen outline-none"
                  placeholder="Enter your API Key to activate Chitsano AI"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Required for AI features. Get one at <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-600 hover:underline">Google AI Studio</a>.</p>
            </div>

            <h3 className="text-lg font-bold text-gray-900 pt-4 border-t border-gray-100">Localization Settings</h3>

            {/* Language */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">App Language</label>
              <div className="grid grid-cols-3 gap-3">
                {['English', 'Shona', 'Ndebele'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => onUpdateUser && user && onUpdateUser({ ...user, language: lang as any })}
                    className={`p-3 rounded-xl border-2 font-bold text-sm transition-all ${user?.language === lang ? 'border-ecomattGreen bg-green-50 text-green-800' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* SMS */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <p className="font-bold text-gray-900">SMS Fallback</p>
                <p className="text-xs text-gray-500">Receive alerts when offline.</p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-success"
                checked={config?.smsFallback || false}
                onChange={(e) => onUpdateConfig && config && onUpdateConfig({ ...config, smsFallback: e.target.checked })}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
              <strong>Chitsano AI Note:</strong> Voice features experimental in Shona/Ndebele.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Tab Button Component
const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${active ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:bg-gray-200/50'}`}
  >
    <Icon size={14} />
    {label}
  </button>
);

export default SmartAssistant;