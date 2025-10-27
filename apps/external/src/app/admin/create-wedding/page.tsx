'use client';

import { useState } from 'react';

import {
  AdminsService,
  BudgetBucket,
  GuestCountBucket,
  WeddingService,
  WeddingStyle,
  WeddingType,
  WeddingsService,
} from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Input } from '@shared/components/ui/form/input';
import { SingleDatePicker } from '@shared/components';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface OnboardingData {
  name: string;
  date: string;
  location: string;
  weddingType: WeddingType | null;
  budgetBucket: BudgetBucket | null;
  allocatedBudget: number;
  guestCountBucket: GuestCountBucket | null;
  preferredStyle: WeddingStyle | null;
  preferredServices: WeddingService[];
}

const STEPS = [
  { key: 'basic', title: "Let's start with the basics", subtitle: 'Tell us about your wedding' },
  {
    key: 'weddingType',
    title: 'What type of wedding are you planning?',
    subtitle: 'Select your wedding type',
  },
  {
    key: 'budgetBucket',
    title: "What's your budget range?",
    subtitle: 'Choose your budget bracket',
  },
  {
    key: 'guestCountBucket',
    title: 'How many guests will you have?',
    subtitle: 'Select your guest count',
  },
  {
    key: 'preferredStyle',
    title: "What's your preferred style?",
    subtitle: 'Choose your wedding style',
  },
  {
    key: 'preferredServices',
    title: 'Which services do you need?',
    subtitle: 'Select all services you require',
  },
];

const WEDDING_TYPES: { value: WeddingType; label: string; description: string }[] = [
  {
    value: WeddingType.CHINESE,
    label: 'Chinese',
    description: 'Traditional Chinese wedding ceremony',
  },
  { value: WeddingType.MALAY, label: 'Malay', description: 'Traditional Malay wedding ceremony' },
  {
    value: WeddingType.INDIAN,
    label: 'Indian',
    description: 'Traditional Indian wedding ceremony',
  },
  { value: WeddingType.WESTERN, label: 'Western', description: 'Western-style wedding ceremony' },
  { value: WeddingType.OTHERS, label: 'Others', description: 'Other cultural or mixed ceremonies' },
];

const BUDGET_BUCKETS: { value: BudgetBucket; label: string; description: string }[] = [
  { value: BudgetBucket.LOW, label: 'Up to $10,000', description: 'Budget-friendly options' },
  { value: BudgetBucket.MEDIUM, label: '$10,000 - $30,000', description: 'Mid-range celebration' },
  { value: BudgetBucket.HIGH, label: '$30,000 - $50,000', description: 'Premium experience' },
  { value: BudgetBucket.LUXURY, label: 'Above $50,000', description: 'Luxury wedding experience' },
];

const GUEST_COUNT_BUCKETS: { value: GuestCountBucket; label: string; description: string }[] = [
  { value: GuestCountBucket.SMALL, label: 'Up to 50 guests', description: 'Intimate celebration' },
  {
    value: GuestCountBucket.MEDIUM,
    label: '50 - 150 guests',
    description: 'Medium-sized gathering',
  },
  { value: GuestCountBucket.LARGE, label: 'Above 150 guests', description: 'Large celebration' },
];

const WEDDING_STYLES: { value: WeddingStyle; label: string; description: string }[] = [
  { value: WeddingStyle.LUXURY, label: 'Luxury', description: 'Opulent and extravagant' },
  { value: WeddingStyle.MODERN, label: 'Modern', description: 'Contemporary and sleek' },
  { value: WeddingStyle.TRADITIONAL, label: 'Traditional', description: 'Classic and timeless' },
  { value: WeddingStyle.RUSTIC, label: 'Rustic', description: 'Natural and countryside' },
];

