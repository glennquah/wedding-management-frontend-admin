'use client';

import { CreateMicrositeDto } from '@shared/api';
import ImageUploadWidget from '@shared/components/CloudinaryUploadWidget';
import { Badge } from '@shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { Star, StarOff, X } from 'lucide-react';
import Image from 'next/image';

interface ImageGalleryProps {
  formData: CreateMicrositeDto;
  handleImageUpload: (field: 'heroImages' | 'imageGallery', url: string) => void;
  removeImage: (field: 'heroImages' | 'imageGallery', index: number) => void;
  toggleHeroImage: (imageUrl: string) => void;
}

export function ImageGallery({
  formData,
  handleImageUpload,
  removeImage,
  toggleHeroImage,
}: ImageGalleryProps) {
  const allImages = formData.imageGallery ?? [];
  const heroImages = formData.heroImages ?? [];
  const heroImageCount = heroImages.length;

  const isHeroImage = (imageUrl: string) => heroImages.includes(imageUrl);

  const handleRemoveImage = (imageUrl: string) => {
    const galleryIndex = allImages.indexOf(imageUrl);
    if (galleryIndex !== -1) {
      // Remove from gallery
      removeImage('imageGallery', galleryIndex);

      // If it was a hero image, also remove from hero images
      if (isHeroImage(imageUrl)) {
        const heroIndex = heroImages.indexOf(imageUrl);
        if (heroIndex !== -1) {
          removeImage('heroImages', heroIndex);
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Image Gallery
          <Badge variant={heroImageCount === 0 ? 'destructive' : 'secondary'}>
            {heroImageCount} Hero Images
          </Badge>
        </CardTitle>
        <CardDescription className="space-y-2">
          <div>Upload images for your wedding microsite gallery.</div>
          <div className="text-sm bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              About Hero Images:
            </div>
            <div className="text-blue-800 dark:text-blue-200 text-xs space-y-1">
              <div>• Hero images are displayed prominently at the top of your microsite</div>
              <div>• Select at least 1 hero image to activate your microsite</div>
              <div>• You can select up to 5 images as hero images</div>
              <div>• Click the star icon on any uploaded image to toggle it as a hero image</div>
            </div>
          </div>
          {heroImageCount === 0 && (
            <div className="text-sm bg-red-50 dark:bg-red-950 p-2 rounded border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
              ⚠️ Please select at least one hero image to save your microsite
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allImages.map((url, index) => (
            <div key={index} className="relative group">
              <div
                className={`relative h-32 rounded-lg overflow-hidden border-2 transition-all ${
                  isHeroImage(url)
                    ? 'border-yellow-400 shadow-lg shadow-yellow-400/25'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Hero Image Badge */}
                {isHeroImage(url) && (
                  <div className="absolute top-1 left-1">
                    <Badge className="bg-yellow-500 text-yellow-900 text-xs px-1 py-0">Hero</Badge>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Toggle Hero Button */}
                  <button
                    type="button"
                    onClick={() => toggleHeroImage(url)}
                    className={`p-1 rounded-full transition-colors ${
                      isHeroImage(url)
                        ? 'bg-yellow-500 text-yellow-900 hover:bg-yellow-600'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                    title={isHeroImage(url) ? 'Remove from hero images' : 'Add to hero images'}
                    disabled={!isHeroImage(url) && heroImageCount >= 5}
                  >
                    {isHeroImage(url) ? (
                      <Star className="w-3 h-3 fill-current" />
                    ) : (
                      <StarOff className="w-3 h-3" />
                    )}
                  </button>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Upload Widget */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center h-32">
            <ImageUploadWidget
              onUpload={(url) => handleImageUpload('imageGallery', url)}
              buttonText="Upload Image"
              maxImageWidth={800}
              maxImageHeight={600}
              minImageWidth={300}
              minImageHeight={300}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{allImages.length} images uploaded</span>
          <span>
            {heroImageCount}/5 hero images selected
            {heroImageCount >= 5 && ' (maximum reached)'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
