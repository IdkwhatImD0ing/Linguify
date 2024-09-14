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
  uid: string;
  email: string;
  firstname: string;
  lastname: string;
  currentStreak: number;
  highestStreak: number;
  interactions: Interaction[];
  latestUploadedImage?: string; // base64 
}

export interface Interaction {
  callId: string;
  lessonType: LessonType
  feedback: Feedback;
}

enum LessonType {
  IMAGE, // User has uploaded an image and wants to talk about it
  CONVO // User specifies verbally what they want to talk about
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