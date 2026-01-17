import { useCallback, useEffect, useRef, useState } from "react";

const MAX_RECORDING_DURATION = 60; // seconds

interface AudioFormat {
	mimeType: string;
	extension: string;
	label: string;
}

const AUDIO_FORMATS: AudioFormat[] = [
	{ mimeType: "audio/mp4", extension: "m4a", label: "MP4/AAC" }, // Safari iOS native
	{
		mimeType: "audio/webm;codecs=opus",
		extension: "webm",
		label: "WebM/Opus",
	}, // Chrome/Firefox
	{ mimeType: "audio/webm", extension: "webm", label: "WebM" }, // Fallback
	{ mimeType: "audio/ogg", extension: "ogg", label: "OGG" }, // Firefox fallback
];

function getSupportedAudioFormat(): AudioFormat | null {
	if (typeof MediaRecorder === "undefined") {
		return null;
	}
	for (const format of AUDIO_FORMATS) {
		if (MediaRecorder.isTypeSupported(format.mimeType)) {
			return format;
		}
	}
	return null;
}

export interface UseAudioRecorderOptions {
	maxDuration?: number;
	onMaxDurationReached?: () => void;
}

export interface UseAudioRecorderReturn {
	// State
	isRecording: boolean;
	isPaused: boolean;
	recordingTime: number;
	timeRemaining: number;
	audioBlob: Blob | null;
	audioUrl: string | null;
	error: Error | null;

	// Format info
	supportedFormat: AudioFormat | null;
	isSupported: boolean;

	// Actions
	startRecording: () => Promise<void>;
	stopRecording: () => void;
	pauseRecording: () => void;
	resumeRecording: () => void;
	resetRecording: () => void;
}

export function useAudioRecorder(
	options: UseAudioRecorderOptions = {},
): UseAudioRecorderReturn {
	const { maxDuration = MAX_RECORDING_DURATION, onMaxDurationReached } =
		options;

	const [isRecording, setIsRecording] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [recordingTime, setRecordingTime] = useState(0);
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [supportedFormat] = useState<AudioFormat | null>(
		getSupportedAudioFormat,
	);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const isSupported = supportedFormat !== null;
	const timeRemaining = maxDuration - recordingTime;

	// Cleanup function
	const cleanup = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		if (streamRef.current) {
			for (const track of streamRef.current.getTracks()) {
				track.stop();
			}
			streamRef.current = null;
		}
		mediaRecorderRef.current = null;
		chunksRef.current = [];
	}, []);

	// Stop recording
	const stopRecording = useCallback(() => {
		if (mediaRecorderRef.current?.state !== "inactive") {
			mediaRecorderRef.current?.stop();
		}
		setIsRecording(false);
		setIsPaused(false);
	}, []);

	// Start recording
	const startRecording = useCallback(async () => {
		if (!isSupported || !supportedFormat) {
			setError(new Error("Audio recording is not supported in this browser"));
			return;
		}

		try {
			setError(null);
			chunksRef.current = [];

			// Request microphone access
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true,
				},
			});

			streamRef.current = stream;

			// Create MediaRecorder with supported format
			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: supportedFormat.mimeType,
			});

			mediaRecorderRef.current = mediaRecorder;

			// Handle data available
			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					chunksRef.current.push(event.data);
				}
			};

			// Handle recording stop
			mediaRecorder.onstop = () => {
				const blob = new Blob(chunksRef.current, {
					type: supportedFormat.mimeType,
				});
				setAudioBlob(blob);

				// Revoke previous URL if exists
				if (audioUrl) {
					URL.revokeObjectURL(audioUrl);
				}
				setAudioUrl(URL.createObjectURL(blob));

				cleanup();
			};

			// Handle errors
			mediaRecorder.onerror = (event) => {
				setError(new Error("Recording error occurred"));
				console.error("MediaRecorder error:", event);
				cleanup();
				setIsRecording(false);
				setIsPaused(false);
			};

			// Start recording
			mediaRecorder.start(1000); // Collect data every second
			setIsRecording(true);
			setIsPaused(false);
			setRecordingTime(0);
			setAudioBlob(null);
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
			setAudioUrl(null);

			// Start timer
			timerRef.current = setInterval(() => {
				setRecordingTime((prev) => {
					const newTime = prev + 1;
					if (newTime >= maxDuration) {
						stopRecording();
						onMaxDurationReached?.();
						return maxDuration;
					}
					return newTime;
				});
			}, 1000);
		} catch (err) {
			if (err instanceof Error) {
				if (
					err.name === "NotAllowedError" ||
					err.name === "PermissionDeniedError"
				) {
					setError(
						new Error(
							"Potrebujeme prístup k mikrofónu. Povoľ ho v nastaveniach prehliadača.",
						),
					);
				} else if (
					err.name === "NotFoundError" ||
					err.name === "DevicesNotFoundError"
				) {
					setError(new Error("Mikrofón nebol nájdený na tomto zariadení."));
				} else {
					setError(err);
				}
			} else {
				setError(new Error("Nahrávanie zlyhalo. Skús to znova."));
			}
			cleanup();
		}
	}, [
		isSupported,
		supportedFormat,
		maxDuration,
		onMaxDurationReached,
		audioUrl,
		cleanup,
		stopRecording,
	]);

	// Pause recording
	const pauseRecording = useCallback(() => {
		if (mediaRecorderRef.current?.state === "recording") {
			mediaRecorderRef.current.pause();
			setIsPaused(true);
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		}
	}, []);

	// Resume recording
	const resumeRecording = useCallback(() => {
		if (mediaRecorderRef.current?.state === "paused") {
			mediaRecorderRef.current.resume();
			setIsPaused(false);

			// Resume timer
			timerRef.current = setInterval(() => {
				setRecordingTime((prev) => {
					const newTime = prev + 1;
					if (newTime >= maxDuration) {
						stopRecording();
						onMaxDurationReached?.();
						return maxDuration;
					}
					return newTime;
				});
			}, 1000);
		}
	}, [maxDuration, onMaxDurationReached, stopRecording]);

	// Reset recording state
	const resetRecording = useCallback(() => {
		cleanup();
		setIsRecording(false);
		setIsPaused(false);
		setRecordingTime(0);
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
		}
		setAudioBlob(null);
		setAudioUrl(null);
		setError(null);
	}, [cleanup, audioUrl]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			cleanup();
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
		};
	}, [cleanup, audioUrl]);

	return {
		isRecording,
		isPaused,
		recordingTime,
		timeRemaining,
		audioBlob,
		audioUrl,
		error,
		supportedFormat,
		isSupported,
		startRecording,
		stopRecording,
		pauseRecording,
		resumeRecording,
		resetRecording,
	};
}
