# SketchTutor AI 🎨

**Live Demo**: [Deploying to Vercel soon...]

This is my submission for the **Thinkly Labs Software Engineering Role**. I chose to build an **AI Art Teacher** because standard chatbot wrappers feel generic and uninspiring. The assignment asked for a chatbot that feels *purpose-built* for a specific subject, and art instruction requires highly specialized UX.

Instead of just chatting via a text box, an art student needs to see reference photos, understand proportions, get tool recommendations, and follow a structured step-by-step process. This chatbot behaves like an experienced art tutor sitting right next to you, watching an active canvas.

## 🎨 Frontend Thinking

The UI was meticulously designed to reflect the focus and usability of a premium art tool, heavily inspired by interfaces like Procreate:

- **Interactive Micro-interactions**: The landing page features a completely custom, draggable Before/After slider built from scratch to showcase transformations intuitively.
- **Loading & Empty States**: The Upload page features a pulsating analysis state with auto-updating progress. The Gallery defaults to a clear, encouraging empty state to guide the user to their first action.
- **Real-time Chat Experience**: The AI tutor chat features a custom `ReadableStream` implementation to stream chunks from the API exactly like a production LLM, complete with contextual typing indicators and auto-scrolling. 
- **Purpose-Built Canvas**: Instead of a static "Chat" screen, the Workspace features a 3-column split view keeping the grid-overlaid reference image, the *interactive live canvas* (built with `react-konva`), and the tutor chat visible simultaneously. You can actually draw on the canvas!
- **Error Handling**: Graceful fallback UI in the chat if the API endpoint fails to respond.

## 🤖 AI Usage

For this build, I used AI heavily to generate the boilerplate Tailwind components, the mock Chat API streaming logic, and the intricate floating grid CSS. Because I directed the AI to solve the specific UX challenges of a drawing app (like the interactive `react-konva` canvas), there is zero "slop"—every component serves a strict functional and aesthetic purpose.

## 🚀 How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **View the app**:
   Open [http://localhost:3000](http://localhost:3000)

## 📁 Key Files to Review

* `src/app/api/chat/route.ts`: Purpose-built mock streaming LLM backend.
* `src/components/AIChat.tsx`: Consumes the stream with auto-scrolling and typing states.
* `src/components/StepCanvas.tsx`: Interactive freehand drawing tool.
* `src/components/ImageComparison.tsx`: Custom draggable before/after slider.

---
Built with Next.js 15, React 19, Tailwind CSS v4, shadcn/ui, and React-Konva.
