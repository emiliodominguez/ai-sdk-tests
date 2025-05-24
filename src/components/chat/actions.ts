"use server";

import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { type CoreMessage, type CoreSystemMessage, streamText } from "ai";

const lmStudio = createOpenAICompatible({
	name: "lmstudio",
	baseURL: process.env.LM_STUDIO_SERVER_URL,
});

/**
 * Streams a response from the language model based on the provided messages and optional system message.
 * @param args - An object containing the following properties:
 *   @param args.messages - An array of messages objects representing the conversation history.
 *   @param args.system - (Optional) A system message to provide instructions to the model.
 * @returns A promise that resolves to a readable stream containing the text response from the model.
 */
export async function streamResponse(args: { messages: CoreMessage[]; system?: CoreSystemMessage }): Promise<ReadableStream<string>> {
	const result = streamText({
		model: lmStudio(process.env.LM_STUDIO_MODEL_ID),
		messages: [args.system, ...args.messages].filter(Boolean) as CoreMessage[],
		temperature: 0.5,
	});

	return result.textStream;
}
