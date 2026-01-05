
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Language } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateUnits = async (grade: string, publisher: string, subject: string, lang: Language) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `List 5 major units for a ${grade} grade ${subject} textbook published by ${publisher}. Provide titles and short descriptions in ${lang === 'ko' ? 'Korean' : 'English'}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["id", "title", "description"]
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateSlides = async (unitTitle: string, grade: string, lang: Language) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 presentation slides for the unit "${unitTitle}" for a ${grade} grade student. Each slide should have a title and 3 bullet points. Language: ${lang === 'ko' ? 'Korean' : 'English'}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.ARRAY, items: { type: Type.STRING } },
            imagePrompt: { type: Type.STRING }
          },
          required: ["title", "content"]
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const generatePodcastAudio = async (text: string, lang: Language) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Explain this study material like a friendly teacher in a podcast. Use ${lang === 'ko' ? 'Korean' : 'English'}. Content: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: lang === 'ko' ? 'Kore' : 'Zephyr' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const analyzeWrongAnswer = async (base64Image: string, lang: Language) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
        { text: `Analyze this student's wrong answer. Extract the problem, identify the mistake, and provide a correct explanation in ${lang === 'ko' ? 'Korean' : 'English'}.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          correction: { type: Type.STRING }
        },
        required: ["analysis", "correction"]
      }
    }
  });
  return JSON.parse(response.text);
};
