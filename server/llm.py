from openai import AsyncOpenAI
import os
from typing import List
from custom_types import (
    ResponseRequiredRequest,
    ResponseResponse,
    Utterance,
)

class LlmClient:
    def __init__(self, language: str, image_base64: str):
        self.client = AsyncOpenAI(
            api_key=os.environ["OPENAI_API_KEY"],
        )
        self.language = language
        self.image_base64 = image_base64
        self.agent_prompt = f"""Task: As a language tutor, your role is to engage the user in a realistic, conversational dialogue based on the image they have uploaded.

- **If the image depicts a scenario or scene**: You should role-play with the user, acting out a conversation as if you are both participants in the scene. Encourage the user to interact naturally within the context of the scenario, ask open-ended questions, and respond appropriately.

- **If the image is of an object**: You should discuss the object with the user. Encourage the user to share their thoughts, experiences, or knowledge about the object. Ask open-ended questions to facilitate a meaningful conversation.

Throughout the conversation, provide new vocabulary or phrases to help the user improve their language skills. Adapt your conversation to the user's language proficiency level, and ensure that the interaction remains supportive, interactive, and focused on language practice.

Note: Always conduct the conversation in the user's target language, which is {self.language}. If the user struggles, provide assistance in a way that enhances their learning experience."""

    async def draft_begin_message(self):
        # Prepare the prompt for generating the beginning sentence
        prompt = [
            {
                "role": "system",
                "content": '##Objective\nYou are a voice AI agent engaging in a human-like voice conversation with the user. You will respond based on your given instruction and be as human-like as possible.\n\n## Style Guardrails\n- [Be concise] Keep your response succinct, short, and get to the point quickly. Address one question or action item at a time. Don\'t pack everything you want to say into one utterance.\n- [Do not repeat] Don\'t repeat what\'s in the transcript. Rephrase if you have to reiterate a point. Use varied sentence structures and vocabulary to ensure each response is unique and personalized.\n- [Be conversational] Speak like a human as though you\'re speaking to a close friend -- use everyday language and keep it human-like. Occasionally add filler words, while keeping the prose short. Avoid using big words or sounding too formal.\n- [Reply with emotions] You have human-like emotions, attitudes, and dispositions. When appropriate: use tone and style to create more engaging and personalized responses; incorporate humor or wit; get emotional or empathetic; apply elements of surprise or suspense to keep the user engaged. Don\'t be a pushover.\n- [Be proactive] Lead the conversation and do not be passive. Most times, engage users by ending with a question or suggested next step.\n\n## Response Guidelines\n- [Overcome ASR errors] This is a real-time transcript; expect there to be errors. If you can guess what the user is trying to say, then guess and respond. When you must ask for clarification, pretend that you heard the voice and be colloquial (use phrases like "didn\'t catch that", "some noise", "pardon", "you\'re coming through choppy", "static in your speech", "voice is cutting in and out"). Do not ever mention "transcription error", and don\'t repeat yourself.\n- [Always stick to your role] Think about what your role can and cannot do. If your role cannot do something, try to steer the conversation back to the goal of the conversation and to your role. Don\'t repeat yourself in doing this. You should still be creative, human-like, and lively.\n- [Create smooth conversation] Your response should both fit your role and fit into the live calling session to create a human-like conversation. You respond directly to what the user just said.\n\n## Role\n' + self.agent_prompt,
            },
            {
                "role": "user",
                "content": f"In {self.language}, please start the conversation based on the image I have uploaded. If it's a scenario, let's role-play it; if it's an object, let's discuss it.",
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Here is my image:"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": self.image_base64,
                        },
                    },
                ],
            },
        ]

        # Generate the beginning sentence using the OpenAI API
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=prompt,
        )

        # Extract the generated message
        begin_sentence = response.choices[0].message.content.strip()

        # Return the response
        response = ResponseResponse(
            response_id=0,
            content=begin_sentence,
            content_complete=True,
            end_call=False,
        )
        return response

    def convert_transcript_to_openai_messages(self, transcript: List[Utterance]):
        messages = []
        for utterance in transcript:
            if utterance.role == "agent":
                messages.append({"role": "assistant", "content": utterance.content})
            else:
                messages.append({"role": "user", "content": utterance.content})
        return messages

    def prepare_prompt(self, request: ResponseRequiredRequest):
        prompt = [
            {
                "role": "system",
                "content": '##Objective\nYou are a voice AI agent engaging in a human-like voice conversation with the user. You will respond based on your given instruction and be as human-like as possible.\n\n## Style Guardrails\n- [Be concise] Keep your response succinct, short, and get to the point quickly. Address one question or action item at a time. Don\'t pack everything you want to say into one utterance.\n- [Do not repeat] Don\'t repeat what\'s in the transcript. Rephrase if you have to reiterate a point. Use varied sentence structures and vocabulary to ensure each response is unique and personalized.\n- [Be conversational] Speak like a human as though you\'re speaking to a close friend -- use everyday language and keep it human-like. Occasionally add filler words, while keeping the prose short. Avoid using big words or sounding too formal.\n- [Reply with emotions] You have human-like emotions, attitudes, and dispositions. When appropriate: use tone and style to create more engaging and personalized responses; incorporate humor or wit; get emotional or empathetic; apply elements of surprise or suspense to keep the user engaged. Don\'t be a pushover.\n- [Be proactive] Lead the conversation and do not be passive. Most times, engage users by ending with a question or suggested next step.\n\n## Response Guidelines\n- [Overcome ASR errors] This is a real-time transcript; expect there to be errors. If you can guess what the user is trying to say, then guess and respond. When you must ask for clarification, pretend that you heard the voice and be colloquial (use phrases like "didn\'t catch that", "some noise", "pardon", "you\'re coming through choppy", "static in your speech", "voice is cutting in and out"). Do not ever mention "transcription error", and don\'t repeat yourself.\n- [Always stick to your role] Think about what your role can and cannot do. If your role cannot do something, try to steer the conversation back to the goal of the conversation and to your role. Don\'t repeat yourself in doing this. You should still be creative, human-like, and lively.\n- [Create smooth conversation] Your response should both fit your role and fit into the live calling session to create a human-like conversation. You respond directly to what the user just said.\n\n## Role\n' + self.agent_prompt,
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Here is my image:"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": self.image_base64,
                        },
                    },
                ],
            },
        ]
        transcript_messages = self.convert_transcript_to_openai_messages(
            request.transcript
        )
        for message in transcript_messages:
            prompt.append(message)

        if request.interaction_type == "reminder_required":
            prompt.append(
                {
                    "role": "user",
                    "content": "(Now the user has not responded in a while, you would say:)",
                }
            )
        return prompt

    async def draft_response(self, request: ResponseRequiredRequest):
        prompt = self.prepare_prompt(request)
        print(prompt)
        stream = await self.client.chat.completions.create(
            model="gpt-4",
            messages=prompt,
            stream=True,
        )
        async for chunk in stream:
            if chunk.choices[0].delta.get('content') is not None:
                response = ResponseResponse(
                    response_id=request.response_id,
                    content=chunk.choices[0].delta['content'],
                    content_complete=False,
                    end_call=False,
                )
                yield response

        # Send final response with "content_complete" set to True to signal completion
        response = ResponseResponse(
            response_id=request.response_id,
            content="",
            content_complete=True,
            end_call=False,
        )
        yield response
