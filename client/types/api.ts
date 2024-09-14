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