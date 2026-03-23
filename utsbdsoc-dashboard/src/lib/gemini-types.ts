export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: 'event-planning' | 'recruitment' | 'gallery' | 'general';
  createdAt: Date;
  isFavorite?: boolean;
}

export interface OutputMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokenCount?: number;
}

export interface SessionStats {
  tokensUsed: number;
  tokensLimit: number;
  latencyMs: number;
  costUsd: number;
  requestsToday: number;
  requestsLimit: number;
}

export interface ConnectionStatus {
  isConnected: boolean;
  model: GeminiModel;
  lastPing?: Date;
}

export type GeminiModel = 
  | 'gemini-2.0-flash'
  | 'gemini-2.0-pro'
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash';

export interface GeminiState {
  prompts: Prompt[];
  messages: OutputMessage[];
  stats: SessionStats;
  connection: ConnectionStatus;
  isExecuting: boolean;
  currentInput: string;
}
