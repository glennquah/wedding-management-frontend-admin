'use client';

import { useEffect, useState, useRef } from 'react';

import AdminSidebar from '../components/layout/AdminSidebar';
import { useWeddingManager } from '@/app/hooks/useWeddingManager';
import { useWeddingStore } from '@/app/store/sessionStore';
import { UserRole, WeddingResponseDto } from '@shared/api';
import { Button } from '@shared/components';
import NavigationBar from '@shared/components/NavigationBar';
import { Cart } from '@shared/components/cart/cart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/components/ui/form/dropdown-menu';
import { SidebarProvider } from '@shared/components/ui/sidebar';
import { ChevronsUpDown, Gem, AlertTriangle, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import {
  useProgressTrackerStore,
  createEmptyProgressTrackerData,
} from '../store/progressTrackerStore';
import { useUrgentChecklistItems } from '../hooks/useUrgentChecklistItems';
import Link from 'next/link';

const allowedRoutesWithoutWedding = [
  '/admin',
  '/admin/account',
  '/admin/create-wedding',
  '/admin/progress-tracker',
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { fetchUserMainWedding, fetchUserWeddings, loading } = useWeddingManager();
  const { selectedWeddingId, hasHydrated, weddings, checkFirstPurchaseMade } = useWeddingStore();
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, status } = useSession();

  // Route protection: redirect to dashboard if no wedding and trying to access protected routes
  const hasNoWedding = !selectedWeddingId && (!weddings || weddings.length === 0);

  useEffect(() => {
    if (hasHydrated) {
      if (!selectedWeddingId) {
        fetchUserMainWedding();
        fetchUserWeddings();
      }
    }
  }, [hasHydrated, selectedWeddingId, fetchUserMainWedding, fetchUserWeddings]);

  // Check purchase status when wedding is selected
  useEffect(() => {
    if (selectedWeddingId && hasHydrated) {
      checkFirstPurchaseMade();
    }
  }, [selectedWeddingId, hasHydrated, checkFirstPurchaseMade]);

  useEffect(() => {
    // Only redirect if store is hydrated to avoid redirecting during initial load
    if (
      hasHydrated &&
      hasNoWedding &&
      pathname &&
      !allowedRoutesWithoutWedding.includes(pathname)
    ) {
      router.push('/admin');
    }
  }, [hasHydrated, hasNoWedding, pathname, router]);

  // Urgent items modal state
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [urgentItemsCounts, setUrgentItemsCounts] = useState({
    overdueCount: 0,
    currentMonthCount: 0,
    totalUrgentCount: 0,
  });
  const hasShownModalRef = useRef(false);
  const selectedWedding = weddings?.find((w) => w.id === selectedWeddingId) || null;

  // Calculate urgent items when conditions are met (only once per session on /admin route)
  useEffect(() => {
    if (
      hasHydrated &&
      pathname === '/admin' &&
      selectedWeddingId &&
      selectedWedding?.date &&
      !hasShownModalRef.current
    ) {
      // Get checklist data from store without subscribing to changes
      const state = useProgressTrackerStore.getState();
      const progressData =
        state.drafts[selectedWeddingId]?.data ?? createEmptyProgressTrackerData(selectedWeddingId);

      // Calculate urgent items
      const weddingDate = new Date(selectedWedding.date);
      const currentDate = new Date();
      const monthsUntilWedding =
        (weddingDate.getFullYear() - currentDate.getFullYear()) * 12 +
        (weddingDate.getMonth() - currentDate.getMonth());

      let overdueCount = 0;
      let currentMonthCount = 0;

      progressData.checklist.forEach((item) => {
        if (!item.completed) {
          const monthsBeforeWedding = item.monthsBeforeWedding ?? 0;
          if (monthsBeforeWedding > monthsUntilWedding) {
            overdueCount++;
          } else if (monthsBeforeWedding === monthsUntilWedding) {
            currentMonthCount++;
          }
        }
      });

      const totalUrgentCount = overdueCount + currentMonthCount;

      setUrgentItemsCounts({ overdueCount, currentMonthCount, totalUrgentCount });

      if (totalUrgentCount > 0) {
        setShowUrgentModal(true);
        hasShownModalRef.current = true;
      }
    }
  }, [hasHydrated, pathname, selectedWeddingId, selectedWedding?.date]);

  const { overdueCount, currentMonthCount, totalUrgentCount } = urgentItemsCounts;

  console.log('Session status:', status, 'Session data:', session);

  if (status === 'loading' || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div>Loading...</div>
      </main>
    );
  }

  if (!session || session.user.role !== UserRole.ADMIN) {
    console.log('Access denied - Session:', session);
    router.push('/login');
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div>Loading...</div>
      </main>
    );
  }

  if (!selectedWeddingId && weddings && weddings.length > 0) {
    return <SelectWeddingPage />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <NavigationBar
          notificationRoute="/admin/notifications"
          additionalTabs={
            !hasNoWedding && (
              <div className="ml-auto flex items-center gap-4">
                <Cart />
                <WeddingSelector />
              </div>
            )
          }
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Urgent Items Modal */}
      {showUrgentModal && totalUrgentCount > 0 && (
        <ChecklistUrgentModal
          setShowUrgentModal={setShowUrgentModal}
          overdueCount={overdueCount}
          currentMonthCount={currentMonthCount}
        />
      )}

      <Toaster />
    </SidebarProvider>
  );
}

