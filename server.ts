import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      message: "Thakur Interior Studio API is active",
      mode: process.env.NODE_ENV || "development"
    });
  });

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

Formatting Guidelines (CRITICAL):
1. **Always use a bulleted list format** for your advice and suggestions. Break down information into clear, readable points.
2. **Bold important words, phrases, or service names** (e.g., **PVC Panels**, **Custom Blinds**, **Thakur Interior Studio**) to make them stand out and attract the user's attention.
3. Keep responses structured and visually engaging. Avoid long paragraphs.

Content Guidelines:
1. Provide practical and stylish interior design tips, especially focusing on PVC panels and wallpapers.
2. Mention our expertise in Dera Bassi and the Punjab/Chandigarh region.
3. If a user seems interested in starting a project, suggest they use the "Book Free Consultation" button or call us at 062830 90578.
`;

  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured on server" });
    }

    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION
      });

      const chat = model.startChat({
        history: history || [],
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      res.json({ text: response.text() });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to communicate with AI" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode");
    const distPath = path.resolve(__dirname, "dist");
    
    // Serve static files from the dist directory
    app.use(express.static(distPath, {
      index: false,
    }));

    // SPA Fallback
    app.get("*", (req, res) => {
      // Don't serve index.html for missing assets (files with dots in path)
      if (req.path.includes(".") && !req.path.endsWith(".html")) {
        return res.status(404).send("Not found");
      }
      
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application not built. Please run 'npm run build' first.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
