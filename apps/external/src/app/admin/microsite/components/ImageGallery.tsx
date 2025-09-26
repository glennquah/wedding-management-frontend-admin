'use client';

import { CreateMicrositeDto } from '@shared/api';
import ImageUploadWidget from '@shared/components/CloudinaryUploadWidget';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ImageGalleryProps {
  formData: CreateMicrositeDto;
  handleImageUpload: (field: 'heroImages' | 'imageGallery', url: string) => void;
  removeImage: (field: 'heroImages' | 'imageGallery', index: number) => void;
}

export function ImageGallery({ formData, handleImageUpload, removeImage }: ImageGalleryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Gallery</CardTitle>
        <CardDescription>Upload images for the gallery section</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(formData.imageGallery ?? []).map((url, index) => (
            <div key={index} className="relative group h-24">
              <Image
                src={url}
                alt={`Gallery ${index + 1}`}
                fill
                className="object-cover rounded-lg"
                sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
              />
              <button
                type="button"
                onClick={() => removeImage('imageGallery', index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
            <ImageUploadWidget
              onUpload={(url) => handleImageUpload('imageGallery', url)}
              buttonText="Upload"
              maxImageWidth={600}
              maxImageHeight={600}
              minImageWidth={300}
              minImageHeight={300}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {formData.imageGallery?.length ?? 0} images uploaded
        </p>
      </CardContent>
    </Card>
  );
}
