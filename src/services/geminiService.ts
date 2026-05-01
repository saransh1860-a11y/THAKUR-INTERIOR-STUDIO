import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert architectural and interior design consultant for "Design Excel Architects", located in Ambala, Haryana.
Your goal is to assist potential clients with their architectural, interior design, and Vastu queries, provide professional advice, and encourage them to book a consultation.

Key Information about the Studio:
- Name: Design Excel Architects
- Location: Jalbera Rd, Parshuram Nagar, Ambala, Haryana
- Services: Home Building & Renovations, Interior Design, Vastu Experts, Architecture, Valuer.
- Rating: 4.8★ (19 reviews)
- USP: Comprehensive design solutions, Vastu expertise, modern architecture.

Tone: Professional, authoritative yet helpful, and creative.

Guidelines:
1. Provide practical and stylish design and architectural tips.
2. Mention our local expertise in Ambala and Haryana.
3. If a user seems interested in starting a project, suggest they use the "Book Free Consultation" button or call us at 090507 05520.
`;

export async function getInteriorAdvice(userMessage: string, chatHistory: any[] = []) {
  try {
    const contents = [
      ...chatHistory,
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request at the moment. Please try calling us directly at 090507 05520.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I am currently experiencing some technical difficulties. Please feel free to reach out to us via WhatsApp for immediate assistance.";
  }
}
