"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHandleSession } from "../../hooks/useHandleSession";
import { useSessionStore } from "../../store/sessionStore";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../shared/components/ui/card";
import { Button } from "../../../../../../shared/components/ui/button";
import { WeddingType as APIWeddingType, BudgetBucket as APIBudgetBucket, GuestCountBucket as APIGuestCountBucket, WeddingStyle as APIWeddingStyle, WeddingService as APIWeddingService } from "../../../../../../shared/api";

type WeddingType = "chinese" | "malay" | "indian" | "western" | "others";
type BudgetBucket = "low" | "medium" | "high" | "luxury";
type GuestCountBucket = "small" | "medium" | "large";
type WeddingStyle = "luxury" | "modern" | "traditional" | "rustic";
type WeddingService = "venue" | "catering" | "photography" | "decoration" | "music" | "attire" | "makeup" | "transportation";

interface OnboardingData {
  weddingType: WeddingType | null;
  budgetBucket: BudgetBucket | null;
  guestCountBucket: GuestCountBucket | null;
  preferredStyle: WeddingStyle | null;
  preferredServices: WeddingService[];
}

const STEPS = [
  { key: 'weddingType', title: 'What type of wedding are you planning?', subtitle: 'Select your wedding type' },
  { key: 'budgetBucket', title: 'What\'s your budget range?', subtitle: 'Choose your budget bracket' },
  { key: 'guestCountBucket', title: 'How many guests will you have?', subtitle: 'Select your guest count' },
  { key: 'preferredStyle', title: 'What\'s your preferred style?', subtitle: 'Choose your wedding style' },
  { key: 'preferredServices', title: 'Which services do you need?', subtitle: 'Select all services you require' }
];

const WEDDING_TYPES: { value: WeddingType; label: string; description: string }[] = [
  { value: 'chinese', label: 'Chinese', description: 'Traditional Chinese wedding ceremony' },
  { value: 'malay', label: 'Malay', description: 'Traditional Malay wedding ceremony' },
  { value: 'indian', label: 'Indian', description: 'Traditional Indian wedding ceremony' },
  { value: 'western', label: 'Western', description: 'Western-style wedding ceremony' },
  { value: 'others', label: 'Others', description: 'Other cultural or mixed ceremonies' }
];

const BUDGET_BUCKETS: { value: BudgetBucket; label: string; description: string }[] = [
  { value: 'low', label: 'Up to $10,000', description: 'Budget-friendly options' },
  { value: 'medium', label: '$10,000 - $30,000', description: 'Mid-range celebration' },
  { value: 'high', label: '$30,000 - $50,000', description: 'Premium experience' },
  { value: 'luxury', label: 'Above $50,000', description: 'Luxury wedding experience' }
];

const GUEST_COUNT_BUCKETS: { value: GuestCountBucket; label: string; description: string }[] = [
  { value: 'small', label: 'Up to 50 guests', description: 'Intimate celebration' },
  { value: 'medium', label: '50 - 150 guests', description: 'Medium-sized gathering' },
  { value: 'large', label: 'Above 150 guests', description: 'Large celebration' }
];

const WEDDING_STYLES: { value: WeddingStyle; label: string; description: string }[] = [
  { value: 'luxury', label: 'Luxury', description: 'Opulent and extravagant' },
  { value: 'modern', label: 'Modern', description: 'Contemporary and sleek' },
  { value: 'traditional', label: 'Traditional', description: 'Classic and timeless' },
  { value: 'rustic', label: 'Rustic', description: 'Natural and countryside' }
];

const WEDDING_SERVICES: { value: WeddingService; label: string; description: string }[] = [
  { value: 'venue', label: 'Venue', description: 'Wedding ceremony and reception location' },
  { value: 'catering', label: 'Catering', description: 'Food and beverage services' },
  { value: 'photography', label: 'Photography', description: 'Wedding photography and videography' },
  { value: 'decoration', label: 'Decoration', description: 'Floral arrangements and decorations' },
  { value: 'music', label: 'Music', description: 'DJ, band, or music services' },
  { value: 'attire', label: 'Attire', description: 'Wedding dress and formal wear' },
  { value: 'makeup', label: 'Makeup', description: 'Bridal makeup and styling' },
  { value: 'transportation', label: 'Transportation', description: 'Wedding day transportation' }
];

