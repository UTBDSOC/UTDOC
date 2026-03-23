"use client";

import React, { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  role: 'executive' | 'oracle';
  content: string;
  isTyping?: boolean;
};

export default function Terminal() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'oracle',
      content: 'System Initialized. UPLINK secured to UTSBDSOC servers. Awaiting executive directive...',
      isTyping: false,
    }
  ]);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleExecute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'executive', content: input };
    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    // Simulate Network Latency
    setTimeout(() => {
      const oracleMsgId = (Date.now() + 1).toString();
      
      // Contextual mock responses based on the event theme
      let responseText = "Directive received. Analyzing cultural parameters and logistical constraints...";
      if (userMsg.content.toLowerCase().includes('sponsor')) {
        responseText = "Drafting sponsorship tiers. Recommendation: Target local Lakemba businesses with the 'Golden Bengal' package ($500) which includes premium logo placement on the main stage Alpona backdrop.";
      } else if (userMsg.content.toLowerCase().includes('dance') || userMsg.content.toLowerCase().includes('perform')) {
        responseText = "Cross-referencing performer availability. The classical Kathak routine requires 15x15ft stage clearance. Adjusting run-sheet to ensure minimal bump-in collision with the acoustic bands.";
      }

      setHistory(prev => [...prev, { id: oracleMsgId, role: 'oracle', content: responseText, isTyping: true }]);
      
      // Simulate Typing Effect Completion
      setTimeout(() => {
        setHistory(prev => prev.map(msg => msg.id === oracleMsgId ? { ...msg, isTyping: false } : msg));
        setIsProcessing(false);
      }, 1500); // 1.5s typing simulation

    }, 800); // 800ms "thinking" latency
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden min-h-[500px]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d91b2a]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      {/* Terminal Header */}
      <div className="flex justify-between items-end mb-6 relative z-10">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#f3e5ab] mb-2 tracking-wide drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">The Oracle</h1>
          <div className="text-xs md:text-sm text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2">
            Status: {isProcessing ? <span className="text-[#d4af37] animate-pulse">Processing...</span> : <span className="text-[#a3e6b4]">Awaiting Directive</span>}
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
          <div className="w-3 h-3 rounded-full bg-white/10 shadow-inner"></div>
          <div className="w-3 h-3 rounded-full bg-white/10 shadow-inner"></div>
          <div className="w-3 h-3 rounded-full bg-[#d91b2a]/60 shadow-[0_0_8px_#d91b2a]"></div>
        </div>
      </div>
      
      {/* Terminal Output Area */}
      <div className="flex-1 bg-black/60 rounded-2xl border border-white/5 p-6 font-mono text-sm text-[#a3e6b4] overflow-y-auto mb-6 shadow-inner flex flex-col gap-6 custom-scrollbar relative z-10 backdrop-blur-md">
        
        {history.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'executive' ? 'opacity-70' : 'opacity-100'}`}>
            <span className={`mt-0.5 ${msg.role === 'executive' ? 'text-[#d91b2a]' : 'text-[#d4af37] drop-shadow-[0_0_5px_#d4af37]'}`}>
              {msg.role === 'executive' ? '>' : '*'}
            </span>
            <div className={`leading-relaxed ${msg.role === 'executive' ? 'text-gray-300' : 'text-[#e2f1e6]'}`}>
              {msg.isTyping ? (
                <div className="flex items-center gap-1">
                  <span className="animate-pulse">Synthesizing</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </div>
              ) : (
                <div className={msg.role === 'oracle' ? 'border-l-2 border-[#d4af37]/30 pl-4 py-1' : ''}>
                  {msg.content}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleExecute} className="relative z-10 mt-auto shrink-0">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <span className="text-[#d4af37] font-mono font-bold">{">"}</span>
        </div>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isProcessing}
          placeholder={isProcessing ? "Oracle is compiling..." : "Enter your query or prompt here..."} 
          className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl py-5 pl-12 pr-[140px] text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/50 focus:bg-black/60 transition-all font-mono text-sm shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button 
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-[#d4af37] to-[#d91b2a] text-white px-8 rounded-lg font-mono font-bold tracking-widest text-xs hover:shadow-[0_0_20px_rgba(217,27,42,0.4)] hover:brightness-110 transition-all disabled:opacity-50 disabled:hover:shadow-none disabled:hover:brightness-100"
        >
          EXECUTE
        </button>
      </form>
    </div>
  );
}
