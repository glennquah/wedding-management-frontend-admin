'use client';

import { useEffect, useState } from 'react';

import { ImageProps } from '../[micrositeSlug]/album/page';
import SharedModal from './SharedModal';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from '@shared/components/ui/dialog';
import { motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { VisuallyHidden } from 'radix-ui';

// Custom keypress hook
function useKeypress(key: string, action: () => void) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === key) action();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [key, action]);
}

export default function Modal({ images, onClose }: { images: ImageProps[]; onClose?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const photoIdParam = searchParams?.get('photoId') ?? '0';
  const index = Number(photoIdParam);

  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(index);

  const pathname = usePathname();

  useEffect(() => {
    setCurIndex(index);
  }, [index]);

  const handleClose = () => {
    onClose?.();
  };

  const changePhotoId = (newVal: number) => {
    setDirection(newVal > curIndex ? 1 : -1);
    setCurIndex(newVal);
    router.replace(`${pathname}?photoId=${newVal}`, { scroll: false });
  };

  useKeypress('ArrowRight', () => {
    if (curIndex + 1 < images.length) changePhotoId(curIndex + 1);
  });

  useKeypress('ArrowLeft', () => {
    if (curIndex > 0) changePhotoId(curIndex - 1);
  });

  return (
    <Dialog open onOpenChange={(open) => !open && handleClose()}>
      <DialogOverlay asChild>
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      </DialogOverlay>

      <DialogContent className="w-[90vw] h-[85vh] max-w-none p-0 rounded-none border-0 bg-transparent shadow-none flex items-center justify-center backdrop-none">
        <DialogTitle>
          <VisuallyHidden.Root>Photo viewer</VisuallyHidden.Root>
        </DialogTitle>

        <div className="w-full h-full">
          <SharedModal
            index={curIndex}
            direction={direction}
            images={images}
            changePhotoId={changePhotoId}
            closeModal={handleClose}
            navigation
          />
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
