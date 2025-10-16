'use client';

import { useEffect, useState } from 'react';

import { AdminBookingsOverTimeChart } from './dashboards/AdminBookingsOverTimeChart';
import { AdminRevenueByCategoryChart } from './dashboards/AdminRevenueByCategoryChart';
import { AdminRevenueOverTimeChart } from './dashboards/AdminRevenueOverTimeChart';
import { AdminStatsCards } from './dashboards/AdminStatsCards';
import { AdminTopListingsChart } from './dashboards/AdminTopListingsChart';
import { AdminTopVendorsChart } from './dashboards/AdminTopVendorsChart';
import { AdminUserGrowthChart } from './dashboards/AdminUserGrowthChart';
import { AdminWeddingDatesHeatmap } from './dashboards/AdminWeddingDatesHeatmap';
import {
  AdminBasicStatsResponseDto,
  AdminBookingsOverTimeResponseDto,
  AdminRevenueByCategoryResponseDto,
  AdminRevenueResponseDto,
  AdminTopListingsResponseDto,
  AdminTopVendorsResponseDto,
  AdminUserGrowthResponseDto,
  AdminWeddingDatesHeatmapResponseDto,
  AnalyticsService,
  RevenueOverTimeResponseDto,
} from '@shared/api';
import { PageHeader } from '@shared/components';
import { useSession } from 'next-auth/react';

