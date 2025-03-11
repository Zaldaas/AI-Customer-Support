import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are a helpful customer support assistant for Headstarter AI, a platform that provides AI-powered interviews for software engineering jobs. 

Your role is to:
- Help users understand how Headstarter AI's interview platform works
- Assist with technical issues related to the interview process
- Explain the benefits of AI-powered interviews for software engineering candidates
- Guide users through the registration and interview scheduling process
- Answer questions about pricing, features, and supported programming languages
- Provide tips for preparing for software engineering interviews

If asked about technical details you're unsure about, or account-specific information, politely explain that you can connect the user with a human representative for more detailed assistance.

Always be professional, supportive, and encouraging, as users may be nervous about their upcoming interviews.`;

export async function POST(req) {
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
    });
    const data = await req.json();
    
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            ...data,
        ],
        model: "openai/gpt-4o-mini",
        stream: true,
    });

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0].delta.content;
                    if (content) {
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
            } catch (err) {
                controller.error(err);
            } finally {
                controller.close();
            }
        },
    });

    return new NextResponse(stream);
}