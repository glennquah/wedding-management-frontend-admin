'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { VendorsService } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { AlertCircle, Sparkles } from 'lucide-react';
import { ImageUploadWidget } from '@shared/components';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Activity, CreditCard, DollarSign, Users } from 'lucide-react';
import { CldImage } from 'next-cloudinary';

export default function VendorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasVendorDetails, setHasVendorDetails] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    const checkVendorDetails = async () => {
      try {
        if (!session?.user?.id) return;

        // Fetch vendor profile to check if they have service details
        const vendor = await VendorsService.vendorControllerGetVendor(session.user.id);

        // Check if vendor has completed their profile with service details
        const hasDetails = !!(vendor.serviceOffered && vendor.styleOffered && vendor.weddingTypes?.length);
        setHasVendorDetails(hasDetails);
      } catch (error) {
        console.error('Error checking vendor details:', error);
        setHasVendorDetails(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkVendorDetails();
  }, [status, session]);

  if (status === 'loading' || isLoading) {
    return <p className="text-center mt-16">Loading...</p>;
  }

  if (!session) {
    return <p className="text-center mt-16">Loading...</p>;
  }

  // If no vendor details, show only the setup banner
  if (hasVendorDetails === false) {
    return (
      <main className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="max-w-2xl w-full bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-8 shadow-lg">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                Complete Your Vendor Profile
              </h2>
              <p className="text-gray-700 mb-2">
                Hello, <span className="font-semibold">{session.user?.name || session.user?.email}</span> 👋
              </p>
              <p className="text-gray-600 mt-4">
                Before you can access your dashboard and start creating listings, we need you to complete your vendor profile. This includes your service offerings, style preferences, and the types of weddings you cater to!
              </p>
            </div>
            <Button
              onClick={() => router.push('/vendor/account')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-xl transition-all px-8 py-6 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Complete Your Profile Now
            </Button>
            <p className="text-sm text-gray-500">
              Update your vendor details in{' '}
              <button
                onClick={() => router.push('/vendor/account')}
                className="text-purple-600 hover:text-purple-700 underline font-medium"
              >
                Account Settings
              </button>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-6 pt-12">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      {/* Example: Upload widget */}
      <ImageUploadWidget
        onUpload={(url) => {
          setUploadedImageUrl(url);
        }}
        maxImageWidth={500}
      />

      {/* Example: Image Uploaded */}
      <div className="mt-4">
        {uploadedImageUrl ? (
          <CldImage
            width={300}
            height={300}
            src={uploadedImageUrl}
            sizes="100vw"
            alt="Uploaded image"
            className="rounded-lg shadow"
          />
        ) : (
          <p>No image uploaded yet.</p>
        )}
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listings</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
