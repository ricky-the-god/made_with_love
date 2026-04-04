import Groq from "groq-sdk";

// Module-level singleton — server-only, never import from client components
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export { groq };
