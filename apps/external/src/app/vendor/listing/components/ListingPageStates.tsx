'use client';

import { Button } from '@shared/components';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{message}</h2>
        <p className="text-gray-600">Please wait while we load the information</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export function ErrorState({
  title = "Error",
  message,
  onRetry,
  onBack
}: ErrorStateProps) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex gap-2 justify-center">
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              Try Again
            </Button>
          )}
          {onBack && (
            <Button onClick={onBack}>
              Back to Listings
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}