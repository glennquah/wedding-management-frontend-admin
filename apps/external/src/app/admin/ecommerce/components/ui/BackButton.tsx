import { Button } from '@shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BackButtonProps } from '../../types';

export function BackButton({ onBack }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onBack}
      className="mb-6"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Marketplace
    </Button>
  );
}