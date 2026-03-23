"use client";

import { useState, useCallback } from "react";
import type { Prompt, OutputMessage, SessionStats, ConnectionStatus } from "@/lib/gemini-types";
import { GeminiAlponaBackground } from "./gemini-alpona-background";
import { GeminiTopNav } from "./gemini-top-nav";
import { GeminiGallerySidebar } from "./gemini-gallery-sidebar";
import { GeminiMainStage } from "./gemini-main-stage";
import { GeminiStatsPanel } from "./gemini-stats-panel";

interface GeminiShellProps {
  initialPrompts: Prompt[];
  initialMessages: OutputMessage[];
  initialStats: SessionStats;
  initialConnection: ConnectionStatus;
}

export function GeminiShell({
  initialPrompts,
  initialMessages,
  initialStats,
  initialConnection,
}: GeminiShellProps) {
  const [prompts] = useState<Prompt[]>(initialPrompts);
  const [messages, setMessages] = useState<OutputMessage[]>(initialMessages);
  const [stats, setStats] = useState<SessionStats>(initialStats);
  const [connection] = useState<ConnectionStatus>(initialConnection);
  const [inputValue, setInputValue] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState<string>();

  const handleSelectPrompt = useCallback((prompt: Prompt) => {
    setInputValue(prompt.content);
    setSelectedPromptId(prompt.id);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!inputValue.trim() || isExecuting) return;

    setIsExecuting(true);
    setSelectedPromptId(undefined);

    // Add user message
    const userMessage: OutputMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      tokenCount: Math.ceil(inputValue.split(/\s+/).length * 1.3),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response with typing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Mock response based on input
    const mockResponse = generateMockResponse(inputValue);
    const assistantMessage: OutputMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: mockResponse,
      timestamp: new Date(),
      tokenCount: Math.ceil(mockResponse.split(/\s+/).length * 1.3),
    };

    setMessages(prev => [...prev, assistantMessage]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      tokensUsed: prev.tokensUsed + (userMessage.tokenCount || 0) + (assistantMessage.tokenCount || 0),
      requestsToday: prev.requestsToday + 1,
    }));

    setIsExecuting(false);
  }, [inputValue, isExecuting]);

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <GeminiAlponaBackground />

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <GeminiTopNav connection={connection} />

        {/* Main Content */}
        <div className="flex-1 flex pt-16">
          {/* Gallery Sidebar (Left) */}
          <GeminiGallerySidebar
            prompts={prompts}
            onSelectPrompt={handleSelectPrompt}
            selectedPromptId={selectedPromptId}
          />

          {/* Main Stage (Center) */}
          <GeminiMainStage
            messages={messages}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSubmit={handleSubmit}
            isExecuting={isExecuting}
          />

          {/* Stats Panel (Right) */}
          <GeminiStatsPanel stats={stats} />
        </div>
      </div>
    </div>
  );
}

function generateMockResponse(input: string): string {
  const lowercaseInput = input.toLowerCase();

  if (lowercaseInput.includes('event') || lowercaseInput.includes('plan')) {
    return `# 🎉 Event Planning Assistant

I'd be happy to help you plan your event! Here's a structured approach:

## Key Elements to Consider

### 1. Event Basics
- **Date & Time**: Consider academic calendar and cultural significance
- **Venue**: UTS facilities (Building 10, Alumni Green, etc.)
- **Expected Attendance**: Helps with catering and space planning

### 2. Budget Breakdown
| Category | Suggested % |
|----------|-------------|
| Venue & Setup | 30% |
| Catering | 35% |
| Marketing | 15% |
| Decorations | 10% |
| Contingency | 10% |

### 3. Team Responsibilities
- **Event Lead**: Overall coordination
- **Logistics**: Venue, equipment, setup
- **Marketing**: Social media, outreach
- **Finance**: Budget tracking, sponsorships

Would you like me to elaborate on any specific aspect?`;
  }

  if (lowercaseInput.includes('recruit') || lowercaseInput.includes('member')) {
    return `# 👥 Recruitment Post Draft

Here's an engaging recruitment post for UTSBDSOC:

---

🇧🇩 **Join the UTSBDSOC Family!** 🇧🇩

Are you a UTS student looking to:
✨ Connect with Bengali culture
🎭 Experience amazing cultural events
🤝 Build lifelong friendships
📚 Network with industry professionals

**Why Join Us?**
→ Pohela Boishakh celebrations 🎊
→ Durga Puja festivities 🙏
→ Eid gatherings 🌙
→ Career networking events 💼
→ Study sessions & support 📖

**Membership is FREE!**

📲 Follow us: @utsbdsoc
🔗 Sign up: [Link in bio]

*Your home away from home* 🏠💛

---

Shall I create variations for different platforms (Instagram, LinkedIn, Facebook)?`;
  }

  if (lowercaseInput.includes('gallery') || lowercaseInput.includes('photo') || lowercaseInput.includes('caption')) {
    return `# 📸 Gallery Caption Ideas

Here are some culturally meaningful captions for your photos:

## For Cultural Events
1. "Where traditions meet new beginnings ✨"
2. "আমাদের সংস্কৃতি, আমাদের গর্ব | Our culture, our pride"
3. "Creating memories, celebrating heritage 🇧🇩"

## For Group Photos
1. "More than a society, we're family 💛"
2. "United by culture, connected by heart"
3. "The UTSBDSOC squad bringing the বাংলা vibes ⚡"

## For Food Events
1. "When the mishti hits different 🍬"
2. "Biriyani bringing us together since [year]"
3. "Home-cooked flavors, campus style"

## For Achievement Posts
1. "Growing stronger, together 💪"
2. "Another milestone for the UTSBDSOC fam"
3. "Watch this space – big things coming! 🚀"

Would you like me to create more specific captions for particular events?`;
  }

  return `# 💡 I'm Here to Help!

Thanks for your prompt! I can assist you with:

## Event Planning
- Timeline creation
- Budget allocation
- Volunteer coordination
- Venue selection

## Content Creation  
- Social media posts
- Recruitment campaigns
- Event descriptions
- Photo captions

## Administrative Tasks
- Meeting agendas
- Email templates
- Sponsorship proposals
- Reporting templates

**Just let me know what specific task you'd like help with!**

Some example prompts:
- "Create an event plan for Pohela Boishakh"
- "Draft a recruitment post for Instagram"
- "Generate captions for our Durga Puja gallery"
- "Write a sponsor outreach email"`;
}
