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

interface HeroImagesProps {
  formData: CreateMicrositeDto;
  handleImageUpload: (field: 'heroImages' | 'imageGallery', url: string) => void;
  removeImage: (field: 'heroImages' | 'imageGallery', index: number) => void;
}

export function HeroImages({ formData, handleImageUpload, removeImage }: HeroImagesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Images</CardTitle>
        <CardDescription>Upload 5 images for the rotating hero section</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(formData.heroImages ?? []).map((url, index) => (
            <div key={index} className="relative group h-32 rounded-lg overflow-hidden">
              <Image
                src={url}
                alt={`Hero ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                priority={index === 0}
              />
              <button
                type="button"
                aria-label={`Remove hero image ${index + 1}`}
                onClick={() => removeImage('heroImages', index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {(formData.heroImages?.length ?? 0) < 5 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
              <ImageUploadWidget
                onUpload={(url) => handleImageUpload('heroImages', url)}
                buttonText="Upload"
                maxImageWidth={800}
                maxImageHeight={600}
                minImageWidth={400}
                minImageHeight={300}
              />
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {formData.heroImages?.length ?? 0}/5 images uploaded
        </p>
      </CardContent>
    </Card>
  );
}
