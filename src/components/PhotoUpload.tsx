import { useCallback, useRef, useState } from "react";
import { TrashIcon, XIcon } from "@phosphor-icons/react";

interface Photo {
  id: string;
  url: string;
  name: string;
  size: number;
  uploadedAt: Date;
}

export function PhotoUpload() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showWifiWarning, setShowWifiWarning] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      // Convert FileList to Photo objects with preview URLs
      const newPhotos: Photo[] = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        uploadedAt: new Date()
      }));

      setPhotos((prev) => [...prev, ...newPhotos]);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    []
  );

  const handleDelete = useCallback((photoId: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === photoId);
      if (photo) {
        URL.revokeObjectURL(photo.url); // Clean up memory
      }
      return prev.filter((p) => p.id !== photoId);
    });
    setSelectedPhoto(null);
  }, []);

  const openLightbox = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

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
          />
          <label
            htmlFor="photo-upload-input"
            className="block w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-md cursor-pointer text-center"
          >
            ➕ Pridať fotky ({photos.length}/neobmedzené)
          </label>
        </div>

        {/* Photo Grid */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group cursor-pointer"
                onClick={() => openLightbox(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(photo.id);
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
              handleDelete(selectedPhoto.id);
            }}
            className="absolute bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full py-3 px-6 transition-colors shadow-lg flex items-center gap-2"
            type="button"
          >
            <TrashIcon size={20} weight="fill" />
            Vymazať fotku
          </button>

          <img
            src={selectedPhoto.url}
            alt={selectedPhoto.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
