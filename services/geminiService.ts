import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to remove data:image/...;base64, prefix
const cleanBase64 = (base64Data: string) => {
  return base64Data.split(',')[1] || base64Data;
};

export const editImageWithGemini = async (
  base64Image: string,
  prompt: string,
  mimeType: string = 'image/jpeg'
): Promise<string | null> => {
  try {
    const ai = getAiClient();
    const cleanData = cleanBase64(base64Image);

    // Using gemini-2.5-flash-image (alias: nano banana) for image editing/generation
    const model = 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanData,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      // Note: responseMimeType is not supported for nano banana series models
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           // Return formatted data URL
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;

  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw error;
  }
};