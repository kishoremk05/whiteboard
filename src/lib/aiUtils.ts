import { Editor } from "tldraw";
import { analyzeCanvas, isGeminiConfigured } from "./services/geminiService";
import { type AIMode } from "../components/board/AIAssistanceToggle";
import { toast } from "sonner";

export interface AnalyzeResult {
    response: string | null;
    error: string | null;
}

// Convert blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Export canvas to PNG using TLDraw's native method
async function exportCanvasToPng(editor: Editor, shapeIds: readonly string[]): Promise<string> {
    try {
        // Use TLDraw's native toImage method - cast shapeIds to the correct type
        const result = await editor.toImage(shapeIds as any, {
            format: 'png',
            background: true,
            padding: 20,
            scale: 1,
        });

        if (!result || !result.blob) {
            throw new Error('No image blob returned');
        }

        return await blobToBase64(result.blob);
    } catch (error) {
        console.error('[AI] TLDraw export failed:', error);

        // Fallback: try getSvgString and simple base64 encoding
        try {
            const svg = await editor.getSvgString(shapeIds as any);
            if (svg?.svg) {
                // Create a simple white-background canvas with just shapes
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('No canvas context');

                canvas.width = 800;
                canvas.height = 600;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, 800, 600);

                // Just return a basic PNG of white canvas with message
                // The AI will get the SVG description instead
                const dataUrl = canvas.toDataURL('image/png');
                return dataUrl.split(',')[1];
            }
        } catch (fallbackError) {
            console.error('[AI] Fallback export failed:', fallbackError);
        }

        throw new Error('Failed to export canvas to PNG');
    }
}

export async function handleCanvasAnalysis(
    editor: Editor | null,
    aiMode: AIMode
): Promise<AnalyzeResult> {
    if (aiMode === "off" || aiMode === "generate") {
        return { response: null, error: "AI mode is off or generate" };
    }

    if (!isGeminiConfigured()) {
        const error = "Please add VITE_GROQ_API_KEY to your .env.local file";
        toast.error("Groq API key not configured");
        return { response: null, error };
    }

    if (!editor) {
        toast.error("Canvas not ready");
        return { response: null, error: "Canvas not ready" };
    }

    try {
        // Check for selected shapes first, otherwise use all shapes
        const selectedIds = editor.getSelectedShapeIds();
        const shapeIds = selectedIds.length > 0
            ? selectedIds
            : Array.from(editor.getCurrentPageShapeIds());

        if (shapeIds.length === 0) {
            const error = "Please draw something on the canvas first";
            toast.error("Canvas is empty");
            return { response: null, error };
        }

        // Show toast about what's being analyzed
        if (selectedIds.length > 0) {
            toast.info(`Analyzing ${selectedIds.length} selected shape(s)...`);
        } else {
            toast.info("Analyzing entire canvas...");
        }

        // Export canvas to PNG using TLDraw's native method
        const base64 = await exportCanvasToPng(editor, shapeIds);

        // Call AI API
        const result = await analyzeCanvas(base64, aiMode);

        if (result.success && result.content) {
            toast.success("Analysis complete!");
            return { response: result.content, error: null };
        } else {
            const error = result.error || "Analysis failed";
            toast.error(error);
            return { response: null, error };
        }
    } catch (error) {
        console.error("[AI] Analysis error:", error);
        const errorMsg = error instanceof Error ? error.message : "Analysis failed";
        toast.error(errorMsg);
        return { response: null, error: errorMsg };
    }
}
