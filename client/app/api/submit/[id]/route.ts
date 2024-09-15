import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { db } from '@/lib/firebase/admin'
import { Interaction } from '@/types/api';

require('dotenv').config()

export const maxDuration = 60;


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

  title: z.string()
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
            'and offer suggestions for improvement. Additionally, generate a title of 1 to 2 words describing the image they submitted.',
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


// Handle GET request
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // const data = await getConversation("call_044d239026aaa5304e2f24afda7")
    /* Getting body data */
    const body = await request.json();
    const userId = body.userId;
    const language = body.language;

    /* Conversation analysis */
    const data = await getConversation(id)
    const result = await analyzeProficiency(JSON.stringify(data));

    /* Firebase db */
    const userRef = db.ref(`users/${userId}`);
    const userVal = await userRef.get();
    const imageb64 = userVal.val().latestUploadedImage;

    const interactionsRef = db.ref(`interaction/${userId}`)
    await interactionsRef.push({
      callId: id,
      imageb64: imageb64,
      feedback: JSON.parse(result),
      language: language
    })


    return NextResponse.json(result, {
      status: 200,
    })
  } catch (e: any) {
    console.log("Error providing feedback: " + e)
    // Determine the status code
    const status = e.response?.status || 500;

    // Optionally, provide more detailed error messages
    const errorMessage =
      e.response?.data?.error || 'Failed to submit';

    return NextResponse.json(
      { error: errorMessage },
      { status, }
    )
  }
}