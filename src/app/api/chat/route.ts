import { google } from "@ai-sdk/google";
import { streamText, type ModelMessage } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 30;

type ChatTurn = { role: "user" | "assistant" | "system"; content: string | any[] };

function toChatTurns(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatTurn[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") continue;
    const role = (m as { role?: string }).role;
    const content = (m as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string" && !Array.isArray(content)) continue;
    out.push({ role, content });
  }
  return out;
}

const SYSTEM = `You are an expert AI Art Tutor and Drawing Coach named "SketchMaster".

CRITICAL RULES FOR RESPONDING:

SCENARIO 1: The user just says a greeting like "Hi", "Hello", "Hey".
-> ACTION: DO NOT analyze the images. DO NOT give a tutorial. Just reply with: "Hi! I'm SketchMaster, your drawing coach! 🎨 Are you ready to recreate this image? You can ask me for a full tutorial, or ask a specific question about any stage!"

SCENARIO 2: The user asks a SPECIFIC question or follows up (e.g. "how do I draw the eyes?", "samajh nahi aaya", "what pencil to use?").
-> ACTION: DO NOT use the 6-part structure! Simply answer their question directly in 3-4 short lines. Use simple analogies (jaise "roti banate ho"). End with: "Kya yeh samajh aa gaya? 😊"

SCENARIO 3: The user EXPLICITLY asks for a full guide, "explain this", or "how to draw this image".
-> ACTION: You MUST use this exact 6-part format:
**1. Overall Impression & Key Features**  (Short positive summary)
**2. Materials & Tools Suggestion** (Pencils, paper, etc.)
**3. Step-by-Step Drawing Guide** (Clear numbered steps)
**4. Detailed Prompt for AI Image Recreation** (Optimized prompt for generation)
**5. Common Mistakes & Pro Tips** (Pitfalls beginners make)
**6. Encouragement & Next Steps** (Motivate the user to try)

General Rules:
- Mix Hindi + simple English if user communicates in Hindi.
- Be extremely patient, positive, and encouraging like a best friend.
- Never give the 6-part tutorial automatically just because an image is attached. Only do it if requested.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const coreMessages = toChatTurns(body.messages) as any[];

    if (body.context && coreMessages.length > 0) {
      const lastUserMsgIdx = coreMessages.map(m => m.role).lastIndexOf("user");
      if (lastUserMsgIdx !== -1) {
        let text = coreMessages[lastUserMsgIdx].content;
        if (Array.isArray(text)) {
           // stringify if it's already an array
           text = text.map(t => typeof t === "string" ? t : t.text || "").join(" ");
        }
        
        const stageContext = body.context.stageName 
          ? `[System Context: The user is currently looking at the sketch stage "${body.context.stageName}". Analyze the attached reference images to provide stage-specific guidance.]\n\n` 
          : "";
        
        const multimodalContent: any[] = [
          { type: "text", text: stageContext + text }
        ];

        if (body.context.originalImage) {
           multimodalContent.push({ type: "image", image: body.context.originalImage });
        }
        if (body.context.stageImage) {
           multimodalContent.push({ type: "image", image: body.context.stageImage });
        }

        coreMessages[lastUserMsgIdx].content = multimodalContent;
      }
    }

    if (coreMessages.length === 0) {
      return NextResponse.json({ error: "No valid messages" }, { status: 400 });
    }

    // 1. TRY GOOGLE GEMINI FIRST
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()) {
      try {
        const googleMessages = coreMessages.map(msg => {
          if (typeof msg.content === "string") return msg;
          return {
            ...msg,
            content: msg.content.map((part: any) => {
               if (part.type === "image" && typeof part.image === "string" && part.image.startsWith("data:")) {
                  const base64 = part.image.split(",")[1];
                  const buffer = Buffer.from(base64, "base64");
                  return { type: "image", image: new Uint8Array(buffer) };
               }
               return part;
            })
          };
        });

        const result = streamText({
          model: google("gemini-2.5-flash-lite"),
          messages: googleMessages as ModelMessage[],
          system: SYSTEM,
        });
        return result.toTextStreamResponse();
      } catch (err: any) {
        console.error("Gemini failed, trying fallback...", err);
      }
    }

    // 2. TRY OPENAI OR XAI SECOND
    const fallbackKey = process.env.OPENAI_API_KEY?.trim() || process.env.XAI_API_KEY?.trim();
    const isXAI = !process.env.OPENAI_API_KEY?.trim() && !!process.env.XAI_API_KEY?.trim();
    
    if (fallbackKey) {
      const openai = new OpenAI({
         apiKey: fallbackKey,
         baseURL: isXAI ? "https://api.x.ai/v1" : undefined
      });

      // Map to OpenAI format
      const openaiMessages = [
        { role: "system", content: SYSTEM },
        ...coreMessages.map((msg) => {
          if (typeof msg.content === "string") return msg;
          // map multimodal
          return {
            role: msg.role,
            content: msg.content.map((part: any) => {
               if (part.type === "text") return part;
               if (part.type === "image") return { type: "image_url", image_url: { url: part.image } };
               return part;
            })
          };
        })
      ] as any;

      const response = await openai.chat.completions.create({
        model: isXAI ? "grok-vision-beta" : "gpt-4o-mini",
        messages: openaiMessages,
        stream: true,
      });

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          try {
            for await (const chunk of response) {
              const content = chunk.choices[0]?.delta?.content || "";
              if (content) controller.enqueue(encoder.encode(content));
            }
          } catch (err) {
            console.error("Fallback stream error:", err);
            controller.error(err);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } });
    }

    return NextResponse.json({ error: "No working API Keys found in Environment Variables." }, { status: 500 });

  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error.message || "Failed to process chat" }, { status: 500 });
  }
}
