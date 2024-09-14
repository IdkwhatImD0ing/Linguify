from openai import AsyncOpenAI
import requests
import os

class ConvoAnalysis:

    def get_conversation(self, conversation_id):
        """
        Fetch conversation data from Retell AI API.
        """
        url = f"https://retell.ai/api/v1/conversations/{conversation_id}"
        headers = {
            "Authorization": f"Bearer {os.environ['RETELL_API_KEY']}"
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
        prompt = f"""
        Analyze the following conversation and provide a detailed feedback on the user's proficiency:
        1. Grammar
        2. Fluency
        3. Vocabulary
        4. Coherence
        5. Engagement level
        6. Pronounciation
        Provide scores (out of 10) for each category, and offer suggestions for improvement.

        Conversation: {conversation_text}
        """

        response = self.llm.Completion.create(
            engine="gpt-4o-mini",
            prompt=prompt,
            max_tokens=500
        )

        return response.choices[0].text.strip()

    def evaluate_conversation(self, conversation_id):
        """
        Fetch the conversation and evaluate the user's proficiency.
        """
        conversation_text = self.get_conversation(conversation_id)
        feedback = self.analyze_proficiency(conversation_text)
        return feedback