export function ChecklistUrgentModal({
  setShowUrgentModal,
  overdueCount,
  currentMonthCount,
}: {
  setShowUrgentModal: (show: boolean) => void;
  overdueCount: number;
  currentMonthCount: number;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={() => setShowUrgentModal(false)}
          className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon and Title */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Task Alert!</h2>
            <p className="text-sm text-gray-500">You have tasks that require your attention</p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6 space-y-3">
          {overdueCount > 0 && (
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {overdueCount}
                </div>
                <span className="font-semibold text-red-900">
                  {overdueCount === 1 ? '1 overdue item' : `${overdueCount} overdue items`}
                </span>
              </div>
              <p className="mt-1 text-sm text-red-700">
                {overdueCount === 1
                  ? 'This task is past its target completion date'
                  : 'These tasks are past their target completion dates'}
              </p>
            </div>
          )}

          {currentMonthCount > 0 && (
            <div className="rounded-lg bg-yellow-50 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white">
                  {currentMonthCount}
                </div>
                <span className="font-semibold text-yellow-900">
                  {currentMonthCount === 1
                    ? '1 item due this month'
                    : `${currentMonthCount} items due this month`}
                </span>
              </div>
              <p className="mt-1 text-sm text-yellow-700">
                {currentMonthCount === 1
                  ? 'This task should be completed by the end of this month'
                  : 'These tasks should be completed by the end of this month'}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={() => setShowUrgentModal(false)} variant="outline" className="flex-1">
            Dismiss
          </Button>
          <Link href="/admin/progress-tracker" className="flex-1">
            <Button onClick={() => setShowUrgentModal(false)} className="w-full">
              View Progress Tracker
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function WeddingSelector() {
  const weddings = useWeddingStore((state) => state.weddings);
  const selectedWeddingId = useWeddingStore((state) => state.selectedWeddingId);
  const mainWeddingId = useWeddingStore((state) => state.mainWeddingId);
  const currentWeddingName = weddings?.find((wedding) => wedding.id === selectedWeddingId)?.name;
  const displayWeddingName =
    currentWeddingName && currentWeddingName.length > 20
      ? `${currentWeddingName.substring(0, 20)}...`
      : currentWeddingName;
  const { selectWedding } = useWeddingManager();

  // Separate main wedding from other weddings
  const mainWedding = weddings?.find((wedding) => wedding.id === mainWeddingId);
  const otherWeddings = weddings?.filter((wedding) => wedding.id !== mainWeddingId) || [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="darkOutline"
          size="sm"
          className="h-8 gap-2 border-gray-300/80 px-2 no-underline"
        >
          <div className="text-primary flex h-6 w-6 items-center justify-center rounded-full">
            <Gem size={14} />
          </div>
          <span className="text-sm">{displayWeddingName}</span>
          <ChevronsUpDown size={14} className="text-muted-foreground/80" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-full">
        {mainWedding && (
          <>
            <DropdownMenuItem disabled>Your main wedding plan</DropdownMenuItem>
            <DropdownMenuItem
              key={mainWedding.id}
              onClick={() => selectWedding(mainWedding.id)}
              className={`cursor-pointer ${selectedWeddingId === mainWedding.id ? 'bg-primary text-white' : ''}`}
            >
              {mainWedding.name}
            </DropdownMenuItem>
          </>
        )}

        {otherWeddings.length > 0 && (
          <>
            <DropdownMenuItem disabled>
              {mainWedding ? 'Other wedding plans' : 'Wedding plans'}
            </DropdownMenuItem>
            {otherWeddings.map((wedding, index) => (
              <DropdownMenuItem
                key={wedding.id}
                onClick={() => selectWedding(wedding.id)}
                className={`cursor-pointer ${selectedWeddingId === wedding.id ? 'bg-primary text-white' : ''}`}
              >
                {index + 1}. {wedding.name}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SelectWeddingPage() {
  const { selectWedding } = useWeddingManager();
  const weddings = useWeddingStore((state) => state.weddings);

  return (
    <div className="from-brand-50 relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b to-gray-50 py-12">
      <Image
        src="/images/valentines-day-background.jpg"
        alt="Welcome"
        fill
        className="absolute inset-0 z-10 object-cover opacity-5"
      />
      <h1 className="mb-8 text-2xl font-bold">Select Your Wedding</h1>
      <div
        className={`grid w-full max-w-4xl justify-center gap-6 ${weddings.length > 1 ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]' : 'grid-cols-1'} z-20`}
      >
        {weddings &&
          weddings.map((wedding: WeddingResponseDto, index: number) => (
            <Card
              key={wedding.id}
              className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl hover:ring-2"
              onClick={() => selectWedding(Number(wedding.id))}
            >
              <CardHeader>
                <CardTitle>
                  {index + 1}) {wedding.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-2">
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(wedding.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </CardDescription>
                <CardDescription>
                  <span className="font-medium">Location:</span> {wedding.location}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
