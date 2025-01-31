"use client";

import { createContext, useContext, useState } from "react";

import type { LLMConfiguration } from "./types";
import { Options } from "./options";

const LLMConfigurationContext = createContext<LLMConfiguration>(null as never);

export function LLMConfigurationProvider(props: { children: React.ReactNode }) {
	const [configuration, setConfiguration] = useState<LLMConfiguration>({
		systemRole: undefined
	});

	/**
	 * Updates the configuration
	 * @param config The configuration to update
	 */
	function updateConfiguration(config: Partial<LLMConfiguration>): void {
		setConfiguration((prev) => ({ ...prev, ...config }));
	}

	return (
		<LLMConfigurationContext.Provider value={configuration}>
			<Options {...configuration} updateConfiguration={updateConfiguration} />

			{props.children}
		</LLMConfigurationContext.Provider>
	);
}

/**
 * Uses the speech synthesis context
 * @returns The speech synthesis context
 */
export function useLLMConfiguration(): LLMConfiguration {
	const context = useContext(LLMConfigurationContext);

	if (!context) {
		throw new Error("useLLMConfiguration must be used within a LLMConfigurationProvider");
	}

	return context;
}
