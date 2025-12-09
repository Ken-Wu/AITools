import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Tool } from "../types";

// Helper to sanitize the tool list for the prompt to save tokens/complexity
const sanitizeToolsForPrompt = (tools: Tool[]) => {
  return tools.map(t => ({
    id: t.id,
    name: t.name,
    description: t.description,
    tags: t.tags.join(', '),
    category: t.category
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

export const generateIconWithGemini = async (name: string, description: string): Promise<string | null> => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Create a simple, modern, minimalist square app icon for an AI tool named "${name}". The tool does: ${description}. Flat design, high contrast, suitable for a favicon.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      // Note: responseMimeType is not supported for gemini-2.5-flash-image
    });

    // Extract image from response parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating icon with Gemini:", error);
    return null;
  }
};

export const createToolChatSession = (tools: Tool[]): Chat | null => {
  if (!process.env.API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const simplifiedTools = sanitizeToolsForPrompt(tools);

  const systemInstruction = `
    You are the AI Concierge for AI ToolHub.
    Your goal is to help users find the best AI tools from our directory.
    
    Here is the current list of available tools in our database:
    ${JSON.stringify(simplifiedTools)}
    
    Rules:
    1. Only recommend tools from this list if possible. If the user asks for something we don't have, apologize and say we don't have it yet, but suggest the closest alternative from the list if any.
    2. Be concise, friendly, and professional.
    3. If a user asks general AI questions, you can answer them, but try to tie it back to tools in the directory.
    4. When mentioning a tool, use its exact name.
    5. Do not hallucinate tools that are not in the provided list.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction
    }
  });
};
