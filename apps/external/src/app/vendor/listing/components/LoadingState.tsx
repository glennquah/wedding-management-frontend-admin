import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading your listings...",
  className = "flex-1 min-h-screen bg-gradient-to-b from-white to-brand-100"
}: LoadingStateProps) {
  return (
    <div className={className}>
      <div className="h-full px-6 py-8">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          <div className="text-lg text-gray-700" role="status" aria-live="polite">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}