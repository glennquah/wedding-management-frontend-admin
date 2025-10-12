'use client';

import { useEffect, useState } from 'react';

import { useVendorSession } from '../../../contexts/VendorSessionContext';
import { VendorBookingsCards } from './VendorBookingsCards';
import { VendorRevenueCard } from './VendorRevenueCard';
import { VendorRevenueLineChart } from './VendorRevenueLineChart';
import { VendorRevenuePieChart } from './VendorRevenuePieChart';
import { VendorTopProductsChart } from './VendorTopProductsChart';
import {
  AnalyticsService,
  RevenueByCategoryResponseDto,
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
  const [revenueByCategory, setRevenueByCategory] = useState<
    RevenueByCategoryResponseDto | undefined
  >();

  const [isLoadingRevenue, setIsLoadingRevenue] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isLoadingRevenueOverTime, setIsLoadingRevenueOverTime] = useState(false);
  const [isLoadingTopProducts, setIsLoadingTopProducts] = useState(false);
  const [isLoadingRevenueByCategory, setIsLoadingRevenueByCategory] = useState(false);

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
        const data = await AnalyticsService.analyticsControllerGetVendorRevenueOverTime(vendorId);
        setRevenueOverTime(data);
      } catch (error) {
        console.error('Error fetching revenue over time:', error);
      } finally {
        setIsLoadingRevenueOverTime(false);
      }
    };

    fetchRevenueOverTime();
  }, [vendorId]);

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

  // Fetch revenue by category
  useEffect(() => {
    if (!vendorId) return;

    const fetchRevenueByCategory = async () => {
      setIsLoadingRevenueByCategory(true);
      try {
        const data = await AnalyticsService.analyticsControllerGetVendorRevenueByCategory(vendorId);
        setRevenueByCategory(data);
      } catch (error) {
        console.error('Error fetching revenue by category:', error);
      } finally {
        setIsLoadingRevenueByCategory(false);
      }
    };

    fetchRevenueByCategory();
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

        {/* First Row - Bookings Cards and Revenue Card */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <VendorBookingsCards bookingsData={bookings} isLoading={isLoadingBookings} />
          <VendorRevenueCard revenueData={revenue} isLoading={isLoadingRevenue} />
        </div>

        {/* Second Row - Revenue Over Time Chart */}
        <div className="mb-6">
          <VendorRevenueLineChart
            revenueOverTime={revenueOverTime}
            isLoading={isLoadingRevenueOverTime}
          />
        </div>

        {/* Fourth Row - Top Products and Revenue by Category */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <VendorTopProductsChart topProducts={topProducts} isLoading={isLoadingTopProducts} />
          <VendorRevenuePieChart
            revenueByCategory={revenueByCategory}
            isLoading={isLoadingRevenueByCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardModule;
