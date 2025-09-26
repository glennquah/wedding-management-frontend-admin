'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/ui/dialog';
import Image from 'next/image';

export default function GalleryDialog({
  open,
  onOpenChange,
  images,
  title = 'All Photos',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  title?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-semibold text-center">{title}</DialogTitle>
          <p className="text-sm text-gray-600 text-center mt-2">
            {images.length} {images.length === 1 ? 'photo' : 'photos'}
          </p>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-4 p-4">
            {images.map((src, idx) => (
              <div key={idx} className="break-inside-avoid mb-4">
                <div className="relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white group">
                  <Image
                    src={src}
                    alt={`gallery-${idx}`}
                    width={400}
                    height={600}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
