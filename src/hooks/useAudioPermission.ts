import { useCallback, useEffect, useState } from "react";

export type PermissionState = "prompt" | "granted" | "denied" | "unsupported";

export interface UseAudioPermissionReturn {
	permissionState: PermissionState;
	isLoading: boolean;
	requestPermission: () => Promise<boolean>;
	checkPermission: () => Promise<void>;
}

export function useAudioPermission(): UseAudioPermissionReturn {
	const [permissionState, setPermissionState] =
		useState<PermissionState>("prompt");
	const [isLoading, setIsLoading] = useState(true);

	// Check if audio recording is supported
	const isSupported =
		typeof navigator !== "undefined" &&
		typeof navigator.mediaDevices !== "undefined" &&
		typeof navigator.mediaDevices.getUserMedia !== "undefined" &&
		typeof MediaRecorder !== "undefined";

	// Check permission status
	const checkPermission = useCallback(async () => {
		if (!isSupported) {
			setPermissionState("unsupported");
			setIsLoading(false);
			return;
		}

		try {
			// Try to use Permissions API first (not supported everywhere)
			if (navigator.permissions) {
				const result = await navigator.permissions.query({
					name: "microphone" as PermissionName,
				});
				setPermissionState(result.state as PermissionState);

				// Listen for permission changes
				result.onchange = () => {
					setPermissionState(result.state as PermissionState);
				};
			}
		} catch {
			// Permissions API not supported, we'll know when user tries to record
			setPermissionState("prompt");
		}

		setIsLoading(false);
	}, [isSupported]);

	// Request microphone permission
	const requestPermission = useCallback(async (): Promise<boolean> => {
		if (!isSupported) {
			setPermissionState("unsupported");
			return false;
		}

		try {
			setIsLoading(true);
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});

			// Stop the stream immediately - we just wanted to request permission
			for (const track of stream.getTracks()) {
				track.stop();
			}

			setPermissionState("granted");
			return true;
		} catch (err) {
			if (err instanceof Error) {
				if (
					err.name === "NotAllowedError" ||
					err.name === "PermissionDeniedError"
				) {
					setPermissionState("denied");
				}
			}
			return false;
		} finally {
			setIsLoading(false);
		}
	}, [isSupported]);

	// Check permission on mount
	useEffect(() => {
		checkPermission();
	}, [checkPermission]);

	return {
		permissionState,
		isLoading,
		requestPermission,
		checkPermission,
	};
}
