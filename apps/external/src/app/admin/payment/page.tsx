'use client';

import { ListingsService, OrdersService, PaymentsService, VendorsService, WeddingsService } from '@shared/api';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface CartItem {
  listing: any; // Will be ListingResponseDto with vendor info
  selectedDates: string[];
}


export default function PaymentPage() {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'creating-order' | 'redirecting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [weddings, setWeddings] = useState<any[]>([]);
  const [selectedWedding, setSelectedWedding] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;

      try {
        setLoading(true);

        // Fetch admin's weddings
        const weddingsData = await WeddingsService.weddingControllerGetAdminWeddings();
        setWeddings(weddingsData);
        if (weddingsData.length > 0) {
          setSelectedWedding(weddingsData[0]); // Auto-select first wedding
        }

        // Fetch all vendors and their listings
        const vendors = await VendorsService.vendorControllerGetAllVendors();
        const allListings = [];

        // Get listings from all vendors
        for (const vendor of vendors) {
          try {
            const vendorListings = await ListingsService.listingControllerSearch(vendor.id, '');
            // Add vendor info to each listing
            const listingsWithVendor = vendorListings.map(listing => ({
              ...listing,
              vendor: vendor
            }));
            allListings.push(...listingsWithVendor);
          } catch (error) {
            console.log(`No listings found for vendor ${vendor.name}`);
          }
        }

        if (allListings.length > 0) {
          setListings(allListings);
          setSelectedListing(allListings[0]); // Show only the first listing
        } else {
          console.log('No listings found, using sample data');
          // Fallback to sample listing if no real listings exist
          const sampleListing = {
            id: 1,
            listingName: 'Sample Listing',
            price: 15000,
            availabilities: ['2024-12-15', '2024-11-08', '2025-01-25'],
            remarks: 'Sample listing for testing',
            vendorId: vendors[0]?.id || 1,
            vendor: vendors[0] || { name: 'Sample Vendor', bio: 'Sample vendor for testing' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setListings([sampleListing]);
          setSelectedListing(sampleListing);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const addToCart = () => {
    if (selectedDates.length === 0) {
      alert('Please select at least one date');
      return;
    }

    if (!selectedListing) {
      alert('No listing selected');
      return;
    }

    const cartItem: CartItem = {
      listing: selectedListing,
      selectedDates: [...selectedDates]
    };

    setCart([cartItem]);
    setSelectedDates([]);
    alert('Added to cart!');
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const createOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    setPaymentStatus('creating-order');
    setErrorMessage('');

    try {
      // Create order using generated API service
      const order = await OrdersService.orderControllerCreate({
        weddingId: selectedWedding.id,
        listings: cart.map(item => ({
          listingId: item.listing.id,
          bookedDates: item.selectedDates
        })),
        remark: 'Test order from frontend'
      });

      setCurrentOrder(order);

      // Create checkout session and redirect to Stripe
      const checkoutData = await PaymentsService.paymentControllerCreateCheckoutSession({
        orderId: order.id,
        successUrl: `${window.location.origin}/admin/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/admin/payment/cancel`
      });

      setPaymentStatus('redirecting');

      // Redirect to Stripe Checkout
      window.location.href = checkoutData.url;

    } catch (error) {
      console.error('Error creating order:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      setPaymentStatus('error');
    }
  };


  const toggleDateSelection = (date: string) => {
    setSelectedDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  if (status === 'loading' || loading) {
    return <p className="text-center mt-16">Loading...</p>;
  }

  if (!session) {
    return <p className="text-center mt-16">Please log in to access this page.</p>;
  }

  if (!selectedWedding) {
    return <p className="text-center mt-16">No weddings found. Please create a wedding first.</p>;
  }

  if (!selectedListing) {
    return <p className="text-center mt-16">No listings available for testing.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <h1 className="text-3xl font-bold mb-8">Wedding Booking & Payment Test</h1>

      {/* Listing Display */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Featured Listing</h2>
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-blue-600">{selectedListing.listingName}</h3>
            <p className="text-2xl font-bold text-green-600">SGD ${selectedListing.price.toLocaleString()}</p>
            <p className="text-gray-600">{selectedListing.remarks}</p>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Vendor Information</h4>
              <p className="text-sm text-gray-600">{selectedListing.vendor.name}</p>
              <p className="text-sm text-gray-600">{selectedListing.vendor.bio || 'No bio available'}</p>
              <p className="text-sm text-gray-600">Rating: {selectedListing.vendor.rating || 'N/A'}/5.0</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Available Dates</h4>
              <div className="space-y-2">
                {selectedListing.availabilities.map((date: string) => (
                  <label key={date} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedDates.includes(date)}
                      onChange={() => toggleDateSelection(date)}
                      className="rounded"
                    />
                    <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={addToCart}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Cart and Checkout */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Cart & Checkout</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{item.listing.listingName}</h4>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-lg font-semibold text-green-600">
                    SGD ${item.listing.price.toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Selected Dates:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.selectedDates.map(date => (
                        <span key={date} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {new Date(date).toLocaleDateString()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    SGD ${cart.reduce((sum, item) => sum + item.listing.price, 0).toLocaleString()}
                  </span>
                </div>

                {paymentStatus === 'idle' && (
                  <button
                    onClick={createOrder}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium"
                  >
                    Proceed to Checkout
                  </button>
                )}

                {paymentStatus === 'creating-order' && (
                  <div className="text-center py-4">
                    <p>Creating order...</p>
                  </div>
                )}

                {paymentStatus === 'redirecting' && (
                  <div className="text-center py-4">
                    <p>Redirecting to Stripe Checkout...</p>
                  </div>
                )}

                {paymentStatus === 'success' && (
                  <div className="text-center py-6 bg-green-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-green-600 mb-2">Payment Successful! </h3>
                    <p className="text-gray-600">Your booking has been confirmed.</p>
                  </div>
                )}

                {paymentStatus === 'error' && errorMessage && (
                  <div className="text-center py-4 bg-red-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                    <button
                      onClick={() => {
                        setPaymentStatus('idle');
                        setErrorMessage('');
                        setCurrentOrder(null);
                      }}
                      className="mt-3 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Wedding Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Current Wedding:</h3>
        <p>{selectedWedding.weddingName} - {new Date(selectedWedding.date).toLocaleDateString()}</p>
        <p className="text-sm text-gray-600">Budget: SGD ${selectedWedding.budget?.toLocaleString() || 'Not set'}</p>
      </div>
    </div>
  );
}