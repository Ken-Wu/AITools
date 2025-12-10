import { GoogleGenAI, Type } from "@google/genai";
import { Tool } from "../types";

// Helper to sanitize the tool list for the prompt to save tokens/complexity
const sanitizeToolsForPrompt = (tools: Tool[]) => {
  return tools.map(t => ({
    id: t.id,
    name: t.name,
    description: t.description,
    tags: t.tags.join(', ')
  }));
};

export const searchToolsWithGemini = async (query: string, allTools: Tool[]): Promise<string[]> => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing.");
    return [];
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const simplifiedTools = sanitizeToolsForPrompt(allTools);
    
    const systemInstruction = `
      You are an AI tool recommendation engine. 
      You will receive a user query and a list of available AI tools (id, name, description, tags).
      Your goal is to identify which tools from the list best match the user's intent.
      Return ONLY a JSON object containing an array of matching tool IDs.
      If no tools match significantly, return an empty array.
      Be lenient with matching; if a user asks for "art", match "image" tools.
    `;

    const prompt = `
      User Query: "${query}"
      
      Available Tools:
      ${JSON.stringify(simplifiedTools, null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            toolIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) return [];

    const parsed = JSON.parse(resultText);
    return parsed.toolIds || [];

  } catch (error) {
    console.error("Error searching with Gemini:", error);
    return [];
  }
};