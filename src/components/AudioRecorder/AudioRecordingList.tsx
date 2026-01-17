import { Microphone } from "@/components/PixelArt";
import {
	AudioRecordingItem,
	type AudioRecordingData,
} from "./AudioRecordingItem";

interface AudioRecordingListProps {
	recordings: AudioRecordingData[];
	isLoading: boolean;
	onDelete: (id: string) => Promise<void>;
}

export function AudioRecordingList({
	recordings,
	isLoading,
	onDelete,
}: AudioRecordingListProps) {
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-8">
				<div className="flex gap-1">
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							className="h-2 w-2 animate-bounce rounded-full bg-pink-400"
							style={{ animationDelay: `${i * 0.15}s` }}
						/>
					))}
				</div>
				<p className="mt-2 text-sm text-gray-500">Načítavam nahrávky...</p>
			</div>
		);
	}

	if (recordings.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-8 text-center">
				<Microphone className="h-12 w-12 opacity-30" />
				<p className="mt-3 text-sm text-gray-500">Zatiaľ žiadne nahrávky</p>
				<p className="mt-1 text-xs text-gray-400">
					Nahraj svoj pozdrav pre novomanželov
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			<h3 className="text-sm font-medium text-gray-700">
				Tvoje nahrávky ({recordings.length})
			</h3>
			{recordings.map((recording) => (
				<AudioRecordingItem
					key={recording.id}
					recording={recording}
					onDelete={onDelete}
				/>
			))}
		</div>
	);
}
