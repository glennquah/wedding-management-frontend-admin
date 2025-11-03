'use client';

import { useEffect, useState } from 'react';

import { useWeddingStore } from '@/app/store/sessionStore';
import { WeddingWrappedModal } from '@/app/components/dashboards/WeddingWrappedModal';
import { AnalyticsService, WeddingWrappedResponseDto } from '@shared/api';
import { PageHeader } from '@shared/components';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Sparkles, Heart, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function WeddingWrappedPage() {
  const selectedWeddingId = useWeddingStore((state) => state.selectedWeddingId);
  const weddings = useWeddingStore((state) => state.weddings);
  const selectedWedding = weddings.find((w) => w.id === selectedWeddingId);

  const [weddingWrappedData, setWeddingWrappedData] = useState<WeddingWrappedResponseDto | null>(null);
  const [isWeddingWrappedModalOpen, setIsWeddingWrappedModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasWrapped, setHasWrapped] = useState(false);

  // Calculate days until wedding
  const daysUntilWedding = selectedWedding
    ? Math.ceil(
        (new Date(selectedWedding.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      )
    : null;

  // Check if Wedding Wrapped already exists
  useEffect(() => {
    if (!selectedWeddingId) return;

    const fetchWeddingWrapped = async () => {
      setIsLoading(true);
      try {
        const data = await AnalyticsService.analyticsControllerGetWeddingWrapped(selectedWeddingId);
        setWeddingWrappedData(data);
        setHasWrapped(true);
      } catch (error) {
        // Wedding Wrapped doesn't exist yet
        setHasWrapped(false);
        setWeddingWrappedData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeddingWrapped();
  }, [selectedWeddingId]);

  const handleOpenWeddingWrapped = () => {
    if (weddingWrappedData) {
      setIsWeddingWrappedModalOpen(true);
    }
  };

  const handleSaveWeddingWrapped = async () => {
    // Wedding Wrapped is already saved, just close the modal
    toast.success('Wedding Wrapped is saved!');
    setIsWeddingWrappedModalOpen(false);
  };

  if (!selectedWeddingId || !selectedWedding) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground py-6">
        <div className="container mx-auto px-4 pt-4 md:pt-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">No Wedding Selected</h2>
            <p className="text-muted-foreground">
              Please select a wedding from the sidebar to view your Wedding Wrapped.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground py-6">
        <div className="container mx-auto px-4 pt-4 md:pt-6">
          <div className="text-center py-12">
            <p className="text-lg">Loading Wedding Wrapped...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground py-6">
      <div className="container mx-auto px-4 pt-4 md:pt-6">
        <PageHeader
          title="Wedding Wrapped"
          description="Relive your special day with a comprehensive look at all your wedding analytics and memories"
        />

        {/* Wedding Wrapped Card */}
        {daysUntilWedding !== null && daysUntilWedding >= 0 ? (
          <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-25 to-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Wedding Wrapped Not Available Yet
              </CardTitle>
              <CardDescription>
                Wedding Wrapped is only available after your wedding date has passed. Your wedding is{' '}
                {daysUntilWedding === 0
                  ? 'today'
                  : `in ${daysUntilWedding} day${daysUntilWedding === 1 ? '' : 's'}`}
                !
              </CardDescription>
            </CardHeader>
          </Card>
        ) : hasWrapped ? (
          <Card className="border-2 border-brand-200 bg-gradient-to-r from-brand-25 to-brand-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-brand-500" />
                Your Wedding Wrapped
              </CardTitle>
              <CardDescription>
                Click below to view your personalized Wedding Wrapped experience with all your wedding
                analytics and memories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleOpenWeddingWrapped}
                className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                View Wedding Wrapped
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-gray-200 bg-gradient-to-r from-gray-25 to-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-gray-500" />
                Wedding Wrapped Not Generated Yet
              </CardTitle>
              <CardDescription>
                Your Wedding Wrapped hasn&apos;t been generated yet. Please go to your dashboard to
                generate it first.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Wedding Wrapped Modal */}
        <WeddingWrappedModal
          open={isWeddingWrappedModalOpen}
          onOpenChange={setIsWeddingWrappedModalOpen}
          data={weddingWrappedData}
          wedding={selectedWedding}
          onSave={handleSaveWeddingWrapped}
          isSaving={false}
        />
      </div>
    </div>
  );
}
