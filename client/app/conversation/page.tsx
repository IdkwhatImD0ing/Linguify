"use client";
import { Feedback } from "@/types/api";
import React, { useEffect, useState, useRef } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

const agentId = "agent_3e6eb29bd647e7d27cde795417";

interface RegisterCallResponse {
    access_token: string;
    call_id: string;
}

const retellWebClient = new RetellWebClient();

const Conversation = () => {
    const [isCalling, setIsCalling] = useState(false);
    const [language, setLanguage] = useState("English");
    const [imageBase64, setImageBase64] = useState("");
    const [fullTranscript, setFullTranscript] = useState<any>([]);
    const callId = useRef("");
    const [feedback, setFeedback] = useState<Feedback>();

    // Reference to the end of the transcript for auto-scrolling
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    // Initialize the SDK and set up event listeners
    useEffect(() => {
        retellWebClient.on("call_started", () => {
            console.log("Call started");
            setIsCalling(true);
        });

        retellWebClient.on("call_ended", () => {
            console.log("Call ended");
            setIsCalling(false);
        });

        retellWebClient.on("agent_start_talking", () => {
            console.log("Agent started talking");
        });

        retellWebClient.on("agent_stop_talking", () => {
            console.log("Agent stopped talking");
        });

        retellWebClient.on("audio", (audio) => {
            // Handle audio if needed
        });

        retellWebClient.on("update", (update) => {
            setFullTranscript((prevTranscript: any) => {
                // Check if update.transcript has at least one message
                if (update.transcript.length === 0) {
                    return prevTranscript;
                }

                // Get the last message from update.transcript
                const newMessage = update.transcript[update.transcript.length - 1];

                // Create a copy of the previous transcript
                const updatedTranscript = [...prevTranscript];

                if (updatedTranscript.length > 0) {
                    // Get the last message from the previous transcript
                    const lastMessage = updatedTranscript[updatedTranscript.length - 1];

                    if (lastMessage.role === newMessage.role) {
                        // Update the content of the last message
                        updatedTranscript[updatedTranscript.length - 1] = newMessage;
                    } else {
                        // Append the new message
                        updatedTranscript.push(newMessage);
                    }
                } else {
                    // If the transcript is empty, add the new message
                    updatedTranscript.push(newMessage);
                }

                return updatedTranscript;
            });
        });


        retellWebClient.on("metadata", (metadata) => {
            // Handle metadata if needed
        });

        retellWebClient.on("call_ended", (e) => {
          console.log("Call has ended. Logging call id: ")
          console.log(callId.current);
        })

        retellWebClient.on("error", (error) => {
            console.error("An error occurred:", error);
            retellWebClient.stopCall();
        });

        // Cleanup on unmount
        return () => {
            retellWebClient.off("call_started");
            retellWebClient.off("call_ended");
            retellWebClient.off("agent_start_talking");
            retellWebClient.off("agent_stop_talking");
            retellWebClient.off("audio");
            retellWebClient.off("update");
            retellWebClient.off("metadata");
            retellWebClient.off("error");
        };
    }, []);

    // Auto-scroll to the latest message
    useEffect(() => {
        if (transcriptEndRef.current) {
            transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [fullTranscript]);

    const toggleConversation = async () => {
        if (isCalling) {
            retellWebClient.stopCall();
        } else {
            try {
                const registerCallResponse = await registerCall(agentId);
                
                // setCallId(registerCallResponse.call_id);
                callId.current = registerCallResponse.call_id
                console.log(callId.current)
                if (registerCallResponse.access_token) {
                    await retellWebClient.startCall({
                        accessToken: registerCallResponse.access_token,
                        metadata: { language }, // Pass metadata if needed
                    });
                    setIsCalling(true);
                }
            } catch (error) {
                console.error("Failed to start call:", error);
            }
        }
    };

    async function registerCall(agentId: string): Promise<RegisterCallResponse> {
        try {
            const response = await fetch("/api/create-web-call", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    agent_id: agentId,
                    metadata: { language },
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data: RegisterCallResponse = await response.json();
            return data;
        } catch (err) {
            console.error("Error registering call:", err);
            throw new Error("Failed to register call");
        }
    }

    return (
        <div className="conversation-container" style={styles.container}>
            <header className="conversation-header" style={styles.header}>
                <button onClick={toggleConversation} style={styles.button}>
                    {isCalling ? "Stop" : "Start"} Conversation
                </button>
            </header>

            <main className="conversation-main" style={styles.main}>
                <h2 style={styles.title}>Transcript</h2>
                <div className="transcript" style={styles.transcript}>
                    {fullTranscript.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.message,
                                ...(item.role === "agent" ? styles.agentMessage : styles.userMessage),
                                opacity: item.isComplete ? 1 : 0.6, // Visual cue for incomplete messages
                            }}
                        >
                            <strong>{item.role === "agent" ? "Agent" : "You"}:</strong> {item.content}
                        </div>
                    ))}
                    <div ref={transcriptEndRef} />
                </div>
            </main>
        </div>
    );
};

// Basic inline styles for demonstration purposes

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f0f0",
    },
    header: {
        padding: "10px",
        backgroundColor: "#282c34",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "#61dafb",
        color: "#000",
    },
    main: {
        flex: 1,
        padding: "20px",
        overflowY: "auto",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
    },
    transcript: {
        maxHeight: "80vh",
        overflowY: "auto",
        padding: "10px",
        backgroundColor: "#ffffff",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    },
    message: {
        marginBottom: "10px",
        padding: "10px",
        borderRadius: "5px",
        maxWidth: "80%",
        color: "#000",
    },
    agentMessage: {
        backgroundColor: "#e1f5fe",
        alignSelf: "flex-start",
    },
    userMessage: {
        backgroundColor: "#c8e6c9",
        alignSelf: "flex-end",
        marginLeft: "auto",
    },
};

export default Conversation;
