import { GoogleGenAI, Type } from "@google/genai";
import { CVData, ATSResult } from './types';

// Use Vite's environment variable syntax
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize AI only if API key exists
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function analyzeATS(cvData: CVData, jobDescription: string): Promise<ATSResult> {
    const model = "gemini-2.5-flash";

    // Check if API key is configured
    if (!ai) {
        throw new Error("Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.");
    }

    const prompt = `
        Analyze the following CV data against the provided job description.
        Provide a detailed analysis in JSON format according to the specified schema.

        CV Data:
        ${JSON.stringify(cvData, null, 2)}

        Job Description:
        ${jobDescription}
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: {
                            type: Type.NUMBER,
                            description: "A compatibility score from 0 to 100 representing how well the CV matches the job description."
                        },
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Actionable suggestions to improve the CV for this specific job."
                        },
                        keywordMatch: {
                            type: Type.OBJECT,
                            properties: {
                                matched: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING },
                                    description: "Keywords from the job description found in the CV."
                                },
                                missing: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING },
                                    description: "Important keywords from the job description that are missing from the CV."
                                }
                            }
                        }
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result;

    } catch (error) {
        console.error("Error analyzing ATS:", error);
        throw new Error("Failed to get analysis from AI. Please check the job description and try again.");
    }
}

export async function processText(text: string, action: 'expand' | 'shorten' | 'rephrase', context: 'summary' | 'experience description'): Promise<string> {
    const model = "gemini-2.5-flash";
    
    // Check if API key is configured
    if (!ai) {
        throw new Error("Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.");
    }

    let instruction = '';
    let contextText = '';
    
    switch(context) {
        case 'summary':
            contextText = 'CV summary';
            break;
        case 'experience description':
            contextText = 'CV work experience description';
            break;
    }

    switch (action) {
        case 'expand':
            instruction = `Expand on the following ${contextText}, adding more professional detail, metrics, and context. Keep the tone professional.`;
            break;
        case 'shorten':
            instruction = `Shorten the following ${contextText} to be more concise and punchy, while retaining the key information and impact.`;
            break;
        case 'rephrase':
            instruction = `Rephrase the following paragraph to sound more professional and impactful for a ${contextText}. Focus on action verbs and achievements.`;
            break;
    }

    const prompt = `${instruction}\n\nParagraph:\n"${text}"`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                 systemInstruction: "You are an expert CV writer's assistant. You only output the requested text modification, with no extra conversation, preamble, or markdown formatting. Just return the raw text.",
            }
        });
        
        return response.text.trim();

    } catch (error) {
        console.error(`Error processing text with action "${action}":`, error);
        throw new Error("Failed to get suggestion from AI. Please try again.");
    }
}
