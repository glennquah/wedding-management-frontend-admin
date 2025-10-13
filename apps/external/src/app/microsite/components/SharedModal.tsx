import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

import { ImageProps } from '../[micrositeSlug]/album/page';
import { downloadPhoto } from '../utils/downloadPhoto';
import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { CldImage } from 'next-cloudinary';

interface SharedModalProps {
  index: number;
  images?: ImageProps[];
  currentPhoto?: ImageProps;
  changePhotoId: (newVal: number) => void;
  closeModal: () => void;
  navigation: boolean;
  direction?: number;
}

export default function SharedModal({
  index,
  images,
  changePhotoId,
  closeModal,
  navigation,
  currentPhoto,
  direction,
}: SharedModalProps) {
  const [loaded, setLoaded] = useState(false);

  const range = (start: number, end: number) => {
    const output = [];
    if (typeof end === 'undefined') {
      end = start;
      start = 0;
    }
    for (let i = start; i < end; i += 1) {
      output.push(i);
    }
    return output;
  };

  const filteredImages = images?.filter((img: ImageProps) =>
    range(index - 15, index + 15).includes(img.id),
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (images && index < images.length - 1) changePhotoId(index + 1);
    },
    onSwipedRight: () => {
      if (images && index > 0) changePhotoId(index - 1);
    },
    trackMouse: true,
  });

  const currentImage = images ? images[index] : currentPhoto;

  return (
    <MotionConfig
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div
        className="relative z-50 flex w-[90vw] h-[85vh] items-center justify-center mx-auto"
        {...handlers}
      >
        {/* Main image */}
        <div className="relative flex w-full h-full items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={{
                enter: (direction: number) => {
                  return {
                    x: direction > 0 ? 1000 : -1000,
                    opacity: 0,
                  };
                },
                center: {
                  x: 0,
                  opacity: 1,
                },
                exit: (direction: number) => {
                  return {
                    x: direction < 0 ? 1000 : -1000,
                    opacity: 0,
                  };
                },
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full h-full flex items-center justify-center"
            >
              {currentImage && (
                <CldImage
                  src={currentImage.image_url}
                  width={1920}
                  height={1080}
                  crop="scale"
                  alt="Gallery image"
                  onLoad={() => setLoaded(true)}
                  className="object-contain w-full h-full"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Buttons + bottom nav */}
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center justify-center">
          {loaded && (
            <div className="relative aspect-[3/2] max-h-full w-full">
              {navigation && (
                <>
                  {images && index > 0 && (
                    <button
                      className="absolute left-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg hover:bg-black/75 hover:text-white focus:outline-none"
                      onClick={() => changePhotoId(index - 1)}
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                  )}
                  {images && index + 1 < images.length && (
                    <button
                      className="absolute right-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg hover:bg-black/75 hover:text-white focus:outline-none"
                      onClick={() => changePhotoId(index + 1)}
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  )}
                </>
              )}

              <div className="absolute top-0 right-0 flex items-center gap-2 p-3 text-white">
                {navigation && currentImage && (
                  <a
                    href={currentImage.image_url}
                    className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg hover:bg-black/75 hover:text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                  </a>
                )}
                <button
                  onClick={() =>
                    currentImage && downloadPhoto(currentImage.image_url, `${index}.jpg`)
                  }
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg hover:bg-black/75 hover:text-white"
                  title="Download fullsize version"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="absolute top-0 left-0 flex items-center gap-2 p-3 text-white">
                <button
                  onClick={() => closeModal()}
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg hover:bg-black/75 hover:text-white"
                >
                  {navigation ? (
                    <XMarkIcon className="h-5 w-5" />
                  ) : (
                    <ArrowUturnLeftIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Bottom nav */}
          {navigation && (
            <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-gradient-to-b from-black/0 to-black/60">
              <motion.div className="mx-auto mt-6 mb-6 flex aspect-[3/2] h-14">
                <AnimatePresence initial={false}>
                  {(filteredImages || []).map(({ image_url, id }) => (
                    <motion.button
                      key={id}
                      initial={{ width: '0%', x: `${Math.max((index - 1) * -100, 15 * -100)}%` }}
                      animate={{
                        scale: id === index ? 1.25 : 1,
                        width: '100%',
                        x: `${Math.max(index * -100, 15 * -100)}%`,
                      }}
                      exit={{ width: '0%' }}
                      onClick={() => changePhotoId(id)}
                      className={`${
                        id === index ? 'z-20 rounded-md shadow shadow-black/50' : 'z-10'
                      } relative inline-block w-full shrink-0 transform-gpu overflow-hidden focus:outline-none`}
                    >
                      <CldImage
                        src={image_url}
                        width={180}
                        height={120}
                        crop="scale"
                        alt="small photo"
                        className={`${
                          id === index
                            ? 'brightness-110 hover:brightness-110'
                            : 'brightness-50 contrast-125 hover:brightness-75'
                        } h-full transform object-cover transition`}
                      />
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  );
}