const WEDDING_SERVICES: { value: WeddingService; label: string; description: string }[] = [
  {
    value: WeddingService.VENUE,
    label: 'Venue',
    description: 'Wedding ceremony and reception location',
  },
  { value: WeddingService.CATERING, label: 'Catering', description: 'Food and beverage services' },
  {
    value: WeddingService.PHOTOGRAPHY,
    label: 'Photography',
    description: 'Wedding photography and videography',
  },
  {
    value: WeddingService.DECORATION,
    label: 'Decoration',
    description: 'Floral arrangements and decorations',
  },
  { value: WeddingService.MUSIC, label: 'Music', description: 'DJ, band, or music services' },
  { value: WeddingService.ATTIRE, label: 'Attire', description: 'Wedding dress and formal wear' },
  { value: WeddingService.MAKEUP, label: 'Makeup', description: 'Bridal makeup and styling' },
  {
    value: WeddingService.TRANSPORTATION,
    label: 'Transportation',
    description: 'Wedding day transportation',
  },
];

export default function CreateWeddingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: '',
    date: '',
    location: '',
    weddingType: null,
    budgetBucket: null,
    allocatedBudget: 0,
    guestCountBucket: null,
    preferredStyle: null,
    preferredServices: [],
  });

  const handleSingleSelect = (
    key: keyof OnboardingData,
    value: WeddingType | BudgetBucket | GuestCountBucket | WeddingStyle | null,
  ) => {
    setOnboardingData((prev) => ({ ...prev, [key]: value }));
  };

  const handleMultiSelect = (service: WeddingService) => {
    setOnboardingData((prev) => ({
      ...prev,
      preferredServices: prev.preferredServices.includes(service)
        ? prev.preferredServices.filter((s) => s !== service)
        : [...prev.preferredServices, service],
    }));
  };

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    if (field === 'allocatedBudget') {
      setOnboardingData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
    } else {
      setOnboardingData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - submit data
      if (
        !onboardingData.name ||
        !onboardingData.weddingType ||
        !onboardingData.budgetBucket ||
        !onboardingData.allocatedBudget ||
        onboardingData.allocatedBudget <= 0 ||
        !onboardingData.guestCountBucket ||
        !onboardingData.preferredStyle ||
        onboardingData.preferredServices.length === 0
      ) {
        toast.error('Please complete all required fields');
        return;
      }

      try {
        setLoading(true);
        const wedding = await WeddingsService.weddingControllerCreate({
          name: onboardingData.name,
          date: onboardingData.date || undefined,
          location: onboardingData.location || undefined,
          weddingType: onboardingData.weddingType,
          budgetBucket: onboardingData.budgetBucket,
          allocatedBudget: onboardingData.allocatedBudget,
          guestCountBucket: onboardingData.guestCountBucket,
          preferredStyle: onboardingData.preferredStyle,
          preferredServices: onboardingData.preferredServices,
        });

        // Set this wedding as the main wedding for the admin
        await AdminsService.adminControllerSetMainWedding(wedding.id);

        toast.success('Wedding created successfully!');

        // Force a full page reload to refresh the sidebar and all wedding-related data
        window.location.href = '/admin';
      } catch (error) {
        console.error('Error creating wedding:', error);
        toast.error('Failed to create wedding. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const isCurrentStepValid = () => {
    const step = STEPS[currentStep];

    if (step.key === 'basic') {
      return onboardingData.name.trim().length > 0;
    }

    if (step.key === 'budgetBucket') {
      return onboardingData.budgetBucket !== null && onboardingData.allocatedBudget > 0;
    }

    if (step.key === 'preferredServices') {
      return onboardingData.preferredServices.length > 0;
    }

    return onboardingData[step.key as keyof OnboardingData] !== null;
  };

  const renderStep = () => {
    const step = STEPS[currentStep];

    switch (step.key) {
      case 'basic':
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Wedding Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={onboardingData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Sarah & John's Wedding"
                className="w-full"
              />
              <p className="text-xs text-gray-500">Give your wedding a memorable name</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Wedding Date (Optional)</label>
              <SingleDatePicker
                value={onboardingData.date}
                onChange={(date) => handleInputChange('date', date || '')}
                placeholder="Select wedding date"
                minDate={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-500">You can always update this later</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location (Optional)</label>
              <Input
                type="text"
                value={onboardingData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Singapore Botanic Gardens"
                className="w-full"
              />
              <p className="text-xs text-gray-500">Where will your special day take place?</p>
            </div>
          </div>
        );

      case 'weddingType':
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {WEDDING_TYPES.map((type) => (
              <Card
                key={type.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  onboardingData.weddingType === type.value
                    ? 'ring-2 ring-brand-500 bg-destructive'
                    : 'hover:bg-primary-hover'
                }`}
                onClick={() => {
                  if (onboardingData.weddingType === type.value) {
                    handleSingleSelect('weddingType', null);
                  } else {
                    handleSingleSelect('weddingType', type.value);
                  }
                }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{type.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="!text-base text-gray-900 font-medium">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'budgetBucket':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {BUDGET_BUCKETS.map((budget) => (
                <Card
                  key={budget.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    onboardingData.budgetBucket === budget.value
                      ? 'ring-2 ring-brand-500 bg-destructive'
                      : 'hover:bg-primary-hover'
                  }`}
                  onClick={() => {
                    if (onboardingData.budgetBucket === budget.value) {
                      handleSingleSelect('budgetBucket', null);
                    } else {
                      handleSingleSelect('budgetBucket', budget.value);
                    }
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{budget.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="!text-base text-gray-900 font-medium">{budget.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-2 max-w-2xl mx-auto">
              <label className="text-sm font-medium text-gray-700">
                Allocated Budget <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={onboardingData.allocatedBudget || ''}
                onChange={(e) => handleInputChange('allocatedBudget', e.target.value)}
                placeholder="Enter your exact budget amount"
                className="w-full"
                min="0"
                step="100"
              />
              <p className="text-xs text-gray-500">
                Enter the total budget you have allocated for your wedding
              </p>
            </div>
          </div>
        );

      case 'guestCountBucket':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GUEST_COUNT_BUCKETS.map((count) => (
              <Card
                key={count.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  onboardingData.guestCountBucket === count.value
                    ? 'ring-2 ring-brand-500 bg-destructive'
                    : 'hover:bg-primary-hover'
                }`}
                onClick={() => {
                  if (onboardingData.guestCountBucket === count.value) {
                    handleSingleSelect('guestCountBucket', null);
                  } else {
                    handleSingleSelect('guestCountBucket', count.value);
                  }
                }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{count.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="!text-base text-gray-900 font-medium">{count.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'preferredStyle':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {WEDDING_STYLES.map((style) => (
              <Card
                key={style.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  onboardingData.preferredStyle === style.value
                    ? 'ring-2 ring-brand-500 bg-destructive'
                    : 'hover:bg-primary-hover'
                }`}
                onClick={() => {
                  if (onboardingData.preferredStyle === style.value) {
                    handleSingleSelect('preferredStyle', null);
                  } else {
                    handleSingleSelect('preferredStyle', style.value);
                  }
                }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{style.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="!text-base text-gray-900 font-medium">{style.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'preferredServices':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {WEDDING_SERVICES.map((service) => (
              <Card
                key={service.value}
                className={`relative cursor-pointer transition-all hover:shadow-md ${
                  onboardingData.preferredServices.includes(service.value)
                    ? 'ring-2 ring-brand-500 bg-destructive'
                    : 'hover:bg-primary-hover'
                }`}
                onClick={() => handleMultiSelect(service.value)}
              >
                {onboardingData.preferredServices.includes(service.value) && (
                  <span className="absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-brand-100 text-brand-800 shadow">
                    ✓ Selected
                  </span>
                )}

                <CardHeader>
                  <CardTitle className="text-lg">{service.label}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="!text-base text-gray-900 font-medium">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepData = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Create Your Wedding</h1>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{currentStepData.title}</h2>
          <p className="text-gray-600 mb-6">{currentStepData.subtitle}</p>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="darkOutline" onClick={handleBack}>
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isCurrentStepValid() || loading}
            variant={currentStep === STEPS.length - 1 ? undefined : 'default'}
            className={currentStep === STEPS.length - 1 ? 'bg-brand-500 hover:bg-brand-600' : ''}
          >
            {loading
              ? 'Creating Wedding...'
              : currentStep === STEPS.length - 1
                ? 'Create Wedding'
                : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
