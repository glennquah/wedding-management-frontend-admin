'use client';

import { useEffect, useState } from 'react';

import { useVendorSession } from '../../../contexts/VendorSessionContext';
import { VendorBookingsCards } from './VendorBookingsCards';
import { VendorPieChart } from './VendorPieChart';
import { VendorRevenueLineChart } from './VendorRevenueLineChart';
import { VendorTopProductsChart } from './VendorTopProductsChart';
import {
  AnalyticsService,
  RevenueOverTimeResponseDto,
  VendorBookingsResponseDto,
  VendorRevenueResponseDto,
  VendorTopProductsResponseDto,
} from '@shared/api';
import { PageHeader } from '@shared/components';
import { useSession } from 'next-auth/react';

const VendorDashboardModule = () => {
  const { data: session } = useSession();
  const { vendorId, isLoading: isVendorLoading } = useVendorSession();

  // State for analytics data
  const [revenue, setRevenue] = useState<VendorRevenueResponseDto | undefined>();
  const [bookings, setBookings] = useState<VendorBookingsResponseDto | undefined>();
  const [revenueOverTime, setRevenueOverTime] = useState<RevenueOverTimeResponseDto | undefined>();
  const [topProducts, setTopProducts] = useState<VendorTopProductsResponseDto | undefined>();
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isLoadingRevenueOverTime, setIsLoadingRevenueOverTime] = useState(false);
  const [isLoadingTopProducts, setIsLoadingTopProducts] = useState(false);
  const [revenuePeriod, setRevenuePeriod] = useState<'MONTHLY' | 'YEARLY' | 'ALL'>('YEARLY');

  // Fetch revenue and bookings data
  useEffect(() => {
    if (!vendorId) return;

    const fetchRevenueAndBookings = async () => {
      setIsLoadingRevenue(true);
      setIsLoadingBookings(true);
      try {
        const [revenueData, bookingsData] = await Promise.all([
          AnalyticsService.analyticsControllerGetVendorRevenue(vendorId),
          AnalyticsService.analyticsControllerGetVendorBookings(vendorId),
        ]);

        setRevenue(revenueData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching revenue and bookings:', error);
      } finally {
        setIsLoadingRevenue(false);
        setIsLoadingBookings(false);
      }
    };

    fetchRevenueAndBookings();
  }, [vendorId]);

  // Fetch revenue over time
  useEffect(() => {
    if (!vendorId) return;

    const fetchRevenueOverTime = async () => {
      setIsLoadingRevenueOverTime(true);
      try {
        const data = await AnalyticsService.analyticsControllerGetVendorRevenueOverTime(
          vendorId,
          revenuePeriod,
        );
        setRevenueOverTime(data);
      } catch (error) {
        console.error('Error fetching revenue over time:', error);
      } finally {
        setIsLoadingRevenueOverTime(false);
      }
    };

    fetchRevenueOverTime();
  }, [vendorId, revenuePeriod]);

  // Fetch top products
  useEffect(() => {
    if (!vendorId) return;

    const fetchTopProducts = async () => {
      setIsLoadingTopProducts(true);
      try {
        const data = await AnalyticsService.analyticsControllerGetVendorTopProducts(vendorId, 5);
        setTopProducts(data);
      } catch (error) {
        console.error('Error fetching top products:', error);
      } finally {
        setIsLoadingTopProducts(false);
      }
    };

    fetchTopProducts();
  }, [vendorId]);

  if (isVendorLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground py-6">
        <div className="container mx-auto px-4 pt-4 md:pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!vendorId) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground py-6">
        <div className="container mx-auto px-4 pt-4 md:pt-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Vendor Profile Not Found</h2>
            <p className="text-muted-foreground">
              Unable to load vendor information. Please try again later.
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
          title={`Welcome to your dashboard, ${session?.user?.name || 'Vendor'}!`}
          description="Manage your listings, orders, and business analytics"
        />

        {/* First Row - Bookings and Revenue Cards */}
        <div className="mb-6">
          <VendorBookingsCards
            bookingsData={bookings}
            revenueData={revenue}
            isLoadingBookings={isLoadingBookings}
            isLoadingRevenue={isLoadingRevenue}
          />
        </div>

        {/* Second Row - Charts */}
        <div className="grid gap-6 mb-6">
          <VendorRevenueLineChart
            revenueOverTime={revenueOverTime}
            isLoading={isLoadingRevenueOverTime}
            period={revenuePeriod}
            onPeriodChange={setRevenuePeriod}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <VendorPieChart topProducts={topProducts} isLoading={isLoadingTopProducts} />
          <VendorTopProductsChart topProducts={topProducts} isLoading={isLoadingTopProducts} />
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardModule;
