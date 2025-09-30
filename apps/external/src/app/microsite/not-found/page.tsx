import { Button } from '@shared/components/ui/button';
import Link from 'next/link';

export default function MicrositeNotFound() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
      <div className="max-w-md text-center px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Microsite Not Found</h2>
          <p className="text-gray-600 mb-6">
            The wedding microsite you&apos;re looking for doesn&apos;t exist or may have been
            removed.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>

          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact the wedding hosts directly.
          </p>
        </div>
      </div>
    </main>
  );
}
