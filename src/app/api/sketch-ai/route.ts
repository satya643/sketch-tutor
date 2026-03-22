import { NextResponse } from "next/server";
import { assertImageSize, parseImageBase64 } from "@/lib/sketch-ai/image-buffer";
import { friendlyOpenAiError } from "@/lib/sketch-ai/openai-errors";
import { generateOpenAiTutorialStrip } from "@/lib/sketch-ai/openai-tutorial";

export const maxDuration = 180;

export async function GET() {
  return NextResponse.json({
    providers: {
      openai: Boolean(process.env.OPENAI_API_KEY),
    },
  });
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Add OPENAI_API_KEY to .env.local" },
        { status: 503 }
      );
    }

    const body = (await req.json()) as { imageBase64?: string; mode?: string };
    const { imageBase64, mode } = body;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "imageBase64 required" }, { status: 400 });
    }

    const { mime, buffer } = parseImageBase64(imageBase64);
    assertImageSize(buffer);

    if (mode === "openai_tutorial" || mode === undefined) {
      const stripBase64 = await generateOpenAiTutorialStrip(buffer, mime);
      return NextResponse.json({ stripBase64 });
    }

    return NextResponse.json({ error: "Unknown mode" }, { status: 400 });
  } catch (e) {
    console.error("[sketch-ai]", e);
    const { message, status } = friendlyOpenAiError(e);
    return NextResponse.json({ error: message }, { status });
  }
}
