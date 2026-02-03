import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SecretData, GameSettings, Difficulty } from '../types';
import { STATIC_WORD_POOL } from '../data/wordPool';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-3-flash-preview';

interface WordGenerationResponse {
  word: string;
  category: string;
  imposterHint: string;
}

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    word: {
      type: Type.STRING,
      description: "The secret word for the civilians.",
    },
    category: {
      type: Type.STRING,
      description: "The category or categories the word belongs to.",
    },
    imposterHint: {
      type: Type.STRING,
      description: "A different word related to the secret word but deceptive.",
    },
  },
  required: ["word", "category", "imposterHint"],
};

export const generateSecretData = async (settings: GameSettings): Promise<SecretData> => {
  // 1. Try to find a matching word in the local pool first
  const { categories, difficulty } = settings;
  
  let pool = STATIC_WORD_POOL;

  // Filter by difficulty: Check if the word's difficulty list includes the selected difficulty
  if (difficulty) {
    pool = pool.filter(w => w.difficulties.includes(difficulty));
  }

  // Filter by categories: Check if the word has AT LEAST ONE of the selected categories
  // If no categories selected, we include all.
  if (categories && categories.length > 0) {
    pool = pool.filter(w => w.categories.some(cat => categories.includes(cat)));
  }

  // If we have matches in the pool, pick one randomly
  if (pool.length > 0) {
    const randomIdx = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIdx];
    // Artificial delay to make it feel like "thinking/loading" consistent with AI
    await new Promise(r => setTimeout(r, 800)); 
    
    return {
      word: selected.word,
      // Join categories for display (e.g., "Mutfak, İçecekler")
      category: selected.categories.join(', '), 
      imposterHint: selected.imposterHint
    };
  }

  // 2. If no local match, use Gemini as fallback/generator
  try {
    const categoryPrompt = categories && categories.length > 0 
      ? `Categories must be related to one of: ${categories.join(', ')}.` 
      : "Any general category.";
    
    const difficultyPrompt = `The word should be of ${difficulty} difficulty level for a general audience.`;

    const prompt = `Generate a secret word for a social deduction game. ${categoryPrompt} ${difficultyPrompt} Also provide a deceptive 'imposter hint' word. Language: Turkish.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a Game Master for a party game in Turkish. Pick fun words.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    const data = JSON.parse(text) as WordGenerationResponse;

    return {
      word: data.word,
      category: data.category,
      imposterHint: data.imposterHint
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    // Ultimate fallback
    return {
      word: "Kahve",
      category: "İçecekler",
      imposterHint: "Çay"
    };
  }
};