const SuperAdminDashboardModule = () => {
  const { data: session } = useSession();

  // State for analytics data
  const [basicStats, setBasicStats] = useState<AdminBasicStatsResponseDto | undefined>();
  const [revenue, setRevenue] = useState<AdminRevenueResponseDto | undefined>();
  const [revenueOverTime, setRevenueOverTime] = useState<RevenueOverTimeResponseDto | undefined>();
  const [revenueByCategory, setRevenueByCategory] = useState<
    AdminRevenueByCategoryResponseDto | undefined
  >();
  const [topVendors, setTopVendors] = useState<AdminTopVendorsResponseDto | undefined>();
  const [topListings, setTopListings] = useState<AdminTopListingsResponseDto | undefined>();
  const [bookingsOverTime, setBookingsOverTime] = useState<
    AdminBookingsOverTimeResponseDto | undefined
  >();
  const [weddingDatesHeatmap, setWeddingDatesHeatmap] = useState<
    AdminWeddingDatesHeatmapResponseDto | undefined
  >();
  const [userGrowth, setUserGrowth] = useState<AdminUserGrowthResponseDto | undefined>();

  // Loading states
  const [isLoadingBasicStats, setIsLoadingBasicStats] = useState(false);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(false);
  const [isLoadingRevenueOverTime, setIsLoadingRevenueOverTime] = useState(false);
  const [isLoadingRevenueByCategory, setIsLoadingRevenueByCategory] = useState(false);
  const [isLoadingTopVendors, setIsLoadingTopVendors] = useState(false);
  const [isLoadingTopListings, setIsLoadingTopListings] = useState(false);
  const [isLoadingBookingsOverTime, setIsLoadingBookingsOverTime] = useState(false);
  const [isLoadingWeddingDates, setIsLoadingWeddingDates] = useState(false);
  const [isLoadingUserGrowth, setIsLoadingUserGrowth] = useState(false);

  // Period states
  const [revenuePeriod, setRevenuePeriod] = useState<'MONTHLY' | 'YEARLY' | 'ALL'>('YEARLY');
  const [bookingsPeriod, setBookingsPeriod] = useState<'MONTHLY' | 'YEARLY' | 'ALL'>('YEARLY');
  const [userGrowthPeriod, setUserGrowthPeriod] = useState<'MONTHLY' | 'YEARLY' | 'ALL'>('YEARLY');

  // Fetch basic stats and revenue
  useEffect(() => {
    const fetchBasicData = async () => {
      setIsLoadingBasicStats(true);
      setIsLoadingRevenue(true);
      try {
        const [basicStatsData, revenueData] = await Promise.all([
          AnalyticsService.analyticsControllerGetAdminBasicStats(),
          AnalyticsService.analyticsControllerGetAdminRevenue(),
        ]);

        setBasicStats(basicStatsData);
        setRevenue(revenueData);
      } catch (error) {
        console.error('Error fetching basic stats and revenue:', error);
      } finally {
        setIsLoadingBasicStats(false);
        setIsLoadingRevenue(false);
      }
    };

    fetchBasicData();
  }, []);

  // Fetch revenue over time
  useEffect(() => {
    const fetchRevenueOverTime = async () => {
      setIsLoadingRevenueOverTime(true);
      try {
        const data =
          await AnalyticsService.analyticsControllerGetAdminRevenueOverTime(revenuePeriod);
        setRevenueOverTime(data);
      } catch (error) {
        console.error('Error fetching revenue over time:', error);
      } finally {
        setIsLoadingRevenueOverTime(false);
      }
    };

    fetchRevenueOverTime();
  }, [revenuePeriod]);

  // Fetch revenue by category, top vendors, top listings
  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoadingRevenueByCategory(true);
      setIsLoadingTopVendors(true);
      setIsLoadingTopListings(true);
      try {
        const [categoryData, vendorsData, listingsData] = await Promise.all([
          AnalyticsService.analyticsControllerGetAdminRevenueByCategory(),
          AnalyticsService.analyticsControllerGetAdminTopVendors(10),
          AnalyticsService.analyticsControllerGetAdminTopListings(10),
        ]);

        setRevenueByCategory(categoryData);
        setTopVendors(vendorsData);
        setTopListings(listingsData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setIsLoadingRevenueByCategory(false);
        setIsLoadingTopVendors(false);
        setIsLoadingTopListings(false);
      }
    };

    fetchChartData();
  }, []);

  // Fetch bookings over time
  useEffect(() => {
    const fetchBookingsOverTime = async () => {
      setIsLoadingBookingsOverTime(true);
      try {
        const data =
          await AnalyticsService.analyticsControllerGetAdminBookingsOverTime(bookingsPeriod);
        setBookingsOverTime(data);
      } catch (error) {
        console.error('Error fetching bookings over time:', error);
      } finally {
        setIsLoadingBookingsOverTime(false);
      }
    };

    fetchBookingsOverTime();
  }, [bookingsPeriod]);

  // Fetch wedding dates heatmap
  useEffect(() => {
    const fetchWeddingDates = async () => {
      setIsLoadingWeddingDates(true);
      try {
        const data = await AnalyticsService.analyticsControllerGetAdminWeddingDatesHeatmap();
        setWeddingDatesHeatmap(data);
      } catch (error) {
        console.error('Error fetching wedding dates:', error);
      } finally {
        setIsLoadingWeddingDates(false);
      }
    };

    fetchWeddingDates();
  }, []);

  // Fetch user growth
  useEffect(() => {
    const fetchUserGrowth = async () => {
      setIsLoadingUserGrowth(true);
      try {
        const data = await AnalyticsService.analyticsControllerGetAdminUserGrowth(userGrowthPeriod);
        setUserGrowth(data);
      } catch (error) {
        console.error('Error fetching user growth:', error);
      } finally {
        setIsLoadingUserGrowth(false);
      }
    };

    fetchUserGrowth();
  }, [userGrowthPeriod]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground py-6">
      <div className="container mx-auto px-4 pt-4 md:pt-6">
        {/* Page Header */}
        <PageHeader
          title={`Welcome, ${session?.user?.name || 'Super Admin'}!`}
          description="Platform analytics and performance metrics"
        />

        {/* Stats Cards Row */}
        <div className="mb-6">
          <AdminStatsCards
            basicStats={basicStats}
            revenueData={revenue}
            isLoadingBasicStats={isLoadingBasicStats}
            isLoadingRevenue={isLoadingRevenue}
          />
        </div>

        {/* Revenue Over Time Chart - Full Width */}
        <div className="grid gap-6 mb-6">
          <AdminRevenueOverTimeChart
            revenueOverTime={revenueOverTime}
            isLoading={isLoadingRevenueOverTime}
            period={revenuePeriod}
            onPeriodChange={setRevenuePeriod}
          />
        </div>

        {/* Revenue by Category and Top Vendors - Side by Side */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <AdminRevenueByCategoryChart
            revenueByCategory={revenueByCategory}
            isLoading={isLoadingRevenueByCategory}
          />
          <AdminTopVendorsChart topVendors={topVendors} isLoading={isLoadingTopVendors} />
        </div>

        {/* Top Listings and Bookings Over Time - Side by Side */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <AdminTopListingsChart topListings={topListings} isLoading={isLoadingTopListings} />
          <AdminWeddingDatesHeatmap
            weddingDatesData={weddingDatesHeatmap}
            isLoading={isLoadingWeddingDates}
          />
        </div>

        {/* Bookings Over Time - Full Width */}
        <div className="grid gap-6 mb-6">
          <AdminBookingsOverTimeChart
            bookingsOverTime={bookingsOverTime}
            isLoading={isLoadingBookingsOverTime}
            period={bookingsPeriod}
            onPeriodChange={setBookingsPeriod}
          />
        </div>

        {/* User Growth - Full Width */}
        <div className="grid gap-6 mb-6">
          <AdminUserGrowthChart
            userGrowthData={userGrowth}
            isLoading={isLoadingUserGrowth}
            period={userGrowthPeriod}
            onPeriodChange={setUserGrowthPeriod}
          />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboardModule;
