import React, { useState } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';

export const KisanAiAssistantModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste Farmer Brother! I am Kisan AI, powered by Open Agri LLM. How can I assist you today with crop diseases, fertilizer dosage, or Mandi rates?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Yellow spots on Wheat leaves remedy',
    'Best fertilizer for Cotton in black soil',
    'Indore Mandi Soybean rate forecast',
    'PM Kisan Nidhi 17th installment status'
  ];

  const handleSend = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI LLM Response based on prompt keywords
    setTimeout(() => {
      let botAnswer = "Based on our agricultural database and government ICAR guidelines, ";
      const lower = textToSend.toLowerCase();

      if (lower.includes('wheat') || lower.includes('yellow')) {
        botAnswer += "yellow rust or nitrogen deficiency can cause yellowing on wheat. We recommend applying Bio-Shield Tri-Fungicide Gold (2.5 ml/L water) or Urea + Zinc spray. You can order certified Bio-Shield directly from AgriMart Store!";
      } else if (lower.includes('cotton') || lower.includes('fertilizer')) {
        botAnswer += "for Cotton in black cotton soil, apply NPK (12:32:16) along with Bio-Potash during sowing. Maintain proper drainage to prevent root rot.";
      } else if (lower.includes('mandi') || lower.includes('rate') || lower.includes('soybean')) {
        botAnswer += "current Soybean rates in Indore Mandi range from ₹4,650 to ₹4,820/qtl. Our ML price model predicts a 4% rise in 3 weeks as mandi arrival queues stabilize.";
      } else {
        botAnswer += "I have analyzed your query across ICAR advisory records & public Mandi datasets. For best results, use our AI Crop Disease Scanner on the top menu to take a picture of your crop leaf for automated vision classification!";
      }

      const botMsg = {
        sender: 'bot',
        text: botAnswer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"></div>

      <div className="relative w-full max-w-2xl bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] z-10">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-teal-950 via-slate-950 to-emerald-950 border-b border-teal-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-100 text-base">Kisan AI Multi-Lingual Assistant</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1 font-bold">
                  <Sparkles className="w-3 h-3" /> Free LLM Engine
                </span>
              </div>
              <p className="text-xs text-teal-400/80">Ask in Hindi, English, Punjabi or regional languages</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex gap-2 overflow-x-auto text-xs">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:border-teal-500 hover:text-teal-300 hover:bg-teal-950/40 shrink-0 transition-all"
            >
              🌱 {prompt}
            </button>
          ))}
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-amber-600 text-slate-950 font-bold' : 'bg-teal-950 border border-teal-500/40 text-teal-400'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-amber-500/20 border border-amber-500/30 text-amber-100 rounded-tr-none' 
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
              }`}>
                <p>{msg.text}</p>
                <span className="block text-[9px] text-slate-400 mt-2 text-right">{msg.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-950 border border-teal-500/40 text-teal-400 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-teal-400 flex items-center gap-2">
                <span className="animate-pulse">Consulting Kisan LLM Knowledgebase...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your farming query (e.g., How to protect cotton from pink bollworm?)..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
          <button
            onClick={() => handleSend()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-950 transition-all flex items-center gap-2"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
