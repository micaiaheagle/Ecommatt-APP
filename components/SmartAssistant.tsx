import React, { useState, useRef } from 'react';
import { Camera, Send, MessageSquare, Scale, Loader2, Image as ImageIcon } from 'lucide-react';
import { analyzePigImage, getFarmingAdvice } from '../services/geminiService';

const SmartAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Vision' | 'Chat'>('Vision');
  
  // Vision State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat State
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Hello Farm Manager. I am your Ecomatt Agronomist Assistant. Ask me anything about pig health, feed formulation, or breeding schedules.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Vision Handlers
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        // Remove data URL prefix for API
        const base64Data = base64String.split(',')[1];
        performAnalysis(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const performAnalysis = async (base64Data: string) => {
    setAnalyzing(true);
    setAnalysisResult('');
    const result = await analyzePigImage(base64Data);
    setAnalysisResult(result);
    setAnalyzing(false);
  };

  // Chat Handlers
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const newMessages = [...messages, { role: 'user' as const, content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');
    setChatLoading(true);

    const advice = await getFarmingAdvice(inputMessage, "Farm Location: Zimbabwe. Current Season: Warm/Wet. Herd Size: 145.");
    
    setMessages([...newMessages, { role: 'ai', content: advice }]);
    setChatLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Feature Toggles */}
      <div className="flex gap-4 mb-6 justify-center">
        <button 
          onClick={() => setActiveTab('Vision')}
          className={`flex-1 max-w-xs flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
            ${activeTab === 'Vision' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 bg-white text-gray-500 hover:border-brand-200'}
          `}
        >
          <Scale size={24} />
          <span className="font-semibold">Visual Weight & BCS</span>
        </button>
        <button 
          onClick={() => setActiveTab('Chat')}
          className={`flex-1 max-w-xs flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
            ${activeTab === 'Chat' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 bg-white text-gray-500 hover:border-brand-200'}
          `}
        >
          <MessageSquare size={24} />
          <span className="font-semibold">Agronomist Chat</span>
        </button>
      </div>

      {/* Vision Interface */}
      {activeTab === 'Vision' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">AI Weight Estimation</h3>
            <p className="text-sm text-gray-500 mb-6">Upload a clear photo of a pig. For best results, ensure the entire pig is visible from the side.</p>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative"
            >
              {selectedImage ? (
                <img src={selectedImage} alt="Analysis Target" className="h-full w-full object-contain rounded-lg" />
              ) : (
                <>
                  <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                    <Camera size={32} className="text-brand-500" />
                  </div>
                  <p className="font-medium text-gray-600">Tap to take photo or upload</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload}
              />
            </div>

            {analyzing && (
              <div className="mt-6 flex items-center gap-3 text-brand-600 bg-brand-50 p-4 rounded-lg animate-pulse">
                <Loader2 size={20} className="animate-spin" />
                <span className="font-medium">Analyzing biometrics with Gemini Vision...</span>
              </div>
            )}

            {!analyzing && analysisResult && (
              <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Activity size={18} className="text-brand-600" /> Analysis Report
                </h4>
                <div className="prose prose-sm text-gray-700 whitespace-pre-line">
                  {analysisResult}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {activeTab === 'Chat' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[80%] p-4 rounded-2xl text-sm
                  ${msg.role === 'user' ? 'bg-brand-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}
                `}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Ask about feed, diseases, or market prices..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage}
              disabled={chatLoading || !inputMessage.trim()}
              className="bg-brand-600 text-white p-2 rounded-full hover:bg-brand-700 disabled:bg-gray-300 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icon for result display
function Activity({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  );
}

export default SmartAssistant;