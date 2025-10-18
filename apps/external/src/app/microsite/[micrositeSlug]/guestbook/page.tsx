'use client';

import React, { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

import MicrositeLogin from '../../components/MicrositeLogin';
import { PageProps } from '../page';
import { AddNoteForm } from './components/AddNoteDialog';
import Page from './components/Page';
import PageCover from './components/PageCover';
import { useMicrositeManager } from '@/app/hooks/useMicrositeManager';
import { CreateGuestbookNoteDto, GuestbookResponseDto, GuestbookService } from '@shared/api';
import { Button } from '@shared/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/components/ui/dialog';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface FlipBookProps {
  children: React.ReactNode;
  width: number;
  height: number;
  onInit?: () => void;
  [key: string]: unknown;
}
interface PageFlipAPI {
  flipNext: () => void;
  flipPrev: () => void;
  getPageCount: () => number;
}
interface FlipBookRef {
  pageFlip: () => PageFlipAPI;
}
type PageFlipEvent = {
  data: number;
};
const TypedHTMLFlipBook = HTMLFlipBook as unknown as React.FC<FlipBookProps>;

export default function FlipbookGuestbook({ params }: PageProps) {
  const isMobile = useIsMobileScreen();
  const router = useRouter();

  const resolvedParams = use(params);
  const decodedPlanName = useMemo(
    () => decodeURIComponent(resolvedParams.micrositeSlug),
    [resolvedParams.micrositeSlug],
  );

  const [guestbook, setGuestbook] = useState<GuestbookResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const flipBookRef = useRef<FlipBookRef | null>(null);

  const {
    micrositeData,
    micrositeError,
    hasAccess,
    isWeddingLive,
    fetchMicrositeData,
    handleMicrositeLogin,
    setHasAccess,
    checkWeddingStatus,
  } = useMicrositeManager();

  const fetchGuestbookData = useCallback(async () => {
    if (!micrositeData?.weddingId) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data = await GuestbookService.guestbookControllerGetGuestbookByWeddingId(
        micrositeData.weddingId,
      );
      setGuestbook(data);
    } catch {
      setGuestbook(null);
    } finally {
      setIsLoading(false);
    }
  }, [micrositeData?.weddingId]);

  useEffect(() => {
    setIsCheckingAccess(false);
    setHasAccess(false);
    fetchMicrositeData(decodedPlanName);
  }, [decodedPlanName, fetchMicrositeData, setHasAccess]);

  useEffect(() => {
    if (micrositeData) {
      checkWeddingStatus();
    }
  }, [micrositeData]);

  useEffect(() => {
    fetchGuestbookData();
    console.log(isWeddingLive);
  }, [fetchGuestbookData, micrositeData?.weddingId]);

  const handleFormSubmit = async (formData: CreateGuestbookNoteDto) => {
    if (!micrositeData?.weddingId) return;

    try {
      await GuestbookService.guestbookControllerAddGuestNote(micrositeData.weddingId, formData);
      setIsFormOpen(false);
      await fetchGuestbookData();
      toast.success('Note added');
    } catch (error) {
      console.error('Failed to add note:', error);
      toast.error('Fail to add note');
    }
  };

  const handleNextPage = useCallback(() => {
    flipBookRef.current?.pageFlip().flipNext();
  }, []);

  const handlePrevPage = useCallback(() => {
    flipBookRef.current?.pageFlip().flipPrev();
  }, []);

  const onPageFlip = useCallback((e: PageFlipEvent) => {
    setCurrentPage(e.data);
  }, []);

  const handleInit = useCallback(() => {
    if (flipBookRef.current) {
      const pageCount = flipBookRef.current.pageFlip().getPageCount();
      setTotalPages(pageCount);
    }
  }, []);

  if (isCheckingAccess || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        {isLoading ? 'Loading Guestbook...' : 'Checking access...'}
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

  if (!hasAccess) {
    return (
      <MicrositeLogin
        micrositeData={micrositeData}
        decodedPlanName={decodedPlanName}
        handleMicrositeLogin={handleMicrositeLogin}
      />
    );
  }

  if (!isWeddingLive) {
    toast.error('Not wedding day yet!');
    router.push(`/microsite/${decodedPlanName}`);
    return null;
  }

  const pageElements = [];

  if (guestbook && guestbook.guestNotes && guestbook.guestNotes.length > 0) {
    // If there are notes, push the note pages into the array
    guestbook.guestNotes.forEach((note, index) => {
      pageElements.push(
        <Page key={index} number={index + 1}>
          <h3
            className="text-3xl mb-4 text-stone-800"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            A Note from {note.guestName}
          </h3>
          <p className="italic">&ldquo;{note.guestNote}&rdquo;</p>
        </Page>,
      );
    });
    // Add a blank page if needed to make the total even
    if (guestbook.guestNotes.length % 2 !== 0) {
      pageElements.push(
        <Page key="even-out-page" number={guestbook.guestNotes.length + 1}>
          <></>
        </Page>,
      );
    }
  } else {
    // If there are no notes, push the placeholder pages into the array
    pageElements.push(
      <Page key="placeholder-1" number={1}>
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <h3 className="text-2xl text-stone-800" style={{ fontFamily: "'Great Vibes', cursive" }}>
            Be the first to leave a note!
          </h3>
          <p className="mt-4 italic">Share a memory or well wishes with the happy couple.</p>
        </div>
      </Page>,
    );
    pageElements.push(
      <Page key="placeholder-2" number={2}>
        <></>
      </Page>,
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Lora&display=swap');
        .page,
        .page-cover {
          padding: 0;
          border: 0;
          background-color: transparent;
        }
      `}</style>
      <div
        className="w-full min-h-screen flex flex-col items-center justify-center p-5 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dnyxxyolp/image/upload/v1760625017/wooden-table_vuzm8e.jpg')",
        }}
      >
        {
          <>
            {isWeddingLive && (
              <div className="absolute top-4 right-4 z-50 flex gap-3">
                <Button
                  onClick={() => router.push(`/microsite/${decodedPlanName}/album`)}
                  className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white rounded-full"
                >
                  View Album
                </Button>
                <Button
                  onClick={() => router.push(`/microsite/${decodedPlanName}`)}
                  className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white rounded-full"
                >
                  View Microsite
                </Button>
              </div>
            )}
            <TypedHTMLFlipBook
              width={isMobile ? 250 : 450}
              height={isMobile ? 400 : 650}
              size="fixed"
              showCover={true}
              onFlip={onPageFlip}
              onInit={handleInit}
              ref={flipBookRef}
              className="guestbook-album "
            >
              <PageCover>Our Guestbook</PageCover>

              {pageElements}

              <PageCover>The End</PageCover>
            </TypedHTMLFlipBook>
            <div className="mt-8 flex items-center gap-4">
              <Button variant="default" onClick={handlePrevPage}>
                Previous
              </Button>
              <span className="text-sm text-white bg-black/30 px-3 py-1 rounded-md backdrop-blur-sm">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button variant="default" onClick={handleNextPage}>
                Next
              </Button>
            </div>

            {/* Add Note Button and Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <button className="fixed sm:bottom-10 sm:right-10 md:bottom-25 md:right-45 z-10 cursor-pointer p-0 border-none bg-transparent">
                  <Image
                    src="https://res.cloudinary.com/dnyxxyolp/image/upload/v1760678608/fountain-pen_te6flc.png"
                    alt="Add a Note"
                    width={256}
                    height={256}
                    className="w-25 sm:w-40 h-auto transform hover:scale-105 transition-transform"
                  />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle
                    style={{ fontFamily: "'Great Vibes', cursive" }}
                    className="text-3xl"
                  >
                    Leave a Note
                  </DialogTitle>
                  <DialogDescription>
                    Share a memory or well wishes with the happy couple.
                  </DialogDescription>
                </DialogHeader>
                <AddNoteForm onSubmit={handleFormSubmit} onClose={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </>
        }
      </div>
    </>
  );
}
