'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WeddingResponseDto, WeddingWrappedResponseDto } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { TypingText } from '../TypingText';
import { FireworksParticles } from '../ParticleEffects';
import { Download, Mail, Loader2, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface FinalSlideProps {
  onSave: () => void;
  isSaving: boolean;
  data?: WeddingWrappedResponseDto;
  wedding?: WeddingResponseDto;
  formatCurrency?: (amount: number) => string;
  formatDate?: (dateString: string | null) => string;
}

function FinalSlideContent({ onSave, isSaving, data, wedding, formatCurrency, formatDate }: FinalSlideProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleDownload = async () => {
    if (!data || !wedding || !formatCurrency || !formatDate) return;

    setIsDownloading(true);
    try {
      const { guestInsights, giftSupportInsights, planningJourneyInsights, emotionalTouchInsights } = data;

      const summary = `
╔════════════════════════════════════════════════════════════════╗
║                    WEDDING WRAPPED SUMMARY                     ║
╚════════════════════════════════════════════════════════════════╝

Wedding: ${wedding.name}
Date: ${new Date(wedding.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Location: ${wedding.location || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GUEST EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Invited: ${guestInsights.totalInvited}
• Total Confirmed: ${guestInsights.totalConfirmed}
• Total Attended: ${guestInsights.totalAttended}
• Attendance Rate: ${((guestInsights.totalAttended / guestInsights.totalInvited) * 100).toFixed(1)}%
${guestInsights.firstGuestName ? `• First to Arrive: ${guestInsights.firstGuestName} at ${formatDate(guestInsights.firstGuestTime)}` : ''}
${guestInsights.fastestRsvpName ? `• Fastest RSVP: ${guestInsights.fastestRsvpName} (${guestInsights.fastestRsvpDuration?.toFixed(1)} hours)` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GIFTS & SUPPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Gift Value: ${formatCurrency(giftSupportInsights.totalGiftValue)}
• Wishlist Completion: ${giftSupportInsights.wishlistCompletion.toFixed(0)}%
${giftSupportInsights.mostWantedItem ? `• Most Wanted Item: ${giftSupportInsights.mostWantedItem} (${giftSupportInsights.mostWantedItemCount} reservations)` : ''}
${giftSupportInsights.topContributorName ? `• Top Contributor: ${giftSupportInsights.topContributorName} - ${formatCurrency(giftSupportInsights.topContribution || 0)}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLANNING JOURNEY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Planning Duration: ${planningJourneyInsights.planningDays} days
• Total Spent: ${formatCurrency(planningJourneyInsights.totalSpent)}
• Allocated Budget: ${formatCurrency(planningJourneyInsights.allocatedBudget)}
• Budget Utilization: ${planningJourneyInsights.budgetUtilization.toFixed(0)}%
${planningJourneyInsights.topVendorCategory ? `• Top Spending Category: ${planningJourneyInsights.topVendorCategory} - ${formatCurrency(planningJourneyInsights.topVendorAmount || 0)}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MEMORIES & MOMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Photos Uploaded: ${emotionalTouchInsights.totalPhotos}
• Well Wishes: ${emotionalTouchInsights.totalWellWishes}
• Faces Detected: ${emotionalTouchInsights.totalFacesDetected}
• Unique People: ${emotionalTouchInsights.totalPeopleClusters}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
Made with ❤️ by Wedding Management Platform
      `.trim();

      const blob = new Blob([summary], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Wedding-Wrapped-${wedding.name.replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Wedding Wrapped summary downloaded!');
    } catch (error) {
      console.error('Error downloading summary:', error);
      toast.error('Failed to download summary. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!data || !wedding || !formatCurrency || !formatDate) return;

    setIsSendingEmail(true);
    try {
      const { guestInsights, giftSupportInsights, planningJourneyInsights, emotionalTouchInsights } = data;

      const emailSubject = `Wedding Wrapped Summary - ${wedding.name}`;
      const emailBody = `
Hi there!

Here's your Wedding Wrapped Summary for ${wedding.name}:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GUEST EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Invited: ${guestInsights.totalInvited}
• Total Confirmed: ${guestInsights.totalConfirmed}
• Total Attended: ${guestInsights.totalAttended}
${guestInsights.firstGuestName ? `• First to Arrive: ${guestInsights.firstGuestName}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GIFTS & SUPPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Gift Value: ${formatCurrency(giftSupportInsights.totalGiftValue)}
• Wishlist Completion: ${giftSupportInsights.wishlistCompletion.toFixed(0)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLANNING JOURNEY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Planning Duration: ${planningJourneyInsights.planningDays} days
• Total Spent: ${formatCurrency(planningJourneyInsights.totalSpent)}
• Budget Utilization: ${planningJourneyInsights.budgetUtilization.toFixed(0)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MEMORIES & MOMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Photos Uploaded: ${emotionalTouchInsights.totalPhotos}
• Well Wishes: ${emotionalTouchInsights.totalWellWishes}

These moments will last forever in your hearts! ❤️

Best wishes,
Wedding Management Platform
      `.trim();

      const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;

      toast.success('Email client opened! Compose your message.');
    } catch (error) {
      console.error('Error opening email:', error);
      toast.error('Failed to open email client. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="text-center space-y-10 max-w-[90vw]">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <h1 className="text-8xl font-bold text-white mb-6">Thank You for Celebrating</h1>
      </motion.div>
      <motion.h3
        className="text-7xl text-white/90 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <TypingText text="Your special day was truly magical ✨" delay={800} speed={90} />
      </motion.h3>

      {/* Action Buttons */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        {/* Save Button */}
        <div>
          <Button
            onClick={onSave}
            disabled={isSaving}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-2xl px-12 py-6 rounded-full shadow-2xl"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>💝 Save Wedding Wrapped</>
            )}
          </Button>
        </div>

        {/* Share Options */}
        {data && wedding && formatCurrency && formatDate && (
          <motion.div
            className="pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.8 }}
          >
            <h3 className="text-2xl text-white/70 mb-4 flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" />
              Share your memories
            </h3>
            <div className="flex flex-row gap-4 justify-center">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-lg px-8 py-5 rounded-full backdrop-blur-lg"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download Summary
                  </>
                )}
              </Button>

              <Button
                onClick={handleSendEmail}
                disabled={isSendingEmail}
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-lg px-8 py-5 rounded-full backdrop-blur-lg"
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Opening...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Email Summary
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export function FinalSlide({ onSave, isSaving, data, wedding, formatCurrency, formatDate }: FinalSlideProps) {
  return {
    background: FireworksParticles,
    content: <FinalSlideContent onSave={onSave} isSaving={isSaving} data={data} wedding={wedding} formatCurrency={formatCurrency} formatDate={formatDate} />,
  };
}
