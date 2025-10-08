'use client';

import { use, useEffect, useMemo, useRef, useState } from 'react';

import MicrositeLogin from '../../components/MicrositeLogin';
import Modal from '../../components/Modal';
import { downloadImagesAsZip } from '../../utils/downloadPhoto';
import { PageProps } from '../page';
import { useMicrositeManager } from '@/app/hooks/useMicrositeManager';
import { AlbumResponseDto, AlbumService } from '@shared/api';
import { Button, ImageUploadWidget } from '@shared/components';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export interface ImageProps {
  id: number;
  height: string;
  width: string;
  image_url: string;
  format: string;
}

export default function AlbumPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const decodedPlanName = useMemo(
    () => decodeURIComponent(resolvedParams.micrositeSlug),
    [resolvedParams.micrositeSlug],
  );

  const [images, setImages] = useState<ImageProps[]>([]);
  const [photoId, setPhotoId] = useState<number | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [album, setAlbum] = useState<AlbumResponseDto | null>(null);
  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  const router = useRouter();

  const {
    micrositeData,
    isLoadingMicrosite,
    micrositeError,
    hasAccess,
    fetchMicrositeData,
    handleMicrositeLogin,
    setHasAccess,
  } = useMicrositeManager();

  // fetch microsite data
  useEffect(() => {
    setIsCheckingAccess(false);
    setHasAccess(false);
    fetchMicrositeData(decodedPlanName);
  }, [decodedPlanName, fetchMicrositeData, setHasAccess]);

  // fetch album data + map images
  useEffect(() => {
    async function fetchAlbum() {
      try {
        if (micrositeData?.weddingId) {
          const fetchedAlbum = await AlbumService.albumControllerGetAlbumByWeddingId(
            micrositeData?.weddingId,
          );
          setAlbum(fetchedAlbum);

          const mappedImages: ImageProps[] =
            fetchedAlbum.photos?.map((url, i) => ({
              id: i,
              image_url: url,
              format: url.split('.').pop() || 'jpg',
              width: '720',
              height: '480',
            })) || [];

          setImages(mappedImages);
        }
      } catch (err) {
        console.error('Error fetching album:', err);
      }
    }

    fetchAlbum();
  }, [micrositeData?.weddingId]);

  // Scroll to last viewed photo on modal close
  useEffect(() => {
    if (photoId === null && lastViewedPhotoRef.current) {
      lastViewedPhotoRef.current.scrollIntoView({ block: 'center' });
    }
  }, [photoId]);

  /* 
    -----------
    VALIDATIONS
    -----------
  */
  if (isCheckingAccess || isLoadingMicrosite) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        {isLoadingMicrosite ? 'Loading microsite...' : 'Checking access...'}
      </div>
    );
  }

  if (micrositeError) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        {micrositeError}
      </div>
    );
  }

  if (!micrositeData) {
    router.replace('/microsite/not-found');
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Redirecting to not found page...
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <MicrositeLogin
        micrositeData={micrositeData}
        decodedPlanName={decodedPlanName}
        handleMicrositeLogin={handleMicrositeLogin}
      />
    );
  }

  const today = new Date();
  const weddingDate = new Date(micrositeData.weddingDate || '');

  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const weddingDateOnly = new Date(
    weddingDate.getFullYear(),
    weddingDate.getMonth(),
    weddingDate.getDate(),
  );

  if (todayDateOnly < weddingDateOnly) {
    toast.error('Not wedding day yet!');
    router.push(`/microsite/${decodedPlanName}`);
    return null;
  }

  return (
    <main className="mx-auto max-w-[1960px] p-4 bg-black min-h-screen text-white">
      {photoId !== null && (
        <Modal
          images={images}
          onClose={() => {
            setPhotoId(null);
          }}
        />
      )}

      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
        <div className={images.length === 0 ? 'flex min-h-screen items-center justify-center' : ''}>
          {album && (
            <div
              className="relative flex h-[630px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 pb-16 text-center"
              style={{
                backgroundImage:
                  "url('https://res.cloudinary.com/dnyxxyolp/image/upload/v1759851783/ring_qy7s3y.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backdropFilter: 'blur(4px)',
              }}
            >
              <div className="absolute inset-0 pointer-events-none rounded-lg bg-gradient-to-t from-transparent via-black/30 to-black/60" />

              <div
                className="relative z-10 text-white"
                style={{ textShadow: '0 0 5px rgba(0,0,0,0.7)' }}
              >
                <h1 className="mt-10 mb-5 text-2xl font-bold uppercase tracking-widest">
                  {album.coupleName} Wedding Photos
                </h1>

                <div className="flex justify-center gap-3">
                  <ImageUploadWidget
                    folder={`${album.coupleName}-${micrositeData.weddingDate?.split('T')[0]}`}
                    onUpload={async (url) => {
                      try {
                        const updatedAlbum = await AlbumService.albumControllerAddPhoto(album.id, {
                          weddingId: album.weddingId,
                          photoUrl: url,
                        });
                        setAlbum(updatedAlbum);
                        const mappedImages: ImageProps[] =
                          updatedAlbum.photos?.map((url, i) => ({
                            id: i,
                            image_url: url,
                            format: url.split('.').pop() || 'jpg',
                            width: '720',
                            height: '480',
                          })) || [];
                        setImages(mappedImages);
                      } catch (err) {
                        console.error('Failed to add photo:', err);
                      }
                    }}
                  />

                  <Button onClick={() => downloadImagesAsZip(images)}>Download Album</Button>
                </div>

                {album.landingMessage && (
                  <p className="max-w-[60ch] sm:max-w-[40ch] mx-auto text-black mt-6">
                    <span
                      className="text-lg"
                      style={{ textShadow: '0 0 3px rgba(255,255,255,0.6)' }}
                    >
                      <b>{album.landingMessage}</b>
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {images.map(({ id, image_url }) => (
          <Link
            key={id}
            href={`/microsite/${decodedPlanName}/album/${id}`}
            onClick={(e) => {
              e.preventDefault();
              setPhotoId(id);
              router.replace(`?photoId=${id}`, { scroll: false });
            }}
            ref={id === photoId ? lastViewedPhotoRef : null}
            className="group relative mb-5 block w-full cursor-zoom-in after:content after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
          >
            <CldImage
              alt={`Gallery photo ${id + 1}`}
              className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
              src={image_url}
              width={720}
              height={480}
              crop="scale"
            />
          </Link>
        ))}
      </div>
    </main>
  );
}
