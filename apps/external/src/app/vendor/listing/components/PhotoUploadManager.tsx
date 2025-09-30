'use client';

import { ImageUploadWidget } from '@shared/components';
import { CldImage } from 'next-cloudinary';
import { X, Plus } from 'lucide-react';
import * as React from 'react';

interface PhotoUploadManagerProps {
  imageUrls: string[];
  onImageUrlsChange: (urls: string[]) => void;
  maxImages?: number;
}

export function PhotoUploadManager({
  imageUrls,
  onImageUrlsChange,
  maxImages = 7
}: PhotoUploadManagerProps) {
  const handleAddPhoto = (url: string) => {
    if (imageUrls.length < maxImages) {
      const newUrls = [...imageUrls, url];
      onImageUrlsChange(newUrls);
    }
  };

  const handleDeletePhoto = (indexToDelete: number) => {
    const updatedUrls = imageUrls.filter((_, index) => index !== indexToDelete);
    onImageUrlsChange(updatedUrls);
  };

  const canAddMore = imageUrls.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Photo Grid */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => handleDeletePhoto(index)}
            >
              <CldImage
                width={200}
                height={150}
                src={url}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                alt={`Listing photo ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg shadow-sm border transition-all duration-200"
              />
              {/* Translucent grey overlay with X in center */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                <X className="h-8 w-8 text-white" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Section */}
      {canAddMore && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
              <Plus className="h-5 w-5" />
              <span>Add Photo ({imageUrls.length}/{maxImages})</span>
            </div>
            <ImageUploadWidget
              onUpload={handleAddPhoto}
              maxImageWidth={800}
              buttonText={`Upload Photo ${imageUrls.length + 1}`}
            />
            <p className="text-xs text-gray-500 mt-2">
              Click to upload each photo one at a time. Upload section will remain visible until you reach the limit.
            </p>
          </div>
        </div>
      )}

      {/* Info Text */}
      <div className="text-xs text-gray-500">
        <p>Upload up to {maxImages} photos for your listing.</p>
        <p>Recommended size: 800x600px minimum. First image will be used as the main photo.</p>
      </div>

      {/* Max Limit Reached */}
      {!canAddMore && (
        <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
          Maximum number of photos reached ({maxImages}/{maxImages})
        </div>
      )}
    </div>
  );
}