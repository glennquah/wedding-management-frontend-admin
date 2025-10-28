'use client';

import { useEffect, useState } from 'react';

import { useWeddingStore } from '../../store/sessionStore';
import { BudgetLineChart } from './BudgetLineChart';
import { DashboardStatsCards } from './DashboardStatsCards';
import { RecentOrdersList } from './RecentOrdersList';
import { WeddingTasksChecklist } from './WeddingTasksChecklist';
import { WeddingWrappedModal } from './WeddingWrappedModal';
import {
  AnalyticsService,
  GuestCountResponseDto,
  MicrositeService,
  OrderListingDetailResponseDto,
  OrderResponseDto,
  OrdersService,
  RsvpCountResponseDto,
  SeatingArrangementsService,
  SpendingResponseDto,
  WeddingWrappedResponseDto,
} from '@shared/api';
import { PageHeader } from '@shared/components';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { useSession } from 'next-auth/react';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboardModule = () => {
  const { data: session } = useSession();
  const selectedWeddingId = useWeddingStore((state) => state.selectedWeddingId);
  const weddings = useWeddingStore((state) => state.weddings);

  const selectedWedding = weddings.find((w) => w.id === selectedWeddingId);

  // State for analytics data
  const [guestCount, setGuestCount] = useState<GuestCountResponseDto | undefined>();
  const [spending, setSpending] = useState<SpendingResponseDto | undefined>();
  const [rsvpCount, setRsvpCount] = useState<RsvpCountResponseDto | undefined>();
  const [listingDetails, setListingDetails] = useState<OrderListingDetailResponseDto[]>([]);
  const [successfulOrders, setSuccessfulOrders] = useState<OrderResponseDto[]>([]);
  const [micrositeUrl, setMicrositeUrl] = useState<string | null>(null);
  const [hasSeating, setHasSeating] = useState(false);

  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(false);

  // Wedding Wrapped state
  const [weddingWrappedData, setWeddingWrappedData] = useState<WeddingWrappedResponseDto | null>(null);
  const [isWeddingWrappedModalOpen, setIsWeddingWrappedModalOpen] = useState(false);
  const [isGeneratingWrapped, setIsGeneratingWrapped] = useState(false);
  const [isSavingWrapped, setIsSavingWrapped] = useState(false);

  // Calculate days until wedding
  const daysUntilWedding = selectedWedding
    ? Math.ceil(
        (new Date(selectedWedding.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      )
    : null;

  // Compute description for header
  const headerDescription =
    daysUntilWedding !== null
      ? daysUntilWedding > 0
        ? `${daysUntilWedding} day${daysUntilWedding === 1 ? '' : 's'} until your wedding`
        : daysUntilWedding === 0
          ? 'Today is your wedding day! Congratulations!'
          : `Your wedding was ${Math.abs(daysUntilWedding)} day${Math.abs(daysUntilWedding) === 1 ? '' : 's'} ago`
      : 'Your wedding dashboard';

  // Fetch analytics data
  useEffect(() => {
    if (!selectedWeddingId) return;

    const fetchAnalytics = async () => {
      setIsLoadingStats(true);
      try {
        const [guestData, spendingData, rsvpData] = await Promise.all([
          AnalyticsService.analyticsControllerGetGuestCount(selectedWeddingId),
          AnalyticsService.analyticsControllerGetSpending(selectedWeddingId),
          AnalyticsService.analyticsControllerGetRsvpCount(selectedWeddingId),
        ]);

        setGuestCount(guestData);
        setSpending(spendingData);
        setRsvpCount(rsvpData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchAnalytics();
  }, [selectedWeddingId]);

  // Fetch orders
  useEffect(() => {
    if (!selectedWeddingId) return;

    const fetchOrders = async () => {
      setIsLoadingOrders(true);
      try {
        const [listingDetailsData, successfulOrdersData] = await Promise.all([
          OrdersService.orderControllerGetOrderListingDetailsByWedding(selectedWeddingId),
          OrdersService.orderControllerFindSuccessfulOrdersByWedding(selectedWeddingId),
        ]);
        setListingDetails(listingDetailsData);
        setSuccessfulOrders(successfulOrdersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [selectedWeddingId]);

  // Fetch checklist data (microsite, seating)
  useEffect(() => {
    if (!selectedWeddingId) return;

    const fetchChecklistData = async () => {
      setIsLoadingChecklist(true);
      try {
        // Check microsite
        try {
          const microsite =
            await MicrositeService.micrositeControllerGetMicrositeByWeddingId(selectedWeddingId);
          if (microsite && microsite.slug) {
            setMicrositeUrl(`/microsite/${microsite.slug}`);
          }
        } catch {
          // Microsite doesn't exist
          setMicrositeUrl(null);
        }

        // Check seating arrangement
        try {
          const seating =
            await SeatingArrangementsService.seatingArrangementControllerFindOne(selectedWeddingId);
          setHasSeating(!!seating && seating.tables && seating.tables.length > 0);
        } catch {
          // Seating doesn't exist
          setHasSeating(false);
        }
      } catch (error) {
        console.error('Error fetching checklist data:', error);
      } finally {
        setIsLoadingChecklist(false);
      }
    };

    fetchChecklistData();
  }, [selectedWeddingId]);

  // Wedding Wrapped handlers
  const handleGenerateWeddingWrapped = async () => {
    if (!selectedWeddingId) return;

    setIsGeneratingWrapped(true);
    try {
      const data = await AnalyticsService.analyticsControllerGenerateWeddingWrapped(selectedWeddingId);
      setWeddingWrappedData(data);
      setIsWeddingWrappedModalOpen(true);
      toast.success('Wedding Wrapped Generated! Your wedding analytics have been successfully generated.');
    } catch (error) {
      console.error('Error generating Wedding Wrapped:', error);
      toast.error('Failed to generate Wedding Wrapped. Please try again.');
    } finally {
      setIsGeneratingWrapped(false);
    }
  };

  const handleSaveWeddingWrapped = async () => {
    if (!selectedWeddingId) return;

    setIsSavingWrapped(true);
    try {
      // The data is already saved when generated, so we just need to confirm
      await AnalyticsService.analyticsControllerGetWeddingWrapped(selectedWeddingId);
      toast.success('Wedding Wrapped Saved! Your Wedding Wrapped has been saved successfully.');
      setIsWeddingWrappedModalOpen(false);
    } catch (error) {
      console.error('Error saving Wedding Wrapped:', error);
      toast.error('Failed to save Wedding Wrapped. Please try again.');
    } finally {
      setIsSavingWrapped(false);
    }
  };

  if (!selectedWeddingId || !selectedWedding) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground py-6">
        <div className="container mx-auto px-4 pt-4 md:pt-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">No Wedding Selected</h2>
            <p className="text-muted-foreground">
              Please select a wedding from the sidebar to view your dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground py-6">
      <div className="container mx-auto px-4 pt-4 md:pt-6">
        {/* Page Header */}
        <PageHeader
          title={`Welcome back, ${session?.user?.name || 'there'}!`}
          description={headerDescription}
        />

        {/* Wedding Wrapped Card - Only show when wedding has passed */}
        {daysUntilWedding !== null && daysUntilWedding < 0 && (
          <div className="mb-6">
            <Card className="border-2 border-brand-200 bg-gradient-to-r from-brand-25 to-brand-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-500" />
                  Wedding Wrapped
                </CardTitle>
                <CardDescription>
                  Relive your special day with a comprehensive look at all your wedding analytics and memories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleGenerateWeddingWrapped}
                  disabled={isGeneratingWrapped}
                  className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700"
                >
                  {isGeneratingWrapped ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Wedding Wrapped
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* First Row - Stats Cards */}
        <div className="mb-4">
          <DashboardStatsCards
            guestCount={guestCount}
            spending={spending}
            rsvpCount={rsvpCount}
            isLoading={isLoadingStats}
          />
        </div>

        {/* Second Row - Budget Chart and Recent Orders */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <BudgetLineChart
            orders={successfulOrders}
            allocatedBudget={spending?.allocatedBudget || 0}
            currency={spending?.currency || '$'}
            isLoading={isLoadingOrders}
          />
          <RecentOrdersList listingDetails={listingDetails} isLoading={isLoadingOrders} />
        </div>

        {/* Third Row - Wedding Tasks Checklist */}
        <div className="mb-6">
          <WeddingTasksChecklist
            micrositeUrl={micrositeUrl}
            guestCount={guestCount?.totalGuests || 0}
            rsvpCount={rsvpCount?.confirmed || 0}
            hasSeatingArrangement={hasSeating}
            weddingLocation={selectedWedding.location}
            isLoading={isLoadingChecklist}
          />
        </div>

        {/* Wedding Wrapped Modal */}
        <WeddingWrappedModal
          open={isWeddingWrappedModalOpen}
          onOpenChange={setIsWeddingWrappedModalOpen}
          data={weddingWrappedData}
          wedding={selectedWedding}
          onSave={handleSaveWeddingWrapped}
          isSaving={isSavingWrapped}
        />
      </div>
    </div>
  );
};

export default AdminDashboardModule;
