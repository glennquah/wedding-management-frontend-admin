'use client';

import { useEffect } from 'react';

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
import { ChevronsUpDown, Gem } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'sonner';

const allowedRoutesWithoutWedding = ['/admin', '/admin/account', '/admin/create-wedding'];

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
      <Toaster />
    </SidebarProvider>
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
