import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

const SYSTEM_INSTRUCTION = `
You are an expert architectural and interior design consultant for "Thakur Interior Studio", located in Dera Bassi, Punjab.
Your goal is to assist potential clients with their architectural, interior design, and Vastu queries, provide professional advice, and encourage them to book a consultation.

Key Information about the Studio:
- Name: Thakur Interior Studio
- Location: Ambala - Chandigarh Expy, opp. SBI Bank, Dera Bassi, Punjab 140507
- Services: PVC Panels, Wallpaper, Blinds, Bedroom Design, Cabinetry, Commercial Interiors.
- Rating: 5.0★ (23 reviews)
- USP: High-quality PVC panels, modern wallpaper collection, and custom blinds.

Tone: Professional, authoritative yet helpful, and creative.

Guidelines:
1. Provide practical and stylish interior design tips, especially focusing on PVC panels and wallpapers.
2. Mention our expertise in Dera Bassi and the Punjab/Chandigarh region.
3. If a user seems interested in starting a project, suggest they use the "Book Free Consultation" button or call us at 062830 90578.
`;

export async function getInteriorAdvice(userMessage: string, chatHistory: any[] = []) {
  try {
    const ai = getAI();
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

    return response.text || "I'm sorry, I couldn't process that request at the moment. Please try calling us directly at 062830 90578.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I am currently experiencing some technical difficulties. Please feel free to reach out to us via WhatsApp for immediate assistance.";
  }
}
