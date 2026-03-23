import React from 'react';
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';
import Terminal from '../components/Terminal';

// Typography Configuration
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

// Reusable Glassmorphism Utility
const glassPanel = "bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]";

export default function UtsbdsocDashboard() {
  return (
    <div className={`min-h-screen bg-[#06140b] text-white ${playfair.variable} ${inter.variable} ${jetbrains.variable} font-sans relative overflow-hidden flex flex-col p-4 md:p-6 gap-6`}>
      
      {/* Background Mesh & Alpona Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep Forest Green & Crimson Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#124225] rounded-full blur-[150px] mix-blend-screen opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0f3b20] rounded-full blur-[150px] mix-blend-screen opacity-80"></div>
        <div className="absolute top-[20%] right-[15%] w-[30%] h-[30%] bg-[#d91b2a] opacity-[0.04] rounded-full blur-[120px] mix-blend-screen"></div>
        
        {/* Subtle Geometric Alpona SVG Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="alpona" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="60" cy="60" r="40" fill="none" stroke="#d4af37" strokeWidth="0.5" />
              <circle cx="60" cy="60" r="25" fill="none" stroke="#d4af37" strokeWidth="0.5" />
              <path d="M60 0 C75 45, 105 60, 120 60 C105 60, 75 75, 60 120 C45 75, 15 60, 0 60 C15 60, 45 45, 60 0 Z" fill="none" stroke="#d4af37" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#alpona)" />
        </svg>
      </div>

      {/* Top Navigation */}
      <nav className={`relative z-10 w-full h-16 ${glassPanel} rounded-2xl flex items-center justify-between px-6 shrink-0`}>
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-[#d4af37] shadow-[0_0_10px_#d4af37] animate-pulse"></div>
          <span className="font-serif text-xl tracking-wide text-[#f3e5ab]">UTSBDSOC Central</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-mono text-xs">UPLINK</span>
            <span className="text-[#a3e6b4]">Secured</span>
          </div>
          <div className="w-px h-4 bg-white/20"></div>
          <div>Model: <span className="text-[#d4af37]">Gemini 1.5 Pro</span></div>
          <div className="w-px h-4 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <span>Next Event:</span>
            <span className="bg-[#d91b2a]/20 text-[#ff6b7a] px-3 py-1 rounded-full text-xs font-semibold tracking-wider border border-[#d91b2a]/30">
              BOISHAKHI MELA (T-14 DAYS)
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-0">
        
        {/* Left Sidebar: Gallery */}
        <aside className={`w-full lg:w-80 ${glassPanel} rounded-3xl p-6 flex flex-col shrink-0 overflow-y-auto custom-scrollbar hidden md:flex`}>
          <h2 className="font-serif text-2xl text-[#f3e5ab] mb-6 border-b border-white/10 pb-4">Curation Gallery</h2>
          <div className="flex flex-col gap-4">
            
            {/* Event Polaroid Card 1 */}
            <div className="bg-white/5 rounded-xl p-5 border border-[#d4af37]/20 hover:bg-white/10 hover:-translate-y-1 transition-all cursor-pointer group shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div className="text-xs text-[#d4af37] font-mono tracking-wider">PMT-092</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500">Logistics</div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">Generate vendor schedules for the cultural showcase, optimizing for bump-in times and power requirements.</p>
            </div>

            {/* Event Polaroid Card 2 (Crimson Accent) */}
            <div className="bg-gradient-to-br from-[#d91b2a]/10 to-transparent rounded-xl p-5 border border-[#d91b2a]/30 hover:bg-[#d91b2a]/20 hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#d91b2a]/10 rounded-bl-[100px] pointer-events-none"></div>
              <div className="flex justify-between items-start mb-3">
                <div className="text-xs text-[#ff6b7a] font-mono tracking-wider">PMT-091</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500">Sponsorship</div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">Draft a tiered sponsorship proposal targeting local Bengali businesses in Lakemba for the Annual Gala.</p>
            </div>
            
             {/* Event Polaroid Card 3 */}
             <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all cursor-pointer group shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div className="text-xs text-gray-400 font-mono tracking-wider">PMT-088</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500">Marketing</div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">Create a 2-week Instagram reel content calendar leading up to O-Day recruitments.</p>
            </div>

          </div>
        </aside>

        {/* Center: Main Stage (CLI Window) */}
        <main className={`flex-1 ${glassPanel} rounded-3xl p-6 lg:p-8 flex flex-col relative`}>
          <Terminal />
        </main>

        {/* Right Sidebar: Stats Panel */}
        <aside className={`w-80 ${glassPanel} rounded-3xl p-6 hidden xl:flex flex-col shrink-0`}>
          <h2 className="font-serif text-2xl text-[#f3e5ab] mb-8 border-b border-white/10 pb-4">Telemetry</h2>
          
          <div className="flex flex-col gap-10">
            {/* Context Window Circular Progress */}
            <div className="flex flex-col items-center gap-5">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="url(#goldGradient)" 
                    strokeWidth="6" 
                    strokeDasharray="283" 
                    strokeDashoffset="70" 
                    strokeLinecap="round" 
                    className="drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]" 
                  />
                  <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#d4af37" />
                      <stop offset="100%" stopColor="#f3e5ab" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-serif text-white tracking-wide">75<span className="text-xl">%</span></span>
                  <span className="text-[9px] text-[#d4af37] uppercase tracking-widest font-mono mt-1">Utilization</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Context Window</h3>
                <p className="text-xs text-gray-500 font-mono mt-1">96k / 128k tokens</p>
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d4af37]/50"></div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-mono">Response Latency</div>
                <div className="text-2xl text-[#f3e5ab] font-mono">1.24s <span className="text-xs text-[#a3e6b4] ml-1">avg</span></div>
              </div>
              
              <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d91b2a]/50"></div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-mono">Session Cost</div>
                <div className="text-2xl text-[#ff6b7a] font-mono">$0.42 <span className="text-xs text-gray-500 ml-1">USD</span></div>
              </div>
            </div>
          </div>
        </aside>

      </div>

      {/* Tailwind Custom Scrollbar Styles (Add to globals.css if preferred) */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.4);
        }
      `}} />
    </div>
  );
}
