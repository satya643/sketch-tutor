"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Send } from "lucide-react";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

// Convert **bold** and *italic* markdown to HTML
function boldify(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>');
}

export function AIChat({
  originalImage,
  stageImage,
  stageName
}: {
  originalImage?: string | null;
  stageImage?: string | null;
  stageName?: string;
} = {}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "I am your **drawing instructor** for this studio session. The workspace follows a **four-stage pipeline**: gesture and armature, structural block-in, line development, then value and rendering.\n\nBegin with **Stage 1** on the canvas, then ask targeted questions—for example proportional comparison across the major masses, placement of the eye line versus the brow, or how to read the shadow pattern. I will answer with structured, stepwise guidance grounded in observational drawing practice.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAnimationRef = useRef<number | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const start = container.scrollTop;
    const end = container.scrollHeight - container.clientHeight;
    const durationMs = 650;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      container.scrollTop = start + (end - start) * eased;
      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(animate);
      } else {
        scrollAnimationRef.current = null;
      }
    };

    if (scrollAnimationRef.current !== null) {
      cancelAnimationFrame(scrollAnimationRef.current);
    }
    scrollAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      if (scrollAnimationRef.current !== null) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
    };
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    // Add user message
    const newMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Add empty assistant message that we will stream into
    const assistantMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantMsgId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: { originalImage, stageImage, stageName }
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        let detail = text;
        try {
          const j = JSON.parse(text) as { error?: string };
          if (j.error) detail = j.error;
        } catch {
          /* use raw text */
        }
        throw new Error(detail || `Request failed (${res.status})`);
      }
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, content: msg.content + chunk } : msg
            )
          );
        }
      }

      // If stream finished but we got absolutely no content, it's likely a silent API error (like quota exhausted)
      setMessages((prev) => {
        const msg = prev.find(m => m.id === assistantMsgId);
        if (msg && msg.content.trim() === "") {
          return prev.map(m => m.id === assistantMsgId ? { ...m, content: "Oops! credit limit reached ! 😔" } : m);
        }
        return prev;
      });

      setIsTyping(false);
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      const fallback = error instanceof Error ? error.message : "Could not reach the chat service.";

      let displayMessage = fallback;
      if (displayMessage.toLowerCase().includes("quota") || displayMessage.includes("429") || displayMessage.toLowerCase().includes("exhausted")) {
        displayMessage = "Oops! credit limit reached ! 😔";
      } else if (displayMessage.includes("No working API Keys")) {
        displayMessage = "Oops! credit limit reached ! 😔";
      } else {
        // Also handle arbitrary failures where message is blank
        displayMessage = "Oops! Something went wrong! 😔";
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? { ...msg, content: (msg.content.trim() === "" ? displayMessage : msg.content) }
            : msg
        )
      );
    }
  };

  return (
    <div className="flex h-full w-full flex-col rounded-3xl border border-border/60 bg-card/80 backdrop-blur-md shadow-xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4 bg-background/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background"></span>
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold leading-none mb-1 text-foreground">Drawing instructor</h3>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Deep-dive tutoring is active</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 no-scrollbar" ref={scrollRef}>
        <div className="flex flex-col gap-5 min-h-full justify-end pb-2">
          {messages.map((msg) => (
            <div key={msg.id}
              className={`flex w-fit max-w-[88%] animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === "assistant" ? "self-start" : "self-end"
                }`}
            >
              <div className={`px-4 py-3 text-xs shadow-sm leading-relaxed ${msg.role === "assistant"
                ? "bg-muted/80 text-foreground rounded-2xl rounded-tl-sm border border-border/50"
                : "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                }`}>
                {msg.content === "" && msg.role === "assistant" ? (
                  <div className="flex flex-row items-center gap-1 text-muted-foreground animate-pulse h-4 mt-1">
                    <span className="text-xs font-medium italic pr-1">Thinking...</span>
                  </div>
                ) : (
                  <div className="chat-content space-y-2">
                    {msg.content.split('\n').map((line, i) => {
                      const trimmed = line.trim();
                      if (!trimmed) return <div key={i} className="h-1.5" />;

                      // Bullet points (-, *, •)
                      if (/^[-*•]\s/.test(trimmed)) {
                        const text = trimmed.replace(/^[-*•]\s+/, '');
                        return (
                          <div key={i} className="flex gap-2 items-start pl-1">
                            <span className="w-1 h-1 rounded-full bg-current mt-2 shrink-0 opacity-60"></span>
                            <span dangerouslySetInnerHTML={{ __html: boldify(text) }} />
                          </div>
                        );
                      }

                      // Numbered items
                      if (/^\d+[.)]\s/.test(trimmed)) {
                        const num = trimmed.match(/^(\d+)/)?.[1];
                        const text = trimmed.replace(/^\d+[.)]\s+/, '');
                        return (
                          <div key={i} className="flex gap-2 items-start pl-1">
                            <span className="text-primary font-bold text-xs mt-0.5 shrink-0">{num}.</span>
                            <span dangerouslySetInnerHTML={{ __html: boldify(text) }} />
                          </div>
                        );
                      }

                      // Headers (### or ##)
                      if (/^#{1,3}\s/.test(trimmed)) {
                        const text = trimmed.replace(/^#{1,3}\s+/, '');
                        return <div key={i} className="font-bold text-foreground pt-1" dangerouslySetInnerHTML={{ __html: boldify(text) }} />;
                      }

                      return <div key={i} dangerouslySetInnerHTML={{ __html: boldify(trimmed) }} />;
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 pt-2 bg-background/50 border-t border-border/50">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder=""
            className="flex h-12 w-full rounded-2xl border border-border/80 bg-background pl-4 pr-12 text-xs shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isTyping}
          />
          <Button
            type="submit"
            size="icon"
            className={`absolute right-1.5 h-9 w-9 rounded-xl border transition-all ${input.trim() ? "bg-primary text-primary-foreground border-primary/90 shadow-md hover:bg-primary/90" : "bg-muted/80 text-muted-foreground border-border/60"}`}
            disabled={!input.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

