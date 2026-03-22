# 🎨 SketchTutor AI (SketchMaster)
Visit \`https://sketch-tutor-bt35.vercel.app/` to access the interactive studio!

![Next.js](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

An interactive, AI-powered drawing coach application. SketchTutor AI bridges the gap between passive video tutorials and personalized, real-time instruction.

## 🌟 What I Built

**SketchTutor AI** takes any reference image you upload and automatically generates a professional, 4-stage pencil-drawing tutorial sequence (using highly constrained OpenAI image editing algorithms) showing you how to build the drawing from structural geometry to the final polished shading. 

Alongside the visual pipeline, the platform features **SketchMaster**, a multi-modal, conversational AI chatbot powered by Google Gemini 2.5 Flash-Lite. SketchMaster acts as your positive, adaptive drawing instructor. It natively "*sees*" the reference photo you upload and the exact sketch stage you are currently focusing on, allowing it to provide 100% contextual, step-by-step guidance in a friendly mix of Hindi and English.

### Key Features:
- **Automatic Structural Breakdown:** Instantly converts uploaded portraits/references into 4 sequential drawing stages (Guidelines & Construction $\rightarrow$ Block-ins $\rightarrow$ Line Art $\rightarrow$ Final Rendering).
- **Multi-Modal Vision Chat:** The integrated chat UI passes both the original and generated images to the backend simultaneously. You can ask "how do I draw this eye?" and the AI knows exactly what you are looking at.
- **Smart Fallback API Architecture:** The Node.js Next API routes intelligently balance keys and payloads across Google, OpenAI, and xAI to combat rate-limits gracefully without breaking the user experience.
- **Adaptive Persona:** SketchMaster will break down complex art theories into bite-sized analogies ("jaise roti banate ho"), making art concepts highly accessible to beginners.

---

## 🎯 Why I Picked This Topic

Learning to draw is traditionally a frustrating and solitary experience. Beginners are often overwhelmed by the final result of an artwork because they cannot clearly "see" the underlying geometric structure (the proportions, forms, and values) that holds the piece together. 

I picked this topic because **traditional art fundamentally relies on step-by-step logical deconstruction**, which makes it a perfect use-case for advanced multimodal Generative AI. 

By building this application, I wanted to create an environment where:
1. The intimidation factor of a blank canvas is entirely removed by visually extracting the foundational geometry from the user's specific reference image.
2. The user has an endlessly patient, interactive 1-on-1 coach that doesn't just spew out a generic wall of text, but actively looks at the current stage they are drawing and answers micro-questions conversationally to keep them motivated.

This project sits at the exciting intersection of structured Gen-AI image synthesis and multi-modal conversational context.

## 🚀 Getting Started

**Create a `.env.local` file with the following:**
\`\`\`env
OPENAI_API_KEY=your_openai_key    # Used to generate the 4-stage sketch layout
GOOGLE_GENERATIVE_AI_API_KEY=...  # Used for the Vision Chat AI 
\`\`\`

**Run the local development server:**
\`\`\`cmd
npm install
npm run dev
\`\`\`
Visit \`https://sketch-tutor-bt35.vercel.app/` to access the interactive studio!
--
Built with Next.js 15, React 19, Tailwind CSS v4, shadcn/ui, and React-Konva.
