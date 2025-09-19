'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/ui/dialog';
import Image from 'next/image';

export default function GalleryDialog({
  open,
  onOpenChange,
  images,
  columns = 3,
  title = 'All Photos',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  columns?: number;
  title?: string;
}) {
  const gridCols =
    columns >= 6
      ? 'md:grid-cols-6 sm:grid-cols-4 grid-cols-2'
      : columns >= 4
        ? 'sm:grid-cols-4 grid-cols-2'
        : 'grid-cols-2';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-auto">
          <div className={`grid ${gridCols} gap-2`}>
            {images.map((src, idx) => (
              <div key={idx} className="relative aspect-square overflow-hidden rounded-md">
                <Image src={src} alt={`gallery-${idx}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
