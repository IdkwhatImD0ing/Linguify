import openai
import requests
import os
from custom_types import Feedback
from dotenv import load_dotenv

class ConvoAnalysis:

    def get_conversation(self, conversation_id):
      
        load_dotenv()
        """
        Fetch conversation data from Retell AI API.
        """
        url = f"https://api.retellai.com/v2/get-call/{conversation_id}"
        headers = {
            "Authorization": f"Bearer {os.getenv('RETELL_API_KEY')}"
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()  # Assume the response contains the conversation in text format
        else:
            raise Exception(f"Failed to fetch conversation: {response.status_code}")

    def analyze_proficiency(self, conversation_text):
        """
        Analyze the user's proficiency in the conversation using GPT-4 API.
        """
        messages = [
            {
                "role": "system",
                "content": (
                    "You are an assistant that analyzes the proficiency of a user's conversation. "
                    "Provide detailed feedback on the following aspects: grammar, fluency, vocabulary, "
                    "coherence, and engagement level. For each category, give a score out of 10 "
                    "and offer suggestions for improvement."
                )
            },
            {
                "role": "user",
                "content": f"Analyze the proficiency of the following conversation:\n\n{conversation_text}"
            }
        ]

        try:
            response = openai.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=800,
                temperature=0.7,  # Adjust as needed for creativity
                response_format=Feedback
            )
            # Extract and return the content from the response
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"OpenAI API error: {e}")

    def evaluate_conversation(self, conversation_id):
        """
        Fetch the conversation and evaluate the user's proficiency.
        """
        conversation_text = self.get_conversation(conversation_id)
        
        if not conversation_text:
            raise ValueError("Conversation text is empty or not found.")
        
        feedback = self.analyze_proficiency(conversation_text)
        return feedback