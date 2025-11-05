import { Alert, AlertDescription } from '@shared/components/ui/alert';
import { Skeleton } from '@shared/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ListingErrorStateProps {
  error: string;
  onBack: () => void;
}

interface ListingNotFoundStateProps {
  onBack: () => void;
}

interface BackButtonProps {
  onBack: () => void;
}

function BackButton({ onBack }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onBack}
      className="mb-6 flex items-center gap-2"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
}

export function ListingLoadingState() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-10 w-32 mb-4" />
        <Skeleton className="h-12 w-96 mb-2" />
        <Skeleton className="h-6 w-48" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}

export function ListingErrorState({ error, onBack }: ListingErrorStateProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton onBack={onBack} />
      <Alert variant="destructive" className="max-w-2xl">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );
}

export function ListingNotFoundState({ onBack }: ListingNotFoundStateProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton onBack={onBack} />
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Listing not found.</AlertDescription>
      </Alert>
    </div>
  );
}
