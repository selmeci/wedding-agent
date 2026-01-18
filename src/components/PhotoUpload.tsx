import { TrashIcon, XIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrokenHeart, PhotoUploadAnimation } from "@/components/PixelArt";

interface Photo {
	id: string;
	fileName: string;
	uploadedAt: Date;
	thumbnailUrl: string;
	fullUrl: string;
}

interface PhotoUploadProps {
	qrToken: string;
	guestId: string | null;
	adminSecret?: string | null;
}

export function PhotoUpload({
	qrToken,
	guestId,
	adminSecret,
}: PhotoUploadProps) {
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
	const [showWifiWarning, setShowWifiWarning] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [currentUpload, setCurrentUpload] = useState(0);
	const [totalUploads, setTotalUploads] = useState(0);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Fetch photos on mount
	useEffect(() => {
		if (!qrToken) return;

		const fetchPhotos = async () => {
			try {
				const response = await fetch("/api/photos", {
					headers: {
						"x-qr-token": qrToken,
					},
				});

				if (!response.ok) {
					console.error("Failed to fetch photos:", await response.text());
					return;
				}

				const data = await response.json<{ photos: Photo[] }>();
				setPhotos(
					data.photos.map((p: Photo) => ({
						...p,
						uploadedAt: new Date(p.uploadedAt),
					})),
				);
			} catch (error) {
				console.error("Error fetching photos:", error);
			}
		};

		fetchPhotos();
	}, [qrToken]);

	const handleFileSelect = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (!files || files.length === 0) return;

			setIsLoading(true);
			setTotalUploads(files.length);
			setCurrentUpload(0);

			let uploaded = 0;
			for (const file of Array.from(files)) {
				try {
					// Create FormData
					const formData = new FormData();
					formData.append("file", file);

					// Upload to API
					const headers: Record<string, string> = {
						"x-qr-token": qrToken,
					};
					if (guestId) {
						headers["x-guest-id"] = guestId;
					}
					if (adminSecret) {
						headers["x-admin-secret"] = adminSecret;
					}
					const response = await fetch("/api/photos", {
						body: formData,
						headers,
						method: "POST",
					});

					if (!response.ok) {
						const error = await response.json();
						console.error("Upload failed:", error);
						// @ts-expect-error error.error is always defined
						alert(`Nepodarilo sa nahrať ${file.name}: ${error.error}`);
						continue;
					}

					const uploadedPhoto = await response.json<Photo>();

					// Add to photos list
					setPhotos((prev) => [
						{
							fileName: uploadedPhoto.fileName,
							fullUrl: `/api/photos/${uploadedPhoto.id}/full`,
							id: uploadedPhoto.id,
							thumbnailUrl: `/api/photos/${uploadedPhoto.id}/thumbnail`,
							uploadedAt: new Date(uploadedPhoto.uploadedAt),
						},
						...prev,
					]);

					uploaded++;
					setCurrentUpload(uploaded);
				} catch (error) {
					console.error("Upload error:", error);
					alert(`Chyba pri nahrávaní ${file.name}`);
				}
			}

			setIsLoading(false);
			setCurrentUpload(0);
			setTotalUploads(0);

			// Reset input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
		[qrToken, guestId, adminSecret],
	);

	const openDeleteModal = useCallback((photoId: string) => {
		setPhotoToDelete(photoId);
		setIsDeleteModalOpen(true);
	}, []);

	const closeDeleteModal = useCallback(() => {
		setIsDeleteModalOpen(false);
		setPhotoToDelete(null);
	}, []);

	const confirmDelete = useCallback(async () => {
		if (!photoToDelete) return;

		try {
			const response = await fetch(`/api/photos/${photoToDelete}`, {
				headers: {
					"x-qr-token": qrToken,
				},
				method: "DELETE",
			});

			if (!response.ok) {
				const error = await response.json();
				console.error("Delete failed:", error);
				// @ts-expect-error error.error is always defined
				alert(`Nepodarilo sa vymazať fotku: ${error.error}`);
				return;
			}

			// Remove from state
			setPhotos((prev) => prev.filter((p) => p.id !== photoToDelete));
			setSelectedPhoto(null);
			closeDeleteModal();
		} catch (error) {
			console.error("Delete error:", error);
			alert("Chyba pri mazaní fotky");
		}
	}, [photoToDelete, qrToken, closeDeleteModal]);

	const openLightbox = useCallback((photo: Photo) => {
		setSelectedPhoto(photo);
	}, []);

	const closeLightbox = useCallback(() => {
		setSelectedPhoto(null);
	}, []);

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

	return (
		<div className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-br from-pink-50 via-white to-pink-100 p-4">
			<div className="max-w-4xl mx-auto space-y-4">
				{/* Header */}
				<div className="text-center">
					<h2 className="text-2xl font-serif text-pink-600 mb-2 flex items-center justify-center gap-2">
						📸 Svadovné Spomienky
					</h2>
					<p className="text-sm text-gray-600">
						Zdieľajte svoje fotky zo svadby s nami!
					</p>
				</div>

				{/* WiFi Warning Banner */}
				{showWifiWarning && (
					<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-start gap-3">
						<div className="text-xl">⚡</div>
						<div className="flex-1 text-sm text-yellow-800">
							<strong>Tip:</strong> Používajte WiFi pre rýchlejšie nahrávanie
							fotiek.
						</div>
						<button
							onClick={() => setShowWifiWarning(false)}
							className="text-yellow-600 hover:text-yellow-800 transition-colors"
							type="button"
							aria-label="Zavrieť upozornenie"
						>
							<XIcon size={20} />
						</button>
					</div>
				)}

				{/* Upload Progress with Animation */}
				{isLoading && totalUploads > 0 && (
					<div className="bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100 border border-pink-300 rounded-xl p-4">
						<PhotoUploadAnimation
							currentUpload={currentUpload}
							totalUploads={totalUploads}
						/>
					</div>
				)}

				{/* Upload Button */}
				<div>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/jpeg,image/png,image/heic,image/heif,image/webp"
						multiple
						onChange={handleFileSelect}
						className="hidden"
						id="photo-upload-input"
						disabled={isLoading}
					/>
					<label
						htmlFor="photo-upload-input"
						className={`block w-full font-medium py-3 px-4 rounded-xl transition-colors shadow-md text-center ${
							isLoading
								? "bg-gray-400 cursor-not-allowed"
								: "bg-pink-500 hover:bg-pink-600 cursor-pointer"
						} text-white`}
					>
						{isLoading
							? "Nahrávam..."
							: `➕ Pridať fotky (${photos.length}/neobmedzené)`}
					</label>
				</div>

				{/* Photo Grid */}
				{photos.length > 0 ? (
					<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
						{photos.map((photo) => (
							// biome-ignore lint/a11y/useKeyWithClickEvents: Photo grid items are clickable for lightbox
							// biome-ignore lint/a11y/noStaticElementInteractions: Photo grid items open lightbox on click
							<div
								key={photo.id}
								className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group cursor-pointer"
								onClick={() => openLightbox(photo)}
							>
								<img
									src={photo.thumbnailUrl}
									alt={photo.fileName}
									className="w-full h-full object-cover"
									loading="lazy"
								/>
								{/* Delete Button */}
								<button
									onClick={(e) => {
										e.stopPropagation();
										openDeleteModal(photo.id);
									}}
									className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
									type="button"
									aria-label="Vymazať fotku"
								>
									<TrashIcon size={16} weight="fill" />
								</button>
							</div>
						))}
					</div>
				) : (
					/* Empty State */
					<div className="text-center py-16 px-4">
						<div className="text-6xl mb-4">📷</div>
						<h3 className="text-xl font-semibold text-gray-700 mb-2">
							Zatiaľ tu nie sú žiadne fotky
						</h3>
						<p className="text-gray-500 text-sm">
							Pridajte prvú fotku kliknutím na tlačidlo vyššie
						</p>
					</div>
				)}

				{/* Photo Counter */}
				{photos.length > 0 && (
					<div className="text-center text-sm text-gray-600 pb-4">
						{photos.length}{" "}
						{photos.length === 1
							? "fotka nahraná"
							: photos.length < 5
								? "fotky nahrané"
								: "fotiek nahraných"}
					</div>
				)}
			</div>

			{/* Lightbox */}
			{selectedPhoto && (
				// biome-ignore lint/a11y/useKeyWithClickEvents: Lightbox overlay closes on click
				// biome-ignore lint/a11y/noStaticElementInteractions: Lightbox overlay is clickable to close
				<div
					className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
					onClick={closeLightbox}
				>
					<button
						onClick={closeLightbox}
						className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-all shadow-lg ring-2 ring-white/30"
						type="button"
						aria-label="Zavrieť náhľad"
					>
						<XIcon size={24} weight="bold" />
					</button>

					<button
						onClick={(e) => {
							e.stopPropagation();
							openDeleteModal(selectedPhoto.id);
						}}
						className="absolute bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full py-3 px-6 transition-colors shadow-lg flex items-center gap-2"
						type="button"
					>
						<TrashIcon size={20} weight="fill" />
						Vymazať fotku
					</button>

					{/* biome-ignore lint/a11y/useKeyWithClickEvents: Image stopPropagation prevents overlay close */}
					<img
						src={selectedPhoto.fullUrl}
						alt={selectedPhoto.fileName}
						className="max-w-full max-h-full object-contain"
						onClick={(e) => e.stopPropagation()}
					/>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{isDeleteModalOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
					{/* Backdrop */}
					{/** biome-ignore lint/a11y/useKeyWithClickEvents: Image stopPropagation prevents overlay close */}
					{/** biome-ignore lint/a11y/noStaticElementInteractions: Image is clickable to close */}
					<div
						className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
						onClick={closeDeleteModal}
					/>

					{/* Modal Card */}
					<div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 fade-in duration-200">
						{/* Pink Gradient Header */}
						<div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-t-2xl p-6 text-center">
							<BrokenHeart className="w-20 h-20 mx-auto mb-3" />
							<h3 className="text-xl font-bold text-white">Vymazať fotku?</h3>
						</div>

						{/* Content */}
						<div className="p-6 text-center">
							<p className="text-gray-700 mb-6">
								Táto akcia sa nedá vrátiť späť. Fotka bude natrvalo vymazaná.
							</p>

							{/* Buttons */}
							<div className="flex gap-3 justify-center">
								<button
									onClick={closeDeleteModal}
									className="px-6 py-2.5 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors min-w-[120px]"
									type="button"
								>
									Zrušiť
								</button>
								<button
									onClick={confirmDelete}
									className="px-6 py-2.5 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-md min-w-[120px] flex items-center justify-center gap-2"
									type="button"
								>
									<TrashIcon size={18} weight="fill" />
									Vymazať
								</button>
							</div>
						</div>

						{/* Close button (X) */}
						<button
							onClick={closeDeleteModal}
							className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2"
							type="button"
							aria-label="Zavrieť"
						>
							<XIcon size={20} weight="bold" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
