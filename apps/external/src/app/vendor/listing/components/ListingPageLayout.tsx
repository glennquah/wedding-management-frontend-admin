'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button, PageHeader } from '@shared/components';
import { ReactNode } from 'react';

interface ListingPageLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  onBack?: () => void;
}

export function ListingPageLayout({
  title,
  description,
  children,
  onBack
}: ListingPageLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/vendor/listing');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100">
      <div className="w-full p-4 lg:p-6">
        {/* Breadcrumb and Header */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Listings
            </Button>
          </nav>

          <PageHeader
            title={title}
            description={description}
          />
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}