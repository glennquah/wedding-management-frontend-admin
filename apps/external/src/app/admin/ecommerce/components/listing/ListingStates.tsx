import { Alert, AlertDescription } from '@shared/components/ui/alert';
import { Skeleton } from '@shared/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { BackButton } from '../ui';

interface ListingLoadingStateProps {}

interface ListingErrorStateProps {
  error: string;
  onBack: () => void;
}

interface ListingNotFoundStateProps {
  onBack: () => void;
}

export function ListingLoadingState({}: ListingLoadingStateProps) {
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