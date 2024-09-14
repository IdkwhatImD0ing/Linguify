// types/api.ts

export interface CreateWebCallRequest {
    agent_id: string;
    metadata?: Record<string, any>;
    retell_llm_dynamic_variables?: Record<string, any>;
}

export interface RetellAIResponse {
    id: string;
    status: string;
}

export interface User {
  email: string;
  firstname: string;
  lastname: string;
  currentStreak: number;
  highestStreak: number;
  uploadedImages: string[];
  interactions: Interaction[];
}

export interface Interaction {
  callId: string;
  feedback: Feedback;
}

export interface Feedback {
  grammarRating: number;
  grammarSummary: string;
  fluencyRating: number;
  fluencySummary: string;
  vocabularyRating: number;
  vocabularySummary: string;
  coherenceRating: number;
  coherenceSummary: string;
  engagementRating: number;
  engagementSummary: string;
}