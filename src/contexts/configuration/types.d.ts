import type { CoreSystemMessage } from "ai";

export interface LLMConfiguration {
	systemRole?: CoreSystemMessage | undefined;
}
