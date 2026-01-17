import { Pause, Play, Trash, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/button/Button";
import { Microphone } from "@/components/PixelArt";

export interface AudioRecordingData {
	id: string;
	fileName: string;
	duration: number | null;
	mimeType: string;
	streamUrl: string;
	uploadedAt: Date | string;
}

interface AudioRecordingItemProps {
	recording: AudioRecordingData;
	onDelete: (id: string) => Promise<void>;
}

function formatDuration(seconds: number | null): string {
	if (seconds === null || seconds === undefined) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toLocaleDateString("sk-SK", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function AudioRecordingItem({
	recording,
	onDelete,
}: AudioRecordingItemProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const audioRef = useRef<HTMLAudioElement>(null);

	const handlePlayPause = useCallback(() => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play();
		}
	}, [isPlaying]);

	const handleTimeUpdate = useCallback(() => {
		if (audioRef.current) {
			setCurrentTime(Math.floor(audioRef.current.currentTime));
		}
	}, []);

	const handleEnded = useCallback(() => {
		setIsPlaying(false);
		setCurrentTime(0);
	}, []);

	const openDeleteModal = useCallback(() => {
		setIsDeleteModalOpen(true);
	}, []);

	const closeDeleteModal = useCallback(() => {
		setIsDeleteModalOpen(false);
	}, []);

	const confirmDelete = useCallback(async () => {
		setIsDeleting(true);
		try {
			await onDelete(recording.id);
			closeDeleteModal();
		} finally {
			setIsDeleting(false);
		}
	}, [onDelete, recording.id, closeDeleteModal]);

	// Keyboard support for delete modal (Escape to close)
	useEffect(() => {
		if (!isDeleteModalOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				closeDeleteModal();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isDeleteModalOpen, closeDeleteModal]);

	const progress = recording.duration
		? (currentTime / recording.duration) * 100
		: 0;

	return (
		<div className="flex items-center gap-3 rounded-lg border border-pink-200 bg-white p-3 shadow-sm">
			{/* Play/Pause button */}
			<Button
				variant="secondary"
				shape="circular"
				size="sm"
				onClick={handlePlayPause}
				aria-label={isPlaying ? "Pozastaviť" : "Prehrať"}
			>
				{isPlaying ? (
					<Pause weight="fill" className="h-4 w-4" />
				) : (
					<Play weight="fill" className="h-4 w-4" />
				)}
			</Button>

			{/* Progress and info */}
			<div className="flex flex-1 flex-col gap-1">
				{/* Progress bar */}
				<div className="h-1.5 w-full overflow-hidden rounded-full bg-pink-100">
					<div
						className="h-full rounded-full bg-pink-500 transition-all duration-100"
						style={{ width: `${progress}%` }}
					/>
				</div>

				{/* Time and date */}
				<div className="flex items-center justify-between text-xs text-gray-500">
					<span>
						{formatDuration(currentTime)} / {formatDuration(recording.duration)}
					</span>
					<span>{formatDate(recording.uploadedAt)}</span>
				</div>
			</div>

			{/* Delete button */}
			<Button
				variant="ghost"
				shape="circular"
				size="sm"
				onClick={openDeleteModal}
				disabled={isDeleting}
				aria-label="Zmazať nahrávku"
			>
				<Trash
					weight="bold"
					className="h-4 w-4 text-gray-400 hover:text-red-500"
				/>
			</Button>

			{/* Hidden audio element */}
			<audio
				ref={audioRef}
				src={recording.streamUrl}
				onPlay={() => setIsPlaying(true)}
				onPause={() => setIsPlaying(false)}
				onTimeUpdate={handleTimeUpdate}
				onEnded={handleEnded}
				preload="metadata"
			/>

			{/* Delete Confirmation Modal */}
			{isDeleteModalOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
					{/* Backdrop */}
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: Backdrop click closes modal */}
					{/* biome-ignore lint/a11y/noStaticElementInteractions: Backdrop is clickable to close */}
					<div
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						onClick={closeDeleteModal}
					/>

					{/* Modal Card */}
					<div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 fade-in duration-200">
						{/* Pink Gradient Header */}
						<div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-t-2xl p-6 text-center">
							<Microphone className="w-16 h-16 mx-auto mb-3 opacity-90" />
							<h3 className="text-xl font-bold text-white">
								Vymazať nahrávku?
							</h3>
						</div>

						{/* Content */}
						<div className="p-6 text-center">
							<p className="text-gray-700 mb-6">
								Táto akcia sa nedá vrátiť späť. Nahrávka bude natrvalo vymazaná.
							</p>

							{/* Buttons */}
							<div className="flex gap-3 justify-center">
								<button
									type="button"
									onClick={closeDeleteModal}
									disabled={isDeleting}
									className="px-6 py-2.5 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors min-w-[120px] disabled:opacity-50"
								>
									Zrušiť
								</button>
								<button
									type="button"
									onClick={confirmDelete}
									disabled={isDeleting}
									className="px-6 py-2.5 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-md min-w-[120px] flex items-center justify-center gap-2 disabled:opacity-50"
								>
									{isDeleting ? (
										"Mažem..."
									) : (
										<>
											<Trash size={18} weight="fill" />
											Vymazať
										</>
									)}
								</button>
							</div>
						</div>

						{/* Close button (X) */}
						<button
							type="button"
							onClick={closeDeleteModal}
							className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2"
							aria-label="Zavrieť"
						>
							<X size={20} weight="bold" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