export default function GetStartedCouplePage() {
  const router = useRouter();
  const { name, email, password } = useSessionStore();
  const { handleSignUpAdmin } = useHandleSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    weddingType: null,
    budgetBucket: null,
    guestCountBucket: null,
    preferredStyle: null,
    preferredServices: []
  });

  // Redirect if onboarding data is missing
  if (!name || !email || !password) {
    router.replace("/get-started");
    return null;
  }

  const handleSingleSelect = (key: keyof OnboardingData, value: WeddingType | BudgetBucket | GuestCountBucket | WeddingStyle | null) => {
    setOnboardingData(prev => ({ ...prev, [key]: value }));
  };

  const handleMultiSelect = (service: WeddingService) => {
    setOnboardingData(prev => ({
      ...prev,
      preferredServices: prev.preferredServices.includes(service)
        ? prev.preferredServices.filter(s => s !== service)
        : [...prev.preferredServices, service]
    }));
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - submit data
      if (!onboardingData.weddingType || !onboardingData.budgetBucket || 
          !onboardingData.guestCountBucket || !onboardingData.preferredStyle ||
          onboardingData.preferredServices.length === 0) {
        return;
      }

      // Convert frontend types to API types
      const apiWeddingType = onboardingData.weddingType.toLowerCase() as APIWeddingType;
      const apiBudgetBucket = onboardingData.budgetBucket.toLowerCase() as APIBudgetBucket;
      const apiGuestCountBucket = onboardingData.guestCountBucket.toLowerCase() as APIGuestCountBucket;
      const apiPreferredStyle = onboardingData.preferredStyle.toLowerCase() as APIWeddingStyle;
      const apiPreferredServices = onboardingData.preferredServices.map(s => s.toLowerCase()) as APIWeddingService[];

      await handleSignUpAdmin({
        email: email!,
        password: password!,
        name: name!,
        weddingType: apiWeddingType,
        budgetBucket: apiBudgetBucket,
        guestCountBucket: apiGuestCountBucket,
        preferredStyle: apiPreferredStyle,
        preferredServices: apiPreferredServices,
      }, setLoading);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isCurrentStepValid = () => {
    const step = STEPS[currentStep];
    if (step.key === 'preferredServices') {
      return onboardingData.preferredServices.length > 0;
    }
    return onboardingData[step.key as keyof OnboardingData] !== null;
  };

  const renderStep = () => {
    const step = STEPS[currentStep];
    
    switch (step.key) {
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
                      handleSingleSelect('weddingType', null); // unselect
                    } else {
                      handleSingleSelect('weddingType', type.value); // select
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
                      handleSingleSelect('budgetBucket', null); // unselect
                    } else {
                      handleSingleSelect('budgetBucket', budget.value); // select
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
        );

      case 'guestCountBucket':
        return (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
                      handleSingleSelect('guestCountBucket', null); // unselect
                    } else {
                      handleSingleSelect('guestCountBucket', count.value); // select
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                      handleSingleSelect('preferredStyle', null); // unselect
                    } else {
                      handleSingleSelect('preferredStyle', style.value); // select
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
                {/* Floating badge outside of content flow */}
                {onboardingData.preferredServices.includes(service.value) && (
                  <span className="absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-brand-100 text-brand-800 shadow">
                    ✓ Selected
                  </span>
                )}

                <CardHeader>
                  <CardTitle className="text-lg">{service.label}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="!text-base text-gray-900 font-medium">
                    {service.description}
                  </p>
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
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {name}!
            </h1>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 mb-6">{currentStepData.subtitle}</p>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className={"flex items-center justify-between"}
        >
          <Button
            variant="darkOutline"
            onClick={() => {
              if (currentStep === 0) {
                router.back(); // go to previous page
              } else {
                handleBack(); // normal step back
              }
            }}
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isCurrentStepValid() || loading}
            variant={currentStep === STEPS.length - 1 ? undefined : 'default'}
            className={currentStep === STEPS.length - 1 ? 'bg-brand-500 hover:bg-brand-600' : ''}
          >
            {loading ? 'Creating Account...' : (currentStep === STEPS.length - 1 ? 'Complete Setup' : 'Next')}
          </Button>
        </div>
      </div>
    </div>
  );
}