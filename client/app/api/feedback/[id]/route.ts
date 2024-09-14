import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
require('dotenv').config()


export const feedbackSchema = z.object({
  grammarRating: z.number().int(),
  grammarSummary: z.string(),

  fluencyRating: z.number().int(),
  fluencySummary: z.string(),

  vocabularyRating: z.number().int(),
  vocabularySummary: z.string(),

  coherenceRating: z.number().int(),
  coherenceSummary: z.string(),

  engagementRating: z.number().int(),
  engagementSummary: z.string(),
});
/**
 * Fetch conversation data from Retell AI API.
 */
async function getConversation(conversationId: string): Promise<string> {
  const url = `https://api.retellai.com/v2/get-call/${conversationId}`;
  const headers = {
    Authorization: `Bearer ${process.env.RETELLAI_API_KEY}`,
  };

  try {
    const response = await fetch(url, { headers });
    if (response.status === 200) {
      // Assume the conversation text is in response.data.text
      return response.json();
    } else {
      throw new Error(`Failed to fetch conversation: ${response.status}`);
    }
  } catch (error: any) {
    console.log(error)
    throw new Error(`Failed to fetch conversation: ${error.message}`);
  }
}


/**
 * Analyze the user's proficiency in the conversation using OpenAI API.
 */
async function analyzeProficiency(conversationText: string): Promise<string> {


  const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });


  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            "You are an assistant that analyzes the proficiency of a user's conversation. " +
            'Provide detailed feedback on the following aspects: grammar, fluency, vocabulary, ' +
            'coherence, and engagement level. For each category, give a score out of 10 ' +
            'and offer suggestions for improvement.',
        },
        {
          role: 'user',
          content: `Analyze the proficiency of the following conversation:\n\n${conversationText}`,
        },
      ],
      max_tokens: 800,
      temperature: 0.7, // Adjust as needed for creativity
      response_format: zodResponseFormat(feedbackSchema, "feedback")
    });
    // Extract and return the content from the response
    return completion.choices[0].message?.content || '';
  } catch (error: any) {
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}


// Handle POST request
export async function GET(request: NextRequest,  { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // const data = await getConversation("call_044d239026aaa5304e2f24afda7")
    const data = await getConversation(id)
    const result = await analyzeProficiency(JSON.stringify(data));
    return NextResponse.json(result, {
      status: 200,
    })
  } catch (e: any) {
    console.log("Error providing feedback: " + e)
    // Determine the status code
    const status = e.response?.status || 500;

    // Optionally, provide more detailed error messages
    const errorMessage =
      e.response?.data?.error || 'Failed to create web call';

    return NextResponse.json(
      { error: errorMessage },
      { status, }
    )
  }
}