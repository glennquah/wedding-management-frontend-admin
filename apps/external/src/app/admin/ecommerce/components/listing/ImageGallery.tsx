import Image from 'next/image';
import { ImageGalleryProps } from '../../types';

export function ImageGallery({ imageUrls, listingName }: ImageGalleryProps) {
  return (
    <div className="space-y-4">
      <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {imageUrls && imageUrls.length > 0 ? (
          <Image
            src={imageUrls[0]}
            alt={listingName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center text-2xl">
                📷
              </div>
              <span>No image available</span>
            </div>
          </div>
        )}
      </div>

      {imageUrls && imageUrls.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {imageUrls.slice(1, 5).map((imageUrl, index) => (
            <div key={index} className="aspect-square relative rounded-md overflow-hidden">
              <Image
                src={imageUrl}
                alt={`${listingName} ${index + 2}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12.5vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}