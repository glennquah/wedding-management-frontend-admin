'use client';

import * as React from 'react';

import useIsMobileScreen from '../../hooks/useIsMobileScreen';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '../ui/drawer';
import { Separator } from '../ui/separator';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import { useCartStore, useWeddingStore } from '@/app/store/sessionStore';
import { CartItemResponseDto } from '@shared/api';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export function Cart() {
  const { cartItems, removeItem, clearCart, fetchCart, createOrder } = useCartStore();
  const { selectedWeddingId } = useWeddingStore();
  const { data: session, status } = useSession();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  const isMobile = useIsMobileScreen();
  const isDesktop = !isMobile;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalItems = cartItems.length;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  React.useEffect(() => {
    if (!session?.user.id) return;

    setIsMounted(true);
    fetchCart(session?.user.id);
  }, [fetchCart, session?.user.id]);

  const CartTrigger = (
    <Button
      aria-label="Open cart"
      className="relative h-9 w-9 rounded-full text-primary bg-transparent"
      size="icon"
      variant="ghost"
    >
      <ShoppingCart className="h-4 w-4" />
      {totalItems > 0 && (
        <Badge
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-[10px]"
          variant="default"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  );

  const CartContent = (
    <>
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
          <div>
            <div className="text-xl font-semibold">Your Cart</div>
            <div className="text-sm text-muted-foreground">
              {totalItems === 0
                ? 'Your cart is empty'
                : `You have ${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
            </div>
          </div>
          {isDesktop && (
            <SheetClose asChild>
              <Button size="icon" variant="ghost">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          <AnimatePresence>
            {cartItems.length === 0 ? (
              <motion.div
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
              >
                <div
                  className={`
                    mb-4 flex h-20 w-20 items-center justify-center rounded-full
                    bg-muted
                  `}
                >
                  <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Your cart is empty</h3>
                <p className="mb-6 text-center text-sm text-muted-foreground">
                  Looks like you haven't added anything to your cart yet.
                </p>
                {isDesktop ? (
                  <SheetClose asChild>
                    <Link href="/products">
                      <Button>Browse Products</Button>
                    </Link>
                  </SheetClose>
                ) : (
                  <DrawerClose asChild>
                    <Link href="/products">
                      <Button>Browse Products</Button>
                    </Link>
                  </DrawerClose>
                )}
              </motion.div>
            ) : (
              <div className="space-y-4 py-4 max-h-120 overflow-y-auto">
                {cartItems.map((item: CartItemResponseDto) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                      group relative flex rounded-lg border bg-card p-2
                      shadow-sm transition-colors
                      hover:bg-accent/50
                    `}
                    exit={{ opacity: 0, y: -10 }}
                    initial={{ opacity: 0, y: 10 }}
                    key={item.id}
                    layout
                    transition={{ duration: 0.15 }}
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded">
                      <Image
                        alt={item.listingName}
                        className="object-cover"
                        fill
                        src={item.imageUrls[0]}
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col">
                            <Link
                              className={`
        line-clamp-2 text-sm font-medium
        group-hover:text-primary
      `}
                              href={`/products/${item.id}`}
                              onClick={() => setIsOpen(false)}
                            >
                              {item.listingName}
                            </Link>

                            {item.selectedSlots.length > 0 && (
                              <p className="text-[0.625rem] text-muted-foreground mt-1">
                                {item.selectedSlots.map((slot, index) => {
                                  const date = slot.date ? `${slot.date} ` : '';
                                  const start = new Date(slot.startTime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  });
                                  const end = new Date(slot.endTime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  });
                                  return (
                                    <span key={index}>
                                      {date}
                                      {start} - {end}
                                      {index < item.selectedSlots.length - 1 ? ', ' : ''}
                                    </span>
                                  );
                                })}
                              </p>
                            )}
                          </div>
                          <button
                            className={`
                              -mt-1 -mr-1 ml-2 rounded-full p-1
                              text-muted-foreground transition-colors
                              hover:bg-muted hover:text-destructive
                            `}
                            onClick={() => {
                              if (!session?.user.id) return;
                              removeItem(session.user.id, item.listingId);
                            }}
                            type="button"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <div className="text-sm font-medium">${item.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-300 px-6 py-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <Separator className="bg-gray-400" />
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">Total</span>
                <span className="text-base font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <Button
                className="w-full"
                variant="default"
                onClick={() => createOrder(selectedWeddingId || 0)}
              >
                Checkout
              </Button>
              <div className="flex items-center justify-between">
                {isDesktop ? (
                  <SheetClose asChild>
                    <Button variant="secondary">Continue Shopping</Button>
                  </SheetClose>
                ) : (
                  <DrawerClose asChild>
                    <Button variant="secondary">Continue Shopping</Button>
                  </DrawerClose>
                )}
                <Button
                  className="ml-2"
                  onClick={() => {
                    if (!session?.user.id) return;
                    clearCart(session.user.id);
                  }}
                  variant="secondary"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (!isMounted) {
    return (
      <div>
        <Button
          aria-label="Open cart"
          className="relative h-9 w-9 rounded-full"
          size="icon"
          variant="outline"
        >
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge
              className={`
                absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-[10px]
              `}
              variant="default"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div>
      {isDesktop ? (
        <Sheet onOpenChange={setIsOpen} open={isOpen}>
          <SheetTrigger asChild>{CartTrigger}</SheetTrigger>
          <SheetContent asChild>
            <motion.div
              className="flex w-[400px] flex-col p-0"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.05 }}
            >
              {CartContent}
            </motion.div>
          </SheetContent>
        </Sheet>
      ) : (
        <Drawer onOpenChange={setIsOpen} open={isOpen}>
          <DrawerTrigger asChild>{CartTrigger}</DrawerTrigger>
          <DrawerContent className="p-0">
            <motion.div
              className="flex flex-col"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.1 }}
            >
              {CartContent}
            </motion.div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
