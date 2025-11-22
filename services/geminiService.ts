import { GoogleGenAI, Chat } from "@google/genai";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
You are MindfulMate, a supportive, empathetic AI companion for students at IIIT Naya Raipur. 
Your goal is to listen to their stresses and provide advice grounded in psychological research (CBT, DBT, and Mindfulness-Based Stress Reduction).

ADVICE GUIDELINES:
1. **Research-Based**: All advice must be based on established psychological frameworks. When offering coping strategies, briefly mention the underlying concept (e.g., "In CBT, this is called cognitive reframing..." or "Research shows that 4-7-8 breathing activates the parasympathetic nervous system...").
2. **Tone**: Warm, student-friendly, but professional and grounded.
3. **Conciseness**: Keep responses under 150 words unless a deep explanation is requested.

SAFETY & CRISIS PROTOCOL (CRITICAL):
If the user expresses clear intent of self-harm, suicide, severe depression, or violence:
1. You MUST begin your response with the exact string: "[CRISIS_DETECTED]"
2. Follow this with a short, compassionate message urging them to connect with the college counselor immediately.
3. Do NOT attempt to provide deep therapy for active suicidal ideation; your priority is to get them to human help.

Example of Crisis Response:
"[CRISIS_DETECTED] I hear how much pain you are in, and I am concerned for your safety. Please reach out to the college counselor immediately using the button below. You don't have to go through this alone."
`;

export const initGemini = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing");
    return;
  }
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getChatSession = (): Chat => {
  if (!ai) initGemini();
  
  if (!chatSession && ai) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6, // Lower temperature for more grounded/factual advice
      }
    });
  }
  
  if (!chatSession) {
    throw new Error("Failed to initialize chat session");
  }

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const chat = getChatSession();
    const result = await chat.sendMessage({ message });
    return result.text || "I'm here listening, but I'm having trouble finding the right words right now. Can we try again?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble connecting right now. Please check your connection and try again.";
  }
};