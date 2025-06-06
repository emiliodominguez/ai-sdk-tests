"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { CoreMessage, CoreSystemMessage } from "ai";

import { useLLMConfiguration } from "@/contexts/configuration";
// import { useSpeechSynthesis } from "@/contexts/speech-synthesis";
import { className, generateRandomId } from "@/utilities/helpers";
import { Pencil, TrashCan } from "@/utilities/icons";

import { MarkdownRenderer, Button } from "../ui";
import styles from "./chat.module.scss";
import { streamResponse } from "./actions";

type Message = CoreMessage & { id: number };

const localStorageKey = "chat_messages";

export function Chat() {
	const chatRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const [prompt, setPrompt] = useState<string>("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [isStreaming, startStreaming] = useTransition();
	const { systemRole } = useLLMConfiguration();
	// const speechDebounceId = useRef<number | null>(null);
	// const { speak } = useSpeechSynthesis();

	/**
	 * Handles the form submission
	 * @param e The form event
	 */
	function submitChatMessage(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (isStreaming) return;

		const formData = new FormData(e.currentTarget);
		const promptValue = formData.get("prompt") as string;

		if (!promptValue) return;

		// Clear the prompt
		e.currentTarget.reset();

		setPrompt("");

		// Set the streaming flag to true
		startStreaming(async () => {
			// Scroll to bottom when the user sends a message
			scrollToBottom();

			// Creates a new response entry
			const id = generateRandomId();
			const updatedMessages: Message[] = [
				...messages,
				// User prompt
				{ id, role: "user", content: promptValue },
				// Assistant response
				{ id, role: "assistant", content: "" },
			];

			const textStream = await streamResponse({ system: systemRole, messages: updatedMessages });
			const reader = textStream.getReader();

			setMessages(updatedMessages);

			while (true) {
				const { done, value } = await reader.read();

				if (done) break;

				setMessages((prevMessages) =>
					prevMessages.map((message) => {
						if (message.id === id && message.role === "assistant") {
							console.log(message.content + value);
							const updatedContent = message.content + value;

							// clearTimeout(speechDebounceId.current as number);

							// speechDebounceId.current = window.setTimeout(() => {
							// 	speak(updatedContent);
							// }, 250);

							// Scroll to bottom as new messages are added
							scrollToBottom();

							return { ...message, content: updatedContent };
						}

						return message;
					}),
				);
			}
		});
	}

	/**
	 * Deletes a chat message
	 * @param id The message ID
	 */
	function deleteChatMessage(id: number) {
		setMessages((prevMessages) => {
			const index = prevMessages.findIndex((message) => message.id === id);

			return index === -1 ? prevMessages : prevMessages.filter((message) => message.id !== id);
		});
	}

	/**
	 * Scrolls to the bottom of the chat
	 * @param options The scroll options
	 */
	function scrollToBottom(options?: ScrollToOptions): void {
		chatRef.current?.scrollTo({
			top: chatRef.current.scrollHeight,
			behavior: "smooth",
			...options,
		});
	}

	useEffect(() => {
		// Load messages from local storage
		const storedMessages = localStorage.getItem(localStorageKey);

		if (storedMessages) {
			setMessages(JSON.parse(storedMessages));
		}

		// Scroll to the bottom of the chat
		setTimeout(() => {
			scrollToBottom({ behavior: "instant" });
		}, 1);
	}, []);

	useEffect(() => {
		// Save messages to local storage when the messages array changes
		localStorage.setItem(localStorageKey, JSON.stringify(messages));
	}, [messages]);

	return (
		<div ref={chatRef} className={styles["chat"]}>
			<ul className={styles["messages"]}>
				{messages.map((message, i) => (
					<li key={i} {...className(styles["message"], styles[message.role])}>
						{message.role === "user" && (
							<Button
								className={styles["delete"]}
								icon={<TrashCan />}
								title="Delete message"
								onClick={() => {
									const confirmed = confirm("Are you sure you want to delete this message?");

									if (confirmed) deleteChatMessage(message.id);
								}}
							/>
						)}

						<MarkdownRenderer content={message.content as string} />
					</li>
				))}
			</ul>

			<form ref={formRef} className={styles["prompt"]} onSubmit={submitChatMessage}>
				<textarea
					name="prompt"
					placeholder="Ask something..."
					defaultValue={prompt}
					onChange={(e) => setPrompt(e.currentTarget.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							formRef.current?.dispatchEvent(new Event("submit", { bubbles: true }));
						}
					}}
				/>

				<Button type="submit" title="Send" icon={<Pencil />} disabled={!prompt || isStreaming} circular />
			</form>
		</div>
	);
}
