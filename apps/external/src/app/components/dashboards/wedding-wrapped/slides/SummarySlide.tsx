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
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showGuestCard, setShowGuestCard] = useState(false);
  const [showGiftsCard, setShowGiftsCard] = useState(false);
  const [showPlanningCard, setShowPlanningCard] = useState(false);
  const [showMemoriesCard, setShowMemoriesCard] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const { guestInsights, giftSupportInsights, planningJourneyInsights, emotionalTouchInsights } = data;

  // Cascade the reveals with suspense
  useState(() => {
    setTimeout(() => setShowTitle(true), 500);
    setTimeout(() => setShowSubtitle(true), 1500);
    setTimeout(() => setShowGuestCard(true), 2500);
    setTimeout(() => setShowGiftsCard(true), 3500);
    setTimeout(() => setShowPlanningCard(true), 4500);
    setTimeout(() => setShowMemoriesCard(true), 5500);
    setTimeout(() => setShowButtons(true), 6500);
  });

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
      {/* Title with drum roll effect */}
      {showTitle && (
        <motion.h2
          className="text-8xl font-bold text-white mb-8 text-center"
          initial={{ opacity: 0, scale: 0.5, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
        >
          Your Wedding at a Glance
        </motion.h2>
      )}

      {showSubtitle && (
        <motion.p
          className="text-4xl text-white/80 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Here&apos;s everything that made your day special ✨
        </motion.p>
      )}

      {/* Summary Grid - Cards appear one by one */}
      <div className="grid grid-cols-2 gap-6">
        {/* Guest Experience */}
        {showGuestCard && (
          <motion.div
            className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30"
            initial={{ opacity: 0, scale: 0.3, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          >
            <h3 className="text-3xl font-bold text-blue-300 mb-4">👥 Guest Experience</h3>
            <div className="space-y-3 text-white">
              <motion.p
                className="text-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="font-semibold">{guestInsights.totalInvited}</span> invited
              </motion.p>
              <motion.p
                className="text-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="font-semibold">{guestInsights.totalConfirmed}</span> confirmed
              </motion.p>
              <motion.p
                className="text-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span className="font-semibold">{guestInsights.totalAttended}</span> attended
              </motion.p>
              {guestInsights.firstGuestName && (
                <motion.p
                  className="text-lg text-white/70 mt-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  🏆 {guestInsights.firstGuestName} arrived first
                </motion.p>
              )}
            </div>
          </motion.div>
        )}

        {/* Gifts & Support */}
        {showGiftsCard && (
          <motion.div
            className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30"
            initial={{ opacity: 0, scale: 0.3, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          >
            <h3 className="text-3xl font-bold text-pink-300 mb-4">🎁 Gifts & Support</h3>
            <div className="space-y-3 text-white">
              <motion.p
                className="text-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Total: <span className="font-semibold">{formatCurrency(giftSupportInsights.totalGiftValue)}</span>
              </motion.p>
              <motion.p
                className="text-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Wishlist: <span className="font-semibold">{giftSupportInsights.wishlistCompletion.toFixed(0)}%</span>
              </motion.p>
              {giftSupportInsights.mostWantedItem && (
                <motion.p
                  className="text-lg text-white/70 mt-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  💖 {giftSupportInsights.mostWantedItem} was most wanted
                </motion.p>
              )}
            </div>
          </motion.div>
        )}

        {/* Planning Journey */}
        {showPlanningCard && (
          <motion.div
            className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30"
            initial={{ opacity: 0, scale: 0.3, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          >
            <h3 className="text-3xl font-bold text-amber-300 mb-4">📅 Planning Journey</h3>
            <div className="space-y-3 text-white">
              <motion.p
                className="text-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="font-semibold">{planningJourneyInsights.planningDays}</span> days of planning
              </motion.p>
              <motion.p
                className="text-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Spent: <span className="font-semibold">{formatCurrency(planningJourneyInsights.totalSpent)}</span>
              </motion.p>
              <motion.p
                className="text-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                Budget used: <span className="font-semibold">{planningJourneyInsights.budgetUtilization.toFixed(0)}%</span>
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Memories & Moments */}
        {showMemoriesCard && (
          <motion.div
            className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30"
            initial={{ opacity: 0, scale: 0.3, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          >
            <h3 className="text-3xl font-bold text-green-300 mb-4">📸 Memories & Moments</h3>
            <div className="space-y-3 text-white">
              <motion.p
                className="text-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="font-semibold">{emotionalTouchInsights.totalPhotos}</span> photos
              </motion.p>
              <motion.p
                className="text-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="font-semibold">{emotionalTouchInsights.totalWellWishes}</span> well wishes
              </motion.p>
              <motion.p
                className="text-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span className="font-semibold">{emotionalTouchInsights.totalFacesDetected}</span> faces detected
              </motion.p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      {showButtons && (
        <motion.div
          className="flex flex-row gap-6 justify-center items-center pt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
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
      )}
    </div>
  );
}

export function SummarySlide({ data, wedding, formatCurrency, formatDate }: SummarySlideProps) {
  return {
    background: SparklingStars,
    content: <SummarySlideContent data={data} wedding={wedding} formatCurrency={formatCurrency} formatDate={formatDate} />,
  };
}
