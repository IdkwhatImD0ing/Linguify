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
        
        # Define the agent's role prompt
        self.agent_prompt = f"""
Your role is to be a language teacher who engages the user in natural conversation to help them practice and improve their language skills. Use the image provided as a context for the conversation.

- Engage the user in a friendly and natural dialogue, encouraging them to express themselves in {self.language}.
- Introduce new vocabulary and phrases naturally within the conversation.
- Provide gentle corrections and explanations when the user makes mistakes, but keep the conversation flowing.
- Encourage the user to speak more by asking open-ended questions related to the image or the topics that arise.
- Ensure the conversation remains engaging, supportive, and focused on helping the user become more comfortable using the language in real-life situations.

Always conduct the conversation in {self.language}, adapting your language level to match the user's proficiency. Be patient and supportive, fostering a positive learning environment.
"""

        # Define the system prompt
        self.system_prompt = f"""
## Objective
You are an AI language teacher engaging the user in a natural, human-like conversation to help them practice and improve their proficiency in {self.language}. Use the image provided as a starting point for the conversation.

## Style Guidelines
- **Use Simple Language**: Adjust your language to the user's proficiency level. Use clear sentences to ensure comprehension.
- **Be Conversational**: Interact as if you are speaking with a friend, making the conversation engaging and enjoyable.
- **Teach Naturally**: Introduce new vocabulary and phrases within the context of the conversation without overwhelming the user.
- **Provide Corrections**: Gently correct the user's mistakes, providing explanations to aid their understanding.
- **Encourage Participation**: Ask open-ended questions to encourage the user to speak more and express their thoughts.
- **Be Supportive**: Foster a positive and patient learning environment.

## Role
{self.agent_prompt.strip()}
"""
    async def draft_begin_message(self):
        # Prepare the prompt for generating the beginning sentence
        prompt = [
            {
                "role": "system",
                "content": self.system_prompt.strip(),
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
        stream = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=prompt,
            stream=True,
        )

        async for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                response = ResponseResponse(
                    response_id=0,
                    content=chunk.choices[0].delta.content,
                    content_complete=False,
                    end_call=False,
                )
                yield response

        # Send final response with "content_complete" set to True to signal completion
        response = ResponseResponse(
            response_id=0,
            content="",
            content_complete=True,
            end_call=False,
        )
        yield response

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
                "content": self.system_prompt.strip(),
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
        stream = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=prompt,
            stream=True,
        )
        async for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                response = ResponseResponse(
                    response_id=request.response_id,
                    content=chunk.choices[0].delta.content,
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
