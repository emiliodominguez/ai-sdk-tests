"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

import styles from "./speech-synthesis.module.scss";
import { isBrowser } from "@/utilities/helpers";

interface SpeechSynthesisContextType {
	/**
	 * Whether the speech synthesis is currently speaking
	 */
	speaking: boolean;
	/**
	 * Speaks the given text
	 * @param text The text to speak
	 */
	speak(text: string): void;
}

const SpeechSynthesisContext = createContext<SpeechSynthesisContextType>(null as never);

const synth = isBrowser() ? window.speechSynthesis : undefined;

/**
 * Provides the speech synthesis context
 */
export function SpeechSynthesisProvider(props: { children: React.ReactNode }) {
	const [speaking, setSpeaking] = useState<boolean>(false);
	const utterance = useRef<SpeechSynthesisUtterance | null>(isBrowser() ? new SpeechSynthesisUtterance() : null);
	const voices = useRef<SpeechSynthesisVoice[]>(synth?.getVoices() ?? []);
	const chatAnimatedBubbleRef = useRef<HTMLDivElement>(null);

	/**
	 * Speaks the given text
	 * @param text The text to speak
	 */
	function speak(text: string) {
		if (!synth || !utterance.current) return;

		utterance.current.text = text;
		utterance.current.voice = voices.current[0];
		utterance.current.rate = 1.25;

		synth.speak(utterance.current);
	}

	/**
	 * Renders an animated speech bubble
	 */
	function animateBubble(): void {
		const bubble = chatAnimatedBubbleRef.current;

		if (!bubble) return;

		// Simulate bubble size variation based on speech progress
		const minScale = 1;
		const maxScale = 1.3;
		const progress = Math.random() * (maxScale - minScale) + minScale; // Random pulse effect

		bubble.style.transform = `scale(${progress})`;
	}

	/**
	 * Resets the bubble after speech ends
	 */
	function resetBubble() {
		const bubble = chatAnimatedBubbleRef.current;
		if (!bubble) return;

		bubble.style.transform = "unset";
	}

	useEffect(() => {
		if (!synth || !utterance.current) return;

		utterance.current.onstart = () => {
			setSpeaking(true);
			animateBubble();
		};

		utterance.current.onboundary = () => {
			animateBubble();
		};

		utterance.current.onend = () => {
			setSpeaking(false);
			resetBubble();
		};

		window.addEventListener("beforeunload", () => {
			synth.cancel();
		});
	}, []);

	return (
		<SpeechSynthesisContext.Provider value={{ speaking, speak }}>
			{props.children}

			{speaking && <div ref={chatAnimatedBubbleRef} className={styles["animated-bubble"]} />}
		</SpeechSynthesisContext.Provider>
	);
}

/**
 * Uses the speech synthesis context
 * @returns The speech synthesis context
 */
export function useSpeechSynthesis(): SpeechSynthesisContextType {
	const context = useContext(SpeechSynthesisContext);

	if (!context) {
		throw new Error("useSpeechSynthesis must be used within a SpeechSynthesisProvider");
	}

	return context;
}
