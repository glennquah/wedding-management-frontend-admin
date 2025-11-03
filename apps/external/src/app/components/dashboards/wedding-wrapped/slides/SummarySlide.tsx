'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WeddingResponseDto, WeddingWrappedResponseDto } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { Download, Mail, Loader2 } from 'lucide-react';
import { SparklingStars } from '../ParticleEffects';
import { toast } from 'sonner';

interface SummarySlideProps {
  data: WeddingWrappedResponseDto;
  wedding: WeddingResponseDto;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string | null) => string;
}

function SummarySlideContent({ data, wedding, formatCurrency, formatDate }: SummarySlideProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const { guestInsights, giftSupportInsights, planningJourneyInsights, emotionalTouchInsights } = data;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Create a formatted text summary
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

      // Create a blob and download
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
    setIsSendingEmail(true);
    try {
      // Create email body with summary
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

      // Open default email client
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
    <div className="space-y-8 max-w-6xl">
      <motion.h2
        className="text-8xl font-bold text-white mb-8 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Your Wedding at a Glance
      </motion.h2>

      <motion.p
        className="text-3xl text-white/80 text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Here's everything that made your day special ✨
      </motion.p>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Guest Experience */}
        <motion.div
          className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-blue-300 mb-4">👥 Guest Experience</h3>
          <div className="space-y-3 text-white">
            <p className="text-xl"><span className="font-semibold">{guestInsights.totalInvited}</span> invited</p>
            <p className="text-xl"><span className="font-semibold">{guestInsights.totalConfirmed}</span> confirmed</p>
            <p className="text-xl"><span className="font-semibold">{guestInsights.totalAttended}</span> attended</p>
            {guestInsights.firstGuestName && (
              <p className="text-lg text-white/70 mt-3">🏆 {guestInsights.firstGuestName} arrived first</p>
            )}
          </div>
        </motion.div>

        {/* Gifts & Support */}
        <motion.div
          className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-pink-300 mb-4">🎁 Gifts & Support</h3>
          <div className="space-y-3 text-white">
            <p className="text-xl">Total: <span className="font-semibold">{formatCurrency(giftSupportInsights.totalGiftValue)}</span></p>
            <p className="text-xl">Wishlist: <span className="font-semibold">{giftSupportInsights.wishlistCompletion.toFixed(0)}%</span></p>
            {giftSupportInsights.mostWantedItem && (
              <p className="text-lg text-white/70 mt-3">💖 {giftSupportInsights.mostWantedItem} was most wanted</p>
            )}
          </div>
        </motion.div>

        {/* Planning Journey */}
        <motion.div
          className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-amber-300 mb-4">📅 Planning Journey</h3>
          <div className="space-y-3 text-white">
            <p className="text-xl"><span className="font-semibold">{planningJourneyInsights.planningDays}</span> days of planning</p>
            <p className="text-xl">Spent: <span className="font-semibold">{formatCurrency(planningJourneyInsights.totalSpent)}</span></p>
            <p className="text-xl">Budget used: <span className="font-semibold">{planningJourneyInsights.budgetUtilization.toFixed(0)}%</span></p>
          </div>
        </motion.div>

        {/* Memories & Moments */}
        <motion.div
          className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-green-300 mb-4">📸 Memories & Moments</h3>
          <div className="space-y-3 text-white">
            <p className="text-xl"><span className="font-semibold">{emotionalTouchInsights.totalPhotos}</span> photos</p>
            <p className="text-xl"><span className="font-semibold">{emotionalTouchInsights.totalWellWishes}</span> well wishes</p>
            <p className="text-xl"><span className="font-semibold">{emotionalTouchInsights.totalFacesDetected}</span> faces detected</p>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-row gap-6 justify-center items-center pt-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xl px-10 py-6 rounded-full shadow-2xl"
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
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-xl px-10 py-6 rounded-full shadow-2xl"
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
      </motion.div>
    </div>
  );
}

export function SummarySlide({ data, wedding, formatCurrency, formatDate }: SummarySlideProps) {
  return {
    background: SparklingStars,
    content: <SummarySlideContent data={data} wedding={wedding} formatCurrency={formatCurrency} formatDate={formatDate} />,
  };
}
