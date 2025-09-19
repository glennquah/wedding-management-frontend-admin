'use client';

import { useEffect, useMemo, useRef } from 'react';

import TemplateOne from '../../../microsite/components/templates/templateOne';
import TemplateThree from '../../../microsite/components/templates/templateThree';
import TemplateTwo from '../../../microsite/components/templates/templateTwo';
import { useMicrositePreviewStore } from '../../../store/micrositePreviewStore';
import { useRouter } from 'next/navigation';

export default function MicrositePreviewPage() {
  const router = useRouter();
  const { data } = useMicrositePreviewStore();
  const rsvpRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!data) {
      // No preview data, go back to form
      router.replace('/admin/microsite');
    }
  }, [data, router]);

  const content = useMemo(() => {
    if (!data) return null;
    switch (data.templateNumber) {
      case 1:
        return (
          <TemplateOne
            micrositeData={data}
            rsvpRef={rsvpRef}
            guestDetails={null}
            handleConfirmGuestAttendance={async () => {}}
          />
        );
      case 2:
        return (
          <TemplateTwo
            micrositeData={data}
            rsvpRef={rsvpRef}
            guestDetails={null}
            handleConfirmGuestAttendance={async () => {}}
          />
        );
      default:
        return (
          <TemplateThree
            micrositeData={data}
            rsvpRef={rsvpRef}
            guestDetails={null}
            handleConfirmGuestAttendance={async () => {}}
          />
        );
    }
  }, [data]);

  if (!data) return null;

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">Previewing template {data.templateNumber}</div>
          <button
            className="text-sm px-3 py-1 rounded-md border hover:bg-gray-50"
            onClick={() => router.push('/admin/microsite')}
          >
            Back to form
          </button>
        </div>
      </div>

      {content}
    </div>
  );
}
