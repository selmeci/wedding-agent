import { useCallback, useEffect, useState } from "react";
import { Microphone, SoundWave } from "@/components/PixelArt";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { AudioRecordingList } from "./AudioRecordingList";
import type { AudioRecordingData } from "./AudioRecordingItem";

interface AudioRecorderProps {
	qrToken: string;
}

function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioRecorder({ qrToken }: AudioRecorderProps) {
	const [recordings, setRecordings] = useState<AudioRecordingData[]>([]);
	const [isLoadingList, setIsLoadingList] = useState(true);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [uploadSuccess, setUploadSuccess] = useState(false);

	const {
		isRecording,
		isPaused,
		recordingTime,
		timeRemaining,
		audioBlob,
		audioUrl,
		error: recordingError,
		isSupported,
		supportedFormat,
		startRecording,
		stopRecording,
		pauseRecording,
		resumeRecording,
		resetRecording,
	} = useAudioRecorder({
		maxDuration: 60,
		onMaxDurationReached: () => {
			// Will auto-stop, nothing extra needed
		},
	});

	// Fetch existing recordings
	const fetchRecordings = useCallback(async () => {
		try {
			setIsLoadingList(true);
			const response = await fetch("/api/audio", {
				headers: {
					"x-qr-token": qrToken,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch recordings");
			}

			const data = (await response.json()) as {
				recordings?: AudioRecordingData[];
			};
			setRecordings(data.recordings || []);
		} catch (err) {
			console.error("Failed to fetch recordings:", err);
		} finally {
			setIsLoadingList(false);
		}
	}, [qrToken]);

	// Load recordings on mount
	useEffect(() => {
		fetchRecordings();
	}, [fetchRecordings]);

	// Upload recording when blob is ready
	const handleUpload = useCallback(async () => {
		if (!audioBlob || !supportedFormat) return;

		setIsUploading(true);
		setUploadError(null);
		setUploadSuccess(false);

		try {
			const formData = new FormData();
			formData.append(
				"file",
				audioBlob,
				`recording.${supportedFormat.extension}`,
			);
			formData.append("duration", String(recordingTime));

			const response = await fetch("/api/audio", {
				method: "POST",
				headers: {
					"x-qr-token": qrToken,
				},
				body: formData,
			});

			if (!response.ok) {
				const errorData = (await response.json()) as { error?: string };
				throw new Error(errorData.error || "Upload failed");
			}

			// Reset recording state first
			resetRecording();

			// Show success message
			setUploadSuccess(true);

			// Refresh the list
			await fetchRecordings();

			// Hide success message after 3 seconds
			setTimeout(() => {
				setUploadSuccess(false);
			}, 3000);
		} catch (err) {
			console.error("Upload error:", err);
			setUploadError(
				err instanceof Error
					? err.message
					: "Nepodarilo sa nahrať zvuk. Skontroluj pripojenie.",
			);
		} finally {
			setIsUploading(false);
		}
	}, [
		audioBlob,
		supportedFormat,
		recordingTime,
		qrToken,
		fetchRecordings,
		resetRecording,
	]);

	// Delete recording
	const handleDelete = useCallback(
		async (id: string) => {
			const response = await fetch(`/api/audio/${id}`, {
				method: "DELETE",
				headers: {
					"x-qr-token": qrToken,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to delete recording");
			}

			// Update local state
			setRecordings((prev) => prev.filter((r) => r.id !== id));
		},
		[qrToken],
	);

	// Handle record button click
	const handleRecordClick = useCallback(() => {
		if (isRecording) {
			if (isPaused) {
				resumeRecording();
			} else {
				stopRecording();
			}
		} else {
			startRecording();
		}
	}, [isRecording, isPaused, startRecording, stopRecording, resumeRecording]);

	// Show unsupported message
	if (!isSupported) {
		return (
			<div className="flex flex-col items-center justify-center px-4 py-8 text-center">
				<Microphone className="h-16 w-16 opacity-30" />
				<p className="mt-4 text-gray-600">
					Tvoj prehliadač nepodporuje nahrávanie zvuku.
				</p>
				<p className="mt-2 text-sm text-gray-400">
					Skús použiť Chrome, Firefox alebo Safari.
				</p>
			</div>
		);
	}

	const error = recordingError?.message || uploadError;

	return (
		<div className="flex flex-col gap-6 px-4 py-6">
			{/* Header */}
			<div className="text-center">
				<h2 className="text-lg font-semibold text-gray-800">Hlasový pozdrav</h2>
				<p className="mt-1 text-sm text-gray-500">
					Nahraj krátky odkaz pre novomanželov
				</p>
			</div>

			{/* Recording section */}
			<div className="flex flex-col items-center gap-4">
				{/* Microphone button */}
				<button
					type="button"
					onClick={handleRecordClick}
					disabled={isUploading || !!audioBlob}
					className={`relative flex h-24 w-24 items-center justify-center rounded-full border-4 transition-all ${
						isRecording
							? "border-red-400 bg-red-50 shadow-lg shadow-red-200"
							: "border-pink-300 bg-pink-50 hover:border-pink-400 hover:bg-pink-100"
					} ${isUploading || audioBlob ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
					aria-label={isRecording ? "Zastaviť nahrávanie" : "Začať nahrávanie"}
				>
					<Microphone
						className="h-12 w-12"
						recording={isRecording}
						animated={isRecording}
					/>
				</button>

				{/* Recording status */}
				{isRecording && (
					<div className="flex flex-col items-center gap-2">
						<SoundWave active={!isPaused} className="h-6" />
						<div className="flex items-center gap-2">
							<span className="font-mono text-lg font-medium text-red-500">
								{formatTime(recordingTime)}
							</span>
							<span className="text-sm text-gray-400">/ {formatTime(60)}</span>
						</div>
						<p className="text-xs text-gray-500">
							Zostáva {timeRemaining} sekúnd
						</p>

						{/* Pause button */}
						<button
							type="button"
							onClick={isPaused ? resumeRecording : pauseRecording}
							className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
						>
							{isPaused ? "Pokračovať" : "Pozastaviť"}
						</button>
					</div>
				)}

				{/* Instructions when idle */}
				{!isRecording && !audioBlob && (
					<p className="text-center text-sm text-gray-500">
						Klikni na mikrofón pre nahrávanie
						<br />
						<span className="text-xs text-gray-400">(max. 60 sekúnd)</span>
					</p>
				)}

				{/* Preview after recording */}
				{audioBlob && audioUrl && !isRecording && (
					<div className="flex w-full max-w-sm flex-col gap-3 rounded-xl border border-pink-200 bg-white p-4 shadow-md">
						<p className="text-center text-sm font-medium text-gray-700">
							Náhľad nahrávky ({formatTime(recordingTime)})
						</p>

						<audio
							src={audioUrl}
							controls
							className="w-full"
							preload="metadata"
						/>

						<div className="flex gap-3">
							<button
								type="button"
								onClick={resetRecording}
								disabled={isUploading}
								className="flex-1 rounded-full border-2 border-gray-300 bg-white py-2.5 px-4 font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Zrušiť
							</button>
							<button
								type="button"
								onClick={handleUpload}
								disabled={isUploading}
								className="flex-1 rounded-full bg-pink-500 py-2.5 px-4 font-medium text-white shadow-md hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isUploading ? "Nahrávam..." : "Uložiť"}
							</button>
						</div>
					</div>
				)}

				{/* Success message */}
				{uploadSuccess && (
					<div className="w-full max-w-sm rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm text-green-600">
						Nahrávka bola úspešne uložená!
					</div>
				)}

				{/* Error message */}
				{error && (
					<div className="w-full max-w-sm rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
						{error}
					</div>
				)}
			</div>

			{/* Recordings list */}
			<div className="mt-4">
				<AudioRecordingList
					recordings={recordings}
					isLoading={isLoadingList}
					onDelete={handleDelete}
				/>
			</div>

			{/* WiFi tip */}
			<div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center text-xs text-blue-700">
				Pre lepšiu kvalitu nahrávky odporúčame použiť slúchadlá s mikrofónom
			</div>
		</div>
	);
}
