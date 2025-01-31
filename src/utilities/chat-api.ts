import type { CoreMessage, CoreSystemMessage } from "ai";

/**
 * Streams the chat response from the server
 * @param prompt The user prompt
 * @param messages The messages array
 * @param onData The callback to call when new data is received
 * @param onFinish The callback to call when the stream is finished
 */
export async function streamChatResponse(args: {
	prompt: string;
	messages: CoreMessage[];
	system?: CoreSystemMessage;
	onData: (data: string) => void | Promise<void>;
	onFinish?: () => void | Promise<void>;
	onError?: (error: Error) => void | Promise<void>;
}): Promise<void> {
	try {
		const response = await fetch("/api/chat", {
			method: "POST",
			body: JSON.stringify({
				prompt: args.prompt,
				messages: args.messages,
				system: args.system
			}),
			headers: {
				"Content-Type": "application/json"
			}
		});

		if (!response.body) {
			console.error("Response body is null");

			return args.onError?.(new Error("Response body is null"));
		}

		const reader = response.body.getReader();

		if (!reader) {
			console.error("Reader is null");

			return args.onError?.(new Error("Reader is null"));
		}

		const textDecoder = new TextDecoder();

		while (true) {
			const { done, value } = await reader.read();

			if (done) {
				await args.onFinish?.();
				break;
			}

			await args.onData(textDecoder.decode(value));
		}
	} catch (error) {
		console.error("Error while streaming response:", error);
		await args.onError?.(error as Error);
	}
}
