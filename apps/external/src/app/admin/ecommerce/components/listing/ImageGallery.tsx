'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageGalleryProps } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@shared/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { X, Eye } from 'lucide-react';

export function ImageGallery({ imageUrls, listingName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="space-y-4">
        <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {imageUrls && imageUrls.length > 0 ? (
            <div
              className="relative w-full h-full cursor-pointer group"
              onClick={() => setSelectedImage(imageUrls[0])}
            >
              <Image
                src={imageUrls[0]}
                alt={listingName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                <Eye className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
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
              <div
                key={index}
                className="aspect-square relative rounded-md overflow-hidden cursor-pointer group"
                onClick={() => setSelectedImage(imageUrl)}
              >
                <Image
                  src={imageUrl}
                  alt={`${listingName} ${index + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 12.5vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
          <VisuallyHidden>
            <DialogTitle>{listingName} - Image Gallery</DialogTitle>
          </VisuallyHidden>
          <DialogClose className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-6 w-6 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
          {selectedImage && (
            <div className="relative w-full h-[90vh] flex items-center justify-center p-4">
              <Image
                src={selectedImage}
                alt={listingName}
                fill
                className="object-contain"
                sizes="95vw"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}