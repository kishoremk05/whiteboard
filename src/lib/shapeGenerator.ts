import { Editor } from "tldraw";

// Shape types that AI can generate
interface ShapeCommand {
    type: "rectangle" | "ellipse" | "line" | "arrow" | "text";
    x: number;
    y: number;
    width?: number;
    height?: number;
    text?: string;
    color?: string;
    endX?: number;
    endY?: number;
}

// Parse AI response to extract shape commands
export function parseShapeCommands(aiResponse: string): ShapeCommand[] {
    try {
        let jsonStr = aiResponse;

        // Remove markdown code blocks
        jsonStr = jsonStr.replace(/```json\s*/gi, "").replace(/```\s*/g, "");

        // Try to find JSON array in response
        const arrayMatch = jsonStr.match(/\[[\s\S]*?\]/);
        if (arrayMatch) {
            jsonStr = arrayMatch[0];
        }

        // Clean up common JSON issues
        jsonStr = jsonStr
            .replace(/,\s*]/g, "]")  // Remove trailing commas
            .replace(/,\s*}/g, "}")  // Remove trailing commas in objects
            .replace(/'/g, '"')       // Replace single quotes
            .trim();

        // Try parsing
        let parsed;
        try {
            parsed = JSON.parse(jsonStr);
        } catch {
            // Try extracting individual objects if array parse fails
            const objectMatches = jsonStr.match(/\{[^{}]*\}/g);
            if (objectMatches) {
                parsed = objectMatches.map(obj => {
                    try { return JSON.parse(obj); } catch { return null; }
                }).filter(Boolean);
            } else {
                throw new Error("No valid JSON objects found");
            }
        }

        const shapes = Array.isArray(parsed) ? parsed : parsed.shapes || [parsed];

        // Validate and normalize shapes
        return shapes.filter((s: ShapeCommand) =>
            s && s.type && typeof s.x === "number" && typeof s.y === "number"
        ).map((s: ShapeCommand) => ({
            type: s.type,
            x: s.x,
            y: s.y,
            width: s.width || 100,
            height: s.height || 100,
            text: s.text || "",
            color: s.color || "black",
            endX: s.endX,
            endY: s.endY,
        }));
    } catch (error) {
        console.error("[ShapeGenerator] Failed to parse AI response:", error);
        console.log("[ShapeGenerator] Raw response:", aiResponse);
        return [];
    }
}

// Insert shapes on the canvas
export function insertShapesOnCanvas(
    editor: Editor,
    shapes: ShapeCommand[],
    offsetX: number = 0,
    offsetY: number = 0
): number {
    if (!editor || shapes.length === 0) return 0;

    const center = editor.getViewportScreenCenter();
    let insertedCount = 0;

    // Spacing multiplier to prevent overlapping (AI uses small coordinates)
    const SPACING = 2;

    try {
        for (const shape of shapes) {
            // Apply spacing multiplier to prevent overlapping
            const x = center.x + (shape.x * SPACING) + offsetX;
            const y = center.y + (shape.y * SPACING) + offsetY;

            switch (shape.type) {
                case "rectangle":
                    editor.createShape({
                        type: "geo",
                        x,
                        y,
                        props: {
                            w: shape.width || 100,
                            h: shape.height || 80,
                            geo: "rectangle",
                            color: shape.color || "black",
                        },
                    });
                    insertedCount++;
                    break;

                case "ellipse":
                    editor.createShape({
                        type: "geo",
                        x,
                        y,
                        props: {
                            w: shape.width || 80,
                            h: shape.height || 80,
                            geo: "ellipse",
                            color: shape.color || "black",
                        },
                    });
                    insertedCount++;
                    break;

                case "text":
                    if (shape.text) {
                        const richText = {
                            type: "doc",
                            content: [{ type: "paragraph", content: [{ type: "text", text: shape.text }] }]
                        };
                        editor.createShape({
                            type: "text",
                            x,
                            y,
                            props: {
                                richText,
                                color: shape.color || "black",
                                size: "m",
                                font: "draw",
                                textAlign: "middle",
                                scale: 1,
                                autoSize: true,
                            },
                        });
                        insertedCount++;
                    }
                    break;

                case "arrow":
                case "line":
                    editor.createShape({
                        type: "arrow",
                        x,
                        y,
                        props: {
                            start: { x: 0, y: 0 },
                            end: { x: shape.endX || shape.width || 100, y: shape.endY || 0 },
                            color: shape.color || "black",
                            arrowheadEnd: shape.type === "arrow" ? "arrow" : "none",
                        },
                    });
                    insertedCount++;
                    break;
            }
        }

        return insertedCount;
    } catch (error) {
        console.error("[ShapeGenerator] Error inserting shapes:", error);
        return insertedCount;
    }
}

// Helper to get shape generation prompt
export function getShapeGenerationPrompt(userPrompt: string): string {
    return `You are a drawing assistant. Generate simple shapes to draw: "${userPrompt}"

Return ONLY a JSON array of shape commands. Available shapes:
- rectangle: {type: "rectangle", x, y, width, height, color}
- ellipse: {type: "ellipse", x, y, width, height, color}  
- text: {type: "text", x, y, text, color}
- arrow: {type: "arrow", x, y, endX, endY, color}
- line: {type: "line", x, y, endX, endY, color}

Use coordinates relative to center (0,0). Keep it simple with basic shapes.
Colors: "black", "blue", "red", "green", "orange", "violet"

Example for "draw a house":
\`\`\`json
[
  {"type": "rectangle", "x": -50, "y": 0, "width": 100, "height": 80, "color": "black"},
  {"type": "rectangle", "x": -20, "y": 40, "width": 30, "height": 40, "color": "blue"},
  {"type": "line", "x": -60, "y": 0, "endX": 0, "endY": -50, "color": "black"},
  {"type": "line", "x": 0, "y": -50, "endX": 60, "endY": 50, "color": "black"}
]
\`\`\`

Now generate shapes for: "${userPrompt}"`;
}

// Helper to get image recreation prompt
export function getImageRecreationPrompt(): string {
    return `Analyze this image and describe how to recreate it using simple shapes.

Return ONLY a JSON array of shape commands to recreate this image. Available shapes:
- rectangle: {type: "rectangle", x, y, width, height, color}
- ellipse: {type: "ellipse", x, y, width, height, color}
- text: {type: "text", x, y, text, color}
- arrow: {type: "arrow", x, y, endX, endY, color}
- line: {type: "line", x, y, endX, endY, color}

Use coordinates relative to center (0,0). Approximate the image with basic geometric shapes.
Colors: "black", "blue", "red", "green", "orange", "violet"

Return ONLY the JSON array, no other text.`;
}
