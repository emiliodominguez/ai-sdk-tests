import { LLMConfigurationProvider } from "@/contexts/configuration";
import { SpeechSynthesisProvider } from "@/contexts/speech-synthesis";
import { Chat } from "@/components/chat";

export default async function Home() {
	return (
		<SpeechSynthesisProvider>
			<LLMConfigurationProvider>
				<Chat />
			</LLMConfigurationProvider>
		</SpeechSynthesisProvider>
	);
}
