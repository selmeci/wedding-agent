import { useChat } from "@/lib/hooks/useChat";
import { ChatContainer } from "./ChatContainer";
import { ChatInput } from "./ChatInput";
import { ChatMessageList } from "./ChatMessageList";
import { RsvpSummaryCard } from "./RsvpSummaryCard";

export interface ChatInterfaceProps {
	qrToken?: string;
	className?: string;
}

export function ChatInterface({ qrToken, className = "" }: ChatInterfaceProps) {
	const {
		messages,
		sendMessage,
		isLoading,
		identificationFailed,
		rsvpData,
		isRsvpComplete,
	} = useChat({
		qrToken,
	});

	const handleEditRsvp = () => {
		// Send message to AI to trigger edit mode
		sendMessage("Chcem zmeniť moje odpovede na RSVP.");
	};

	return (
		<ChatContainer className={className}>
			{/* Show RSVP summary card when RSVP is complete */}
			{isRsvpComplete && rsvpData && (
				<RsvpSummaryCard
					data={{
						guestNames: rsvpData.guestNames,
						willAttend: rsvpData.willAttend,
						attendCeremony: rsvpData.attendCeremony,
						dietaryRestrictions: rsvpData.dietaryRestrictions,
						needsAccommodation: rsvpData.needsAccommodation,
						needsDirections: rsvpData.needsDirections,
						isFromModra: rsvpData.isFromModra,
					}}
					onEdit={handleEditRsvp}
				/>
			)}
			<ChatMessageList messages={messages} isLoading={isLoading} />
			<ChatInput
				onSend={sendMessage}
				disabled={isLoading || identificationFailed}
				identificationFailed={identificationFailed}
			/>
		</ChatContainer>
	);
}
