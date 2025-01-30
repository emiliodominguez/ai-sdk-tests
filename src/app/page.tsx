import { SpeechSynthesisProvider } from "@/contexts/speech-synthesis";
import { Chat } from "@/components/chat";

export default async function Home() {
	return (
		<SpeechSynthesisProvider>
			<Chat />
		</SpeechSynthesisProvider>
	);
}
