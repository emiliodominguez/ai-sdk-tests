import { type NextRequest, NextResponse } from "next/server";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { type CoreMessage, streamText } from "ai";

import { assistantSystemMessage } from "./system-roles";

const lmStudio = createOpenAICompatible({
	name: "lmstudio",
	baseURL: "http://localhost:1234/v1"
});

const encoder = new TextEncoder();
const useSystemRoles = false;

export async function POST(req: NextRequest): Promise<NextResponse> {
	const { /* prompt, */ messages } = await req.json();

	const result = await streamText({
		model: lmStudio("llama-3.2-3b-instruct"),
		messages: useSystemRoles ? getSystemRoleMessage(messages) : messages
		// prompt,
	});

	const stream = new ReadableStream({
		async start(controller) {
			for await (const chunk of result.textStream) {
				controller.enqueue(encoder.encode(chunk));
			}

			controller.close();
		}
	});

	return new NextResponse(stream);
	// Alternative (currently not working, most likely an implementation error on my end)
	// return result.toDataStreamResponse();
}

/**
 * Adds the system role message to the messages array
 * @param messages The messages array
 * @returns The messages array with the system role message
 */
function getSystemRoleMessage(messages: CoreMessage[]): CoreMessage[] {
	const hasSystemMessage = messages[0]?.role === "system";

	return hasSystemMessage ? messages : [assistantSystemMessage, ...messages];
}
