import json
import os
import asyncio
from dotenv import load_dotenv
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
from concurrent.futures import TimeoutError as ConnectionTimeoutError
from retell import Retell
from llm import LlmClient
import base64
from convo_analysis import ConvoAnalysis

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

def convert_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

image_path = "ramen.jpeg"
DEFAULT_IMAGE = convert_image_to_base64(image_path)

from custom_types import (
    ConfigResponse,
    ResponseRequiredRequest,
)

DEFAULT_LANGUAGE = "English"


load_dotenv(override=True)

origins = [
    "http://localhost:3000",  # Your React frontend
    # Add other origins if needed
    # "https://yourdomain.com",
]

# Fetch the service account key JSON file contents
cred = credentials.Certificate('firebase_service_account.json')

# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://linguify-cfd48-default-rtdb.firebaseio.com'
})



app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Allow these origins
    allow_credentials=True,         # Allow cookies, authorization headers, etc.
    allow_methods=["*"],            # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],            # Allow all headers
)
retell = Retell(api_key=os.getenv("RETELL_API_KEY"))

analyzer = ConvoAnalysis()

# call_20dea7d7b87dac64ce8ce3e61a1

@app.websocket("/llm-websocket/{call_id}")
async def websocket_handler(websocket: WebSocket, call_id: str):
    try:
        await websocket.accept()
        # A unique call id is the identifier of each call
        print(f"Handle llm ws for: {call_id}")
        
        llm_client = None
        
        # Send optional config to Retell server
        config = ConfigResponse(
            response_type="config",
            config={
                "auto_reconnect": True,
                "call_details": True,
            },
            response_id=1,
        )
        await websocket.send_json(config.__dict__)
        
        
        response_id = 0
        async def handle_message(request_json):
            nonlocal response_id
            nonlocal llm_client

            # There are 5 types of interaction_type: call_details, pingpong, update_only, response_required, and reminder_required.
            # Not all of them need to be handled, only response_required and reminder_required.
            if request_json["interaction_type"] == "call_details":
                print(json.dumps(request_json, indent=2))
                language = request_json["call"]["metadata"].get("language", DEFAULT_LANGUAGE)
                user_id = request_json["call"]["metadata"].get("user_id", None)
                # As an admin, the app has access to read and write all data, regradless of Security Rules
                ref = db.reference('users')
                user_data = ref.child(user_id).get()
                image_base64 = user_data.get("latestUploadedImage", DEFAULT_IMAGE)
                llm_client = LlmClient(language=language, image_base64=image_base64)
                # Send first message to signal ready of server
                first_event = await llm_client.draft_begin_message()
                await websocket.send_json(first_event.__dict__)
                return
            if request_json["interaction_type"] == "ping_pong":
                await websocket.send_json(
                    {
                        "response_type": "ping_pong",
                        "timestamp": request_json["timestamp"],
                    }
                )
                return
            if request_json["interaction_type"] == "update_only":
                return
            if (
                request_json["interaction_type"] == "response_required"
                or request_json["interaction_type"] == "reminder_required"
            ):
                response_id = request_json["response_id"]
                request = ResponseRequiredRequest(
                    interaction_type=request_json["interaction_type"],
                    response_id=response_id,
                    transcript=request_json["transcript"],
                )
                print(
                    f"""Received interaction_type={request_json['interaction_type']}, response_id={response_id}, last_transcript={request_json['transcript'][-1]['content']}"""
                )

                async for event in llm_client.draft_response(request):
                    await websocket.send_json(event.__dict__)
                    if request.response_id < response_id:
                        break  # new response needed, abandon this one

        async for data in websocket.iter_json():
            asyncio.create_task(handle_message(data))

    except WebSocketDisconnect:
        print(f"LLM WebSocket disconnected for {call_id}")
    except ConnectionTimeoutError as e:
        print("Connection timeout error for {call_id}")
    except Exception as e:
        print(f"Error in LLM WebSocket: {e} for {call_id}")
        await websocket.close(1011, "Server error")
    finally:
        print(f"LLM WebSocket connection closed for {call_id}") 

@app.get("/feedback/{call_id}")
async def feedback(call_id: str):
    feedback = analyzer.evaluate_conversation(call_id)
    return {"feedback": json.loads(feedback) }