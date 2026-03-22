import OpenAI, { toFile } from "openai";

const IMAGE_EDIT_MODEL = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";
/** Mini only supports low fidelity — prefer gpt-image-1 or gpt-image-1.5 for `input_fidelity: high`. */

const EDIT_PROMPT = `Using this exact reference portrait, create ONE wide horizontal image: a professional pencil-drawing tutorial sheet on clean white paper.

CRITICAL — IDENTITY: The same real person as the reference must appear in all four panels (same face shape, eyes, nose, lips, brows, hair, skin tone, age). Do not invent a different face. Match the reference subject closely.

LAYOUT: Exactly four equal vertical columns, left to right, like a printed art-class handout. Thin gaps or light lines between columns are OK.

Column 1 (left): Stage 1 — Basic head construction: circle/oval cranium + jaw; vertical centerline; horizontal eye line; very light graphite; guidelines visible.

Column 2: Stage 2 — Refine structure: jaw, cheekbones; eye line, nose line, mouth guidelines; construction lines still clearly visible.

Column 3: Stage 3 — Detailed sketch: eyes, nose, lips, eyebrows, ears; hair outline; darker pencil lines; faint construction still visible.

Column 4 (right): Stage 4 — Finished realistic graphite portrait for THIS person: full shading, depth, smooth academic pencil; guidelines removed or blended away.

STYLE: Monochrome graphite pencil only, no color, no photo, no halftone noise, no digital static. Clean instructional drawing guide.`;

/**
 * Uses OpenAI **image edit** (gpt-image-1 family) with the uploaded photo so facial
 * features stay tied to the reference (`input_fidelity: high`).
 */
export async function generateOpenAiTutorialStrip(image: Buffer, mime: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const openai = new OpenAI({ apiKey });
  const ext =
    mime.includes("jpeg") || mime.includes("jpg") ? "jpg" : mime.includes("webp") ? "webp" : "png";
  const filename = `reference.${ext}`;
  const uploadable = await toFile(image, filename, { type: mime || "image/png" });

  const useHighFidelity = !IMAGE_EDIT_MODEL.includes("mini");

  const result = await openai.images.edit({
    model: IMAGE_EDIT_MODEL,
    image: uploadable,
    prompt: EDIT_PROMPT,
    size: "1536x1024",
    quality: "high",
    background: "opaque",
    ...(useHighFidelity ? { input_fidelity: "high" as const } : {}),
  });

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("OpenAI returned no image data");
  }

  return `data:image/png;base64,${b64}`;
}
