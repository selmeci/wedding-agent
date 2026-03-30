export async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	options: {
		maxRetries?: number;
		baseDelayMs?: number;
		maxDelayMs?: number;
		onRetry?: (attempt: number, error: unknown) => void;
	} = {},
): Promise<T> {
	const {
		maxRetries = 3,
		baseDelayMs = 1000,
		maxDelayMs = 30000,
		onRetry,
	} = options;

	let lastError: unknown;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;

			// Do not retry on 4xx client errors
			if (error instanceof Error && error.message.includes("status 4")) {
				throw error;
			}

			// No more retries after last attempt
			if (attempt === maxRetries) {
				break;
			}

			// Calculate exponential backoff with jitter
			const jitter = Math.random() * 1000;
			const delay = Math.min(
				baseDelayMs * Math.pow(2, attempt) + jitter,
				maxDelayMs,
			);

			onRetry?.(attempt + 1, error);

			await new Promise<void>((resolve) => setTimeout(resolve, delay));
		}
	}

	throw lastError;
}
