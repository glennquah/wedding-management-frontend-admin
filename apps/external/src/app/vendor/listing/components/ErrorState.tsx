import { Button } from '@shared/components';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  title?: string;
  className?: string;
}

export function ErrorState({
  error,
  onRetry,
  title = 'Something went wrong',
  className = 'flex-1 min-h-screen bg-gradient-to-b from-white to-brand-100'
}: ErrorStateProps) {
  return (
    <div className={className}>
      <div className="h-full px-6 py-8">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <p className="text-red-600 text-center max-w-md" role="alert">
              {error}
            </p>
          </div>
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}