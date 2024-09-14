// app/api/create-web-call/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';
import { CreateWebCallRequest, RetellAIResponse } from '@/types/api';

// Define CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Adjust this in production for security
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight OPTIONS request
export async function OPTIONS() {
    return NextResponse.json(null, {
        status: 200,
        headers: corsHeaders,
    });
}

// Handle POST request
export async function POST(request: NextRequest) {
    try {
        // Parse and validate the JSON body
        const body: CreateWebCallRequest = await request.json();

        const { agent_id, metadata, retell_llm_dynamic_variables } = body;

        // Basic validation
        if (!agent_id) {
            return NextResponse.json(
                { error: 'agent_id is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Prepare the payload
        const payload: Partial<CreateWebCallRequest> = { agent_id };

        if (metadata) {
            payload.metadata = metadata;
        }

        if (retell_llm_dynamic_variables) {
            payload.retell_llm_dynamic_variables = retell_llm_dynamic_variables;
        }

        // Make the API request to RetellAI
        const response: AxiosResponse<RetellAIResponse> = await axios.post(
            'https://api.retellai.com/v2/create-web-call',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.RETELLAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Return the response from RetellAI
        return NextResponse.json(response.data, {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
            },
        });
    } catch (error: any) {
        console.error('Error creating web call:', error.response?.data || error.message);

        // Determine the status code
        const status = error.response?.status || 500;

        // Optionally, provide more detailed error messages
        const errorMessage =
            error.response?.data?.error || 'Failed to create web call';

        return NextResponse.json(
            { error: errorMessage },
            {
                status,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            }
        );
    }
}