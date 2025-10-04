import { Alert, AlertDescription } from '@shared/components/ui/alert';
import { Button } from '@shared/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { ErrorStateProps } from '../../types';

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert className="max-w-2xl mx-auto" variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="space-y-4">
          <div>{error}</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
          {error.includes('Authentication') && (
            <div className="text-sm text-muted-foreground mt-2">
              <p>To access the admin ecommerce page, you need to:</p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Log in with an admin account</li>
                <li>Ensure you have selected a wedding from the dropdown</li>
                <li>Check that the backend API server is running on port 8080</li>
              </ol>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}