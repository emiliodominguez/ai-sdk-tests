import { type NextRequest, NextResponse } from "next/server";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText } from "ai";

const lmStudio = createOpenAICompatible({
	name: "lmstudio",
	baseURL: "http://localhost:1234/v1",
});

const encoder = new TextEncoder();

export async function POST(req: NextRequest): Promise<NextResponse> {
	const { /* prompt, */ messages, system } = await req.json();

	const result = await streamText({
		model: lmStudio("meta-llama-3.1-8b-instruct"),
		messages: system ? [system, ...messages] : messages,
		// prompt,
	});

	const stream = new ReadableStream({
		async start(controller) {
			for await (const chunk of result.textStream) {
				controller.enqueue(encoder.encode(chunk));
			}

			controller.close();
		},
	});

	return new NextResponse(stream);
	// Alternative (currently not working, most likely an implementation error on my end)
	// return result.toDataStreamResponse();
}
