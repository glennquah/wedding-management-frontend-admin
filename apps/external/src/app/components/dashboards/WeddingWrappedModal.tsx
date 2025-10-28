'use client';

import { WeddingWrappedResponseDto } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Separator } from '@shared/components/ui/separator';
import {
  Heart,
  Users,
  Gift,
  Calendar,
  DollarSign,
  Camera,
  MessageCircle,
  Award,
  Clock,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface WeddingWrappedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: WeddingWrappedResponseDto | null;
  onSave: () => void;
  isSaving: boolean;
}

export function WeddingWrappedModal({
  open,
  onOpenChange,
  data,
  onSave,
  isSaving,
}: WeddingWrappedModalProps) {
  if (!data) return null;

  const { guestInsights, giftSupportInsights, planningJourneyInsights, emotionalTouchInsights } =
    data;

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-brand-500" />
            Wedding Wrapped
          </DialogTitle>
          <DialogDescription>
            A comprehensive look back at your special day and the journey to get there
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Guest Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Guest Experience
              </CardTitle>
              <CardDescription>How your guests celebrated with you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{guestInsights.totalInvited}</p>
                  <p className="text-sm text-muted-foreground">Invited</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {guestInsights.totalConfirmed}
                  </p>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{guestInsights.totalAttended}</p>
                  <p className="text-sm text-muted-foreground">Attended</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                {guestInsights.firstGuestName && (
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-yellow-500 mt-1" />
                    <div>
                      <p className="font-medium">First to Arrive</p>
                      <p className="text-sm text-muted-foreground">
                        {guestInsights.firstGuestName} at {formatDate(guestInsights.firstGuestTime)}
                      </p>
                    </div>
                  </div>
                )}

                {guestInsights.fastestRsvpName && (
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-green-500 mt-1" />
                    <div>
                      <p className="font-medium">Fastest RSVP</p>
                      <p className="text-sm text-muted-foreground">
                        {guestInsights.fastestRsvpName} responded in{' '}
                        {guestInsights.fastestRsvpDuration?.toFixed(1)} hours
                      </p>
                    </div>
                  </div>
                )}

                {guestInsights.peakTime && (
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-red-500 mt-1" />
                    <div>
                      <p className="font-medium">Peak Attendance</p>
                      <p className="text-sm text-muted-foreground">
                        {guestInsights.peakGuestCount} guests at {formatDate(guestInsights.peakTime)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {guestInsights.squadBreakdown.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="font-medium mb-2">Squad Breakdown</p>
                    <div className="grid grid-cols-2 gap-2">
                      {guestInsights.squadBreakdown.map((squad, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-2 bg-muted rounded-md"
                        >
                          <span className="text-sm">{squad.group}</span>
                          <span className="text-sm font-semibold">{squad.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Gift & Support Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-500" />
                Gifts & Support
              </CardTitle>
              <CardDescription>The love and generosity you received</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(giftSupportInsights.totalGiftValue)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Gift Value</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {giftSupportInsights.wishlistCompletion.toFixed(0)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Wishlist Completion</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                {giftSupportInsights.mostWantedItem && (
                  <div className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-pink-500 mt-1" />
                    <div>
                      <p className="font-medium">Most Wanted Item</p>
                      <p className="text-sm text-muted-foreground">
                        {giftSupportInsights.mostWantedItem} ({giftSupportInsights.mostWantedItemCount}{' '}
                        reservations)
                      </p>
                    </div>
                  </div>
                )}

                {giftSupportInsights.topContributorName && (
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-yellow-500 mt-1" />
                    <div>
                      <p className="font-medium">Top Contributor</p>
                      <p className="text-sm text-muted-foreground">
                        {giftSupportInsights.topContributorName} with{' '}
                        {formatCurrency(giftSupportInsights.topContribution || 0)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Planning Journey Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Planning Journey
              </CardTitle>
              <CardDescription>Your path to the big day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {planningJourneyInsights.planningDays}
                  </p>
                  <p className="text-sm text-muted-foreground">Days of Planning</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {planningJourneyInsights.budgetUtilization.toFixed(0)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Budget Used</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium">Total Spent</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(planningJourneyInsights.totalSpent)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Allocated Budget</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(planningJourneyInsights.allocatedBudget)}
                    </p>
                  </div>
                </div>
              </div>

              {planningJourneyInsights.topVendorCategory && (
                <>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-yellow-500 mt-1" />
                    <div>
                      <p className="font-medium">Biggest Investment</p>
                      <p className="text-sm text-muted-foreground">
                        {planningJourneyInsights.topVendorCategory} -{' '}
                        {formatCurrency(planningJourneyInsights.topVendorAmount || 0)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Emotional Touch Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-500" />
                Memories & Moments
              </CardTitle>
              <CardDescription>The captured emotions of your day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {emotionalTouchInsights.totalPhotos}
                  </p>
                  <p className="text-sm text-muted-foreground">Photos Uploaded</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {emotionalTouchInsights.totalWellWishes}
                  </p>
                  <p className="text-sm text-muted-foreground">Well Wishes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {emotionalTouchInsights.totalFacesDetected}
                  </p>
                  <p className="text-sm text-muted-foreground">Faces Detected</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {emotionalTouchInsights.totalPeopleClusters}
                  </p>
                  <p className="text-sm text-muted-foreground">Unique People</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Generated on {new Date(data.generatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Wedding Wrapped'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
