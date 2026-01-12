import { type AIMode } from "../../components/board/AIAssistanceToggle";
import { getUserApiKey } from "../services/apiKeyService";

// Get API key from Supabase (user's key), localStorage, or environment variable (default)
async function getApiKey(): Promise<string> {
    // Try Supabase first
    try {
        const supabaseKey = await getUserApiKey();
        if (supabaseKey) return supabaseKey;
    } catch (e) {
        // Supabase fetch failed, continue to fallbacks
    }

    // Fallback to localStorage
    const localKey = localStorage.getItem("gemini_api_key");
    if (localKey) return localKey;

    // Final fallback to env variable
    return import.meta.env.VITE_GEMINI_API_KEY || "";
}

const GEMINI_TEXT_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const GEMINI_VISION_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent";

// Mode-specific system prompts
const MODE_PROMPTS: Record<Exclude<AIMode, "off" | "generate">, string> = {
    feedback: `You are an expert teacher and mentor. Analyze the whiteboard content and provide constructive feedback.
Focus on:
- What's done well
- Areas for improvement
- Clarity and organization
- Any errors or misconceptions
Be encouraging but honest. Keep your response concise and actionable.`,

    suggest: `You are a creative collaborator. Analyze the whiteboard content and suggest improvements.
Focus on:
- Ideas to expand on the current work
- Missing elements that could strengthen it
- Alternative approaches
- Next steps to consider
Be creative and inspiring. Keep suggestions practical and specific.`,

    solve: `You are a friendly tutor helping solve problems. Analyze the whiteboard and solve any math problems or questions shown.

IMPORTANT: Use plain text only. NO LaTeX, NO dollar signs ($), NO backslash commands.
- Write "÷" not "\\div"
- Write "×" not "\\times"  
- Write "=" not "$=$"
- Write answers clearly like "Answer: 9" not "\\boxed{9}"

Show your work step by step like handwritten notes:
1. First, identify the problem
2. Show each step clearly with plain numbers and symbols
3. Write the final answer simply

Example format:
"6 ÷ 2 × (1 + 2)
Step 1: Solve parentheses first: 1 + 2 = 3
Step 2: Now we have: 6 ÷ 2 × 3
Step 3: Work left to right: 6 ÷ 2 = 3
Step 4: Then: 3 × 3 = 9
Answer: 9"`,
};

export interface AIResponse {
    success: boolean;
    content?: string;
    error?: string;
}

export async function analyzeCanvas(
    imageBase64: string,
    mode: Exclude<AIMode, "off" | "generate">
): Promise<AIResponse> {
    const apiKey = await getApiKey();
    if (!apiKey) {
        return {
            success: false,
            error: "Gemini API key not configured. Please add your API key in Settings.",
        };
    }

    try {
        const response = await fetch(`${GEMINI_VISION_URL}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: MODE_PROMPTS[mode] + "\n\nAnalyze this whiteboard image:"
                        },
                        {
                            inline_data: {
                                mime_type: "image/png",
                                data: imageBase64
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("[Gemini] API Error:", errorData);
            return {
                success: false,
                error: `API Error: ${response.status} - ${errorData?.error?.message || "Unknown error"}`,
            };
        }

        const data = await response.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) {
            return {
                success: false,
                error: "No response generated. The canvas may be empty or unclear.",
            };
        }

        return {
            success: true,
            content,
        };
    } catch (error) {
        console.error("[Gemini] Request failed:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to connect to Gemini API",
        };
    }
}

// Check if Gemini is configured
export function isGeminiConfigured(): boolean {
    // Check localStorage first for immediate result
    const localKey = localStorage.getItem("gemini_api_key");
    if (localKey) return true;

    // Check env variable
    return Boolean(import.meta.env.VITE_GEMINI_API_KEY);
}

// Generate shapes from text prompt
export async function generateFromText(prompt: string): Promise<AIResponse> {
    const apiKey = await getApiKey();
    if (!apiKey) {
        return {
            success: false,
            error: "Gemini API key not configured.",
        };
    }

    const systemPrompt = `You are a drawing assistant. Generate simple shapes to draw based on user's request.

Return ONLY a JSON array of shape commands. Available shapes:
- rectangle: {type: "rectangle", x, y, width, height, color}
- ellipse: {type: "ellipse", x, y, width, height, color}  
- text: {type: "text", x, y, text, color}
- arrow: {type: "arrow", x, y, endX, endY, color}
- line: {type: "line", x, y, endX, endY, color}

Use coordinates relative to center (0,0). Keep it simple with basic shapes.
Colors: "black", "blue", "red", "green", "orange", "violet"

Return ONLY the JSON array, no explanation.`;

    try {
        const response = await fetch(`${GEMINI_TEXT_URL}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: systemPrompt + `\n\nDraw: ${prompt}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                error: `API Error: ${response.status} - ${errorData?.error?.message || "Unknown error"}`,
            };
        }

        const data = await response.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        return content ? { success: true, content } : { success: false, error: "No response generated" };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Generation failed",
        };
    }
}

// Generate shapes from image (recreate image as shapes)
export async function generateFromImage(imageBase64: string): Promise<AIResponse> {
    const apiKey = await getApiKey();
    if (!apiKey) {
        return {
            success: false,
            error: "Gemini API key not configured.",
        };
    }

    const prompt = `Analyze this image and recreate it using simple geometric shapes.

Return ONLY a JSON array of shape commands:
- rectangle: {type: "rectangle", x, y, width, height, color}
- ellipse: {type: "ellipse", x, y, width, height, color}
- text: {type: "text", x, y, text, color}
- arrow: {type: "arrow", x, y, endX, endY, color}
- line: {type: "line", x, y, endX, endY, color}

Coordinates are relative to center (0,0). Approximate the image with basic shapes.
Colors: "black", "blue", "red", "green", "orange", "violet"

Return ONLY the JSON array.`;

    try {
        const response = await fetch(`${GEMINI_VISION_URL}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "image/png", data: imageBase64 } }
                    ]
                }],
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 1024,
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                error: `API Error: ${response.status} - ${errorData?.error?.message || "Unknown error"}`,
            };
        }

        const data = await response.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        return content ? { success: true, content } : { success: false, error: "No response generated" };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Generation failed",
        };
    }
}
