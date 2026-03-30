import {
	ArrowLeftIcon,
	ArrowRightIcon,
	DownloadSimpleIcon,
	Play,
	UploadSimpleIcon,
	XIcon,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Container } from "@/components/ui";
import type { GalleryGroup } from "@/db/queries/gallery-media";

interface GalleryMedia {
	id: string;
	fileName: string;
	mediaType: string;
	duration: number | null;
	uploadedAt: string;
	cloudflareImageId?: string | null;
	streamVideoUid?: string | null;
	streamReady?: boolean | null;
}

interface GalleryPageProps {
	token: string;
}

function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function GalleryPage({ token }: GalleryPageProps) {
	const [groups, setGroups] = useState<
		(Omit<GalleryGroup, "media"> & { media: GalleryMedia[] })[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isUnauthorized, setIsUnauthorized] = useState(false);
	const [cfImagesHash, setCfImagesHash] = useState<string>("");
	const [cfStreamCode, setCfStreamCode] = useState<string>("");

	// Lightbox state
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [fullImageLoaded, setFullImageLoaded] = useState(false);
	const [fullImageError, setFullImageError] = useState(false);
	const [isReuploading, setIsReuploading] = useState(false);
	const reuploadInputRef = useRef<HTMLInputElement>(null);
	const previouslyFocusedRef = useRef<HTMLElement | null>(null);
	const lightboxRef = useRef<HTMLDivElement>(null);

	// Flat list of all media for lightbox navigation
	const allMedia = useMemo(() => groups.flatMap((g) => g.media), [groups]);
	const flatStartByGroup = useMemo(() => {
		const map = new Map<string, number>();
		let offset = 0;
		for (const g of groups) {
			map.set(g.groupId, offset);
			offset += g.media.length;
		}
		return map;
	}, [groups]);
	const currentMedia = allMedia[currentIndex] ?? null;

	// Construct the correct thumbnail URL for a media item
	const getThumbnailUrl = useCallback(
		(media: GalleryMedia) => {
			if (
				media.cloudflareImageId &&
				!media.cloudflareImageId.startsWith("migration_skipped") &&
				cfImagesHash
			) {
				return `https://imagedelivery.net/${cfImagesHash}/${media.cloudflareImageId}/thumbnail`;
			}
			if (media.streamVideoUid && cfStreamCode) {
				return `https://customer-${cfStreamCode}.cloudflarestream.com/${media.streamVideoUid}/thumbnails/thumbnail.jpg`;
			}
			// R2 fallback for unmigrated or skipped files
			return `/api/photos/${media.id}/file`;
		},
		[cfImagesHash, cfStreamCode],
	);

	// Construct the correct full-resolution URL for a media item
	const getFullUrl = useCallback(
		(media: GalleryMedia) => {
			if (
				media.cloudflareImageId &&
				!media.cloudflareImageId.startsWith("migration_skipped") &&
				cfImagesHash
			) {
				return `https://imagedelivery.net/${cfImagesHash}/${media.cloudflareImageId}/public`;
			}
			if (media.streamVideoUid && cfStreamCode) {
				return `https://customer-${cfStreamCode}.cloudflarestream.com/${media.streamVideoUid}/iframe?autoplay=true&muted=true`;
			}
			// R2 fallback
			return `/api/photos/${media.id}/file`;
		},
		[cfImagesHash, cfStreamCode],
	);

	const fetchMedia = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		setIsUnauthorized(false);
		try {
			const res = await fetch(
				`/api/gallery/media?token=${encodeURIComponent(token)}`,
			);
			if (res.status === 401) {
				setIsUnauthorized(true);
				return;
			}
			if (!res.ok) {
				let serverMessage = `HTTP ${res.status}`;
				try {
					const body = (await res.json()) as { error?: string };
					if (body.error) serverMessage = body.error;
				} catch {
					// Response body wasn't JSON
				}
				throw new Error(serverMessage);
			}
			const data = (await res.json()) as {
				groups: (Omit<GalleryGroup, "media"> & { media: GalleryMedia[] })[];
				cfImagesHash?: string;
				cfStreamCode?: string;
			};
			if (data.cfImagesHash) setCfImagesHash(data.cfImagesHash);
			if (data.cfStreamCode) setCfStreamCode(data.cfStreamCode);
			setGroups(data.groups ?? []);
		} catch (error) {
			console.error("Gallery fetch failed:", error);
			setError("Nepodarilo sa načítať galériu. Skúste to znova.");
		} finally {
			setIsLoading(false);
		}
	}, [token]);

	useEffect(() => {
		fetchMedia();
	}, [fetchMedia]);

	// Lightbox controls
	const openLightbox = useCallback((flatIndex: number) => {
		previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
		setCurrentIndex(flatIndex);
		setFullImageLoaded(false);
		setFullImageError(false);
		setLightboxOpen(true);
	}, []);

	const closeLightbox = useCallback(() => {
		setLightboxOpen(false);
		setFullImageLoaded(false);
		setFullImageError(false);
		previouslyFocusedRef.current?.focus();
	}, []);

	const goToPrev = useCallback(() => {
		setFullImageLoaded(false);
		setFullImageError(false);
		setCurrentIndex((i) => Math.max(0, i - 1));
	}, []);

	const goToNext = useCallback(() => {
		setFullImageLoaded(false);
		setFullImageError(false);
		setCurrentIndex((i) => Math.min(allMedia.length - 1, i + 1));
	}, [allMedia.length]);

	// Download current media file (original from R2)
	const handleDownload = useCallback(async () => {
		if (!currentMedia) return;
		// All uploads (new + migrated) have originals stored in R2 via /api/photos/:id/file
		const url = `/api/photos/${currentMedia.id}/file`;
		try {
			const res = await fetch(url);
			if (!res.ok) throw new Error("Download failed");
			const blob = await res.blob();
			const blobUrl = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = blobUrl;
			a.download = currentMedia.fileName;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(blobUrl);
		} catch {
			window.open(url, "_blank");
		}
	}, [currentMedia]);

	// Re-upload file for current media (replaces R2 version with CF)
	const handleReupload = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file || !currentMedia) return;
			setIsReuploading(true);
			try {
				const formData = new FormData();
				formData.append("file", file, file.name);
				const res = await fetch(
					`/api/gallery/reupload/${currentMedia.id}?token=${encodeURIComponent(token)}`,
					{ body: formData, method: "POST" },
				);
				if (!res.ok) {
					const body = (await res.json()) as { error?: string };
					throw new Error(body.error || `HTTP ${res.status}`);
				}
				const data = (await res.json()) as {
					cloudflareImageId?: string;
					streamVideoUid?: string;
				};

				// Update local state — replace the media item with new CF IDs
				setGroups((prev) =>
					prev.map((g) => ({
						...g,
						media: g.media.map((m) =>
							m.id === currentMedia.id
								? {
										...m,
										cloudflareImageId: data.cloudflareImageId ?? null,
										fileName: file.name,
										streamReady: data.streamVideoUid ? false : null,
										streamVideoUid: data.streamVideoUid ?? null,
									}
								: m,
						),
					})),
				);
				setFullImageLoaded(false);
				setFullImageError(false);
			} catch (err) {
				console.error("Reupload failed:", err);
				alert(
					`Nahrávanie zlyhalo: ${err instanceof Error ? err.message : "Neznáma chyba"}`,
				);
			} finally {
				setIsReuploading(false);
				if (reuploadInputRef.current) reuploadInputRef.current.value = "";
			}
		},
		[currentMedia, token],
	);

	// Keyboard navigation
	useEffect(() => {
		if (!lightboxOpen) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeLightbox();
			else if (e.key === "ArrowLeft") goToPrev();
			else if (e.key === "ArrowRight") goToNext();
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [lightboxOpen, closeLightbox, goToPrev, goToNext]);

	// Focus trap — re-runs on currentIndex to re-query when nav buttons appear/disappear
	// biome-ignore lint/correctness/useExhaustiveDependencies: currentIndex triggers re-query of focusable elements
	useEffect(() => {
		if (!lightboxOpen || !lightboxRef.current) return;
		const el = lightboxRef.current;
		const focusable = el.querySelectorAll<HTMLElement>(
			'button:not([style*="display: none"])',
		);
		if (focusable.length > 0) focusable[0].focus();

		const trapHandler = (e: KeyboardEvent) => {
			if (e.key !== "Tab") return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last?.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first?.focus();
			}
		};
		document.addEventListener("keydown", trapHandler);
		return () => document.removeEventListener("keydown", trapHandler);
	}, [lightboxOpen, currentIndex]);

	// Touch swipe
	const touchStartX = useRef(0);
	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	}, []);
	const handleTouchEnd = useCallback(
		(e: React.TouchEvent) => {
			const dx = e.changedTouches[0].clientX - touchStartX.current;
			if (Math.abs(dx) > 50) {
				if (dx > 0) goToPrev();
				else goToNext();
			}
		},
		[goToPrev, goToNext],
	);

	const totalMedia = allMedia.length;

	// Unauthorized
	if (isUnauthorized) {
		return (
			<div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-pink-100">
				<Header />
				<main className="flex-1 flex items-center justify-center p-8">
					<Container>
						<div className="text-center">
							<div className="text-6xl mb-6">🔒</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-3 font-heading">
								Neplatný prístupový token
							</h2>
							<p className="text-gray-500">
								Skontrolujte odkaz alebo kontaktujte svadobný pár.
							</p>
						</div>
					</Container>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-pink-100">
			<Header />

			{/* Gallery Header */}
			<div className="bg-gradient-pink py-4 px-4 text-center shadow-sm">
				<h2 className="text-xl md:text-2xl font-bold text-white font-heading">
					Svadobná Galéria
				</h2>
				{!isLoading && totalMedia > 0 && (
					<p className="text-white/80 text-sm mt-1">
						{totalMedia}{" "}
						{totalMedia === 1
							? "spomienka"
							: totalMedia < 5
								? "spomienky"
								: "spomienok"}
					</p>
				)}
			</div>

			<main className="flex-1">
				<Container>
					<div className="py-6 md:py-8">
						{/* Loading */}
						{isLoading && (
							<div className="flex flex-col items-center justify-center py-24">
								<div className="w-10 h-10 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
								<p className="mt-4 text-gray-500 text-sm">
									Načítavam galériu...
								</p>
							</div>
						)}

						{/* Error */}
						{error && (
							<div className="text-center py-24">
								<div className="text-5xl mb-4">😔</div>
								<p className="text-gray-700 mb-4">{error}</p>
								<button
									type="button"
									onClick={fetchMedia}
									className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-xl transition-colors shadow-md"
								>
									Skúsiť znova
								</button>
							</div>
						)}

						{/* Empty */}
						{!isLoading && !error && groups.length === 0 && (
							<div className="text-center py-24">
								<div className="text-6xl mb-4">📷</div>
								<h3 className="text-xl font-semibold text-gray-700 mb-2 font-heading">
									Žiadne médiá neboli nahrané
								</h3>
								<p className="text-gray-500 text-sm">
									Zatiaľ tu nie sú žiadne fotky ani videá.
								</p>
							</div>
						)}

						{/* Groups */}
						{!isLoading &&
							!error &&
							groups.map((group) => {
								const flatStart = flatStartByGroup.get(group.groupId) ?? 0;

								return (
									<section key={group.groupId} className="mb-8 md:mb-10">
										<div className="flex items-center gap-3 mb-4 pb-2 border-b border-pink-200">
											<h3 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
												{group.groupName}
											</h3>
											<span className="text-sm text-pink-500 font-medium bg-pink-50 px-2 py-0.5 rounded-full">
												{group.mediaCount}
											</span>
										</div>

										<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
											{group.media.map((media, idx) => (
												<button
													key={media.id}
													type="button"
													onClick={() => openLightbox(flatStart + idx)}
													className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:scale-[1.03] group focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
													aria-label={`Otvoriť ${media.fileName}`}
												>
													<img
														src={getThumbnailUrl(media)}
														alt={media.fileName}
														className="w-full h-full object-cover"
														loading="lazy"
														onError={(e) => {
															(e.target as HTMLImageElement).style.opacity =
																"0.3";
														}}
													/>
													{media.mediaType === "video" && (
														<>
															<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
																{media.streamVideoUid &&
																media.streamReady === false ? (
																	<div className="bg-black/60 rounded-lg px-3 py-2 text-center">
																		<div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto mb-1" />
																		<span className="text-white text-xs">
																			Spracuva sa...
																		</span>
																	</div>
																) : (
																	<div className="bg-black/50 rounded-full p-3">
																		<Play
																			size={24}
																			weight="fill"
																			className="text-white"
																		/>
																	</div>
																)}
															</div>
															{media.duration != null && (
																<div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
																	{formatDuration(media.duration)}
																</div>
															)}
														</>
													)}
												</button>
											))}
										</div>
									</section>
								);
							})}
					</div>
				</Container>
			</main>

			{/* Lightbox */}
			{lightboxOpen && currentMedia && (
				<div
					ref={lightboxRef}
					className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
					role="dialog"
					aria-modal="true"
					aria-label="Prehliadka médií"
					onTouchStart={handleTouchStart}
					onTouchEnd={handleTouchEnd}
				>
					{/* Close */}
					<button
						type="button"
						onClick={closeLightbox}
						className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-all shadow-lg ring-2 ring-white/30 z-10"
						aria-label="Zavrieť"
					>
						<XIcon size={24} weight="bold" />
					</button>

					{/* Prev */}
					{currentIndex > 0 && (
						<button
							type="button"
							onClick={goToPrev}
							className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-all shadow-lg ring-2 ring-white/30 z-10"
							aria-label="Predchádzajúce"
						>
							<ArrowLeftIcon size={24} weight="bold" />
						</button>
					)}

					{/* Next */}
					{currentIndex < allMedia.length - 1 && (
						<button
							type="button"
							onClick={goToNext}
							className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-all shadow-lg ring-2 ring-white/30 z-10"
							aria-label="Nasledujúce"
						>
							<ArrowRightIcon size={24} weight="bold" />
						</button>
					)}

					{/* Counter */}
					<div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/40 px-3 py-1 rounded-full z-10">
						{currentIndex + 1} / {allMedia.length}
					</div>

					{/* Download + Re-upload buttons */}
					<div className="absolute bottom-4 right-4 flex gap-2 z-10">
						<button
							type="button"
							onClick={handleDownload}
							className="flex items-center gap-1.5 text-white bg-white/10 hover:bg-white/25 rounded-full px-3 py-2 text-sm transition-all ring-1 ring-white/20"
							aria-label="Stiahnuť"
						>
							<DownloadSimpleIcon size={18} weight="bold" />
							<span className="hidden sm:inline">Stiahnuť</span>
						</button>
						<label
							className={`flex items-center gap-1.5 text-white rounded-full px-3 py-2 text-sm transition-all ring-1 ring-white/20 cursor-pointer ${
								isReuploading
									? "bg-white/5 opacity-50 pointer-events-none"
									: "bg-pink-500/80 hover:bg-pink-500"
							}`}
							aria-label="Nahrať náhradu"
						>
							{isReuploading ? (
								<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
							) : (
								<UploadSimpleIcon size={18} weight="bold" />
							)}
							<span className="hidden sm:inline">
								{isReuploading ? "Nahráva sa..." : "Nahradiť"}
							</span>
							<input
								ref={reuploadInputRef}
								type="file"
								accept="image/jpeg,image/png,image/heic,image/heif,image/webp,video/mp4,video/quicktime,video/webm,video/x-m4v"
								className="hidden"
								onChange={handleReupload}
								disabled={isReuploading}
							/>
						</label>
					</div>

					{/* Media content */}
					<div className="max-w-[90vw] max-h-[85vh] flex items-center justify-center p-4">
						{currentMedia.mediaType === "video" ? (
							currentMedia.streamVideoUid ? (
								currentMedia.streamReady === false ? (
									// Stream video still processing
									<div
										className="text-center text-white p-8"
										onClick={(e) => e.stopPropagation()}
									>
										<div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
										<p className="text-lg">Spracuva sa...</p>
										<p className="text-sm text-white/60 mt-2">
											Video sa este spracuvava, skuste to neskor.
										</p>
									</div>
								) : (
									// CF Stream iframe player
									<iframe
										key={currentMedia.id}
										src={getFullUrl(currentMedia)}
										title={currentMedia.fileName}
										className="w-full h-full max-w-[90vw] max-h-[80vh]"
										style={{ minHeight: "60vh", minWidth: "70vw" }}
										allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
										allowFullScreen
										onClick={(e) => e.stopPropagation()}
									/>
								)
							) : (
								// Legacy R2 video — <video> element
								<video
									key={currentMedia.id}
									src={getFullUrl(currentMedia)}
									controls
									autoPlay
									muted
									playsInline
									className="max-w-full max-h-[80vh] rounded-lg"
									onClick={(e) => e.stopPropagation()}
									onError={() => setFullImageError(true)}
								/>
							)
						) : (
							<>
								{/* Thumbnail as placeholder while full loads */}
								{!fullImageLoaded && !fullImageError && (
									<div className="relative">
										<img
											src={getThumbnailUrl(currentMedia)}
											alt={currentMedia.fileName}
											className="max-w-full max-h-[80vh] object-contain rounded-lg opacity-50"
										/>
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
										</div>
									</div>
								)}
								{fullImageError && (
									<div className="text-center text-white/70 py-12">
										<div className="text-4xl mb-3">😔</div>
										<p>Obrázok sa nepodarilo načítať</p>
									</div>
								)}
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation prevents overlay close */}
								<img
									key={currentMedia.id}
									src={getFullUrl(currentMedia)}
									alt={currentMedia.fileName}
									className={`max-w-full max-h-[80vh] object-contain rounded-lg ${fullImageLoaded ? "" : "hidden"}`}
									onLoad={() => setFullImageLoaded(true)}
									onError={() => setFullImageError(true)}
									onClick={(e) => e.stopPropagation()}
								/>
							</>
						)}
					</div>

					{/* Click outside to close */}
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: Lightbox backdrop click to close */}
					{/* biome-ignore lint/a11y/noStaticElementInteractions: Lightbox backdrop is clickable */}
					<div className="absolute inset-0 -z-10" onClick={closeLightbox} />
				</div>
			)}
		</div>
	);
}
