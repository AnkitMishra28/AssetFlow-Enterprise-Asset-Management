import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { stats } = await req.json();

    const systemPrompt = `You are a Senior Data Analyst for AssetFlow. The user is asking you to generate an executive monthly report based on the provided JSON stats.
    
    Stats: ${JSON.stringify(stats)}

    Rules:
    - Write a highly professional, beautifully formatted Markdown report.
    - Include specific insights like "Maintenance increased by X%", "Furniture utilization dropped by Y%", "Electronics have the highest failure rate", etc. (Infer these logically from the data).
    - Use H2/H3 headers, bullet points, and bold text for key metrics.
    - Keep it concise but insightful. Do not output raw JSON, only the final report.`;

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
            content: systemPrompt,
          },
          {
            role: "user",
            content: "Generate monthly report",
          }
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenRouter API error:", data);
      return NextResponse.json({ error: data.error?.message || "Failed to fetch response" }, { status: response.status });
    }

    return NextResponse.json({ report: data.choices[0].message.content });
  } catch (error) {
    console.error("Error generating AI report:", error);
    return NextResponse.json({ error: "Failed to generate AI report" }, { status: 500 });
  }
}
