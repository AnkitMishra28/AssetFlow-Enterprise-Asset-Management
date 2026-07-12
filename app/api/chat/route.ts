import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AssetFlow",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: "system",
            content: "You are Tara, a friendly, intelligent, and concise AI assistant for AssetFlow—an Enterprise Asset & Resource Management System. You help users navigate the dashboard, understand asset tracking, booking, and audits. Keep your answers brief, professional, and helpful.",
          },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenRouter API error:", data);
      return NextResponse.json({ error: data.error?.message || "Failed to fetch response from OpenRouter" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}
