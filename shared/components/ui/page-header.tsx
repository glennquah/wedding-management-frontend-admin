import { ReactNode } from 'react';

import { Button } from './button';

interface PageHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonIcon?: ReactNode;
  isButtonDisabled?: boolean;
  additionalActions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  buttonText,
  onButtonClick,
  buttonIcon,
  isButtonDisabled = false,
  additionalActions,
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h3 className="text-brand-600 mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {(additionalActions || (buttonText && onButtonClick)) && (
        <div className="flex gap-3">
          {additionalActions}
          {buttonText && onButtonClick && (
            <Button
              onClick={onButtonClick}
              className="flex items-center gap-2"
              disabled={isButtonDisabled}
            >
              {buttonIcon}
              {buttonText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
