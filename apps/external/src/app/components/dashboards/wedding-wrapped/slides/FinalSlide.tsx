'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WeddingResponseDto, WeddingWrappedResponseDto } from '@shared/api';
import { Button } from '@shared/components/ui/button';
import { TypingText } from '../TypingText';
import { FireworksParticles } from '../ParticleEffects';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import qrCode from '../../../../../../public/images/paylah_qr.jpeg';

interface FinalSlideProps {
  onSave: () => void;
  isSaving: boolean;
  data?: WeddingWrappedResponseDto;
  wedding?: WeddingResponseDto;
  formatCurrency?: (amount: number) => string;
  formatDate?: (dateString: string | null) => string;
}

function FinalSlideContent({
  onSave,
  isSaving,
  data,
  wedding,
  formatCurrency,
  formatDate,
}: FinalSlideProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showCreatorsSection, setShowCreatorsSection] = useState(false);

  const handleDownload = async () => {
    if (!data || !wedding || !formatCurrency || !formatDate) return;

    setIsDownloading(true);
    try {
      const {
        guestInsights,
        giftSupportInsights,
        planningJourneyInsights,
        emotionalTouchInsights,
      } = data;

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

  return (
    <div className="max-w-[90vw] space-y-10 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <h1 className="mb-6 text-8xl font-bold text-white">Thank You for Celebrating</h1>
      </motion.div>
      <motion.h3
        className="mb-10 text-7xl text-white/90"
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
            className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-12 py-6 text-2xl text-white shadow-2xl hover:from-pink-600 hover:to-purple-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Saving...
              </>
            ) : (
              <>💝 Save Wedding Wrapped</>
            )}
          </Button>
        </div>

        {/* Download Summary */}
        {data && wedding && formatCurrency && formatDate && (
          <motion.div
            className="pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.8 }}
          >
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              size="lg"
              variant="outline"
              className="rounded-full border-white/30 bg-white/10 px-8 py-5 text-lg text-white backdrop-blur-lg hover:bg-white/20"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Download Summary
                </>
              )}
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* From the Creators Section */}
      <motion.div
        className="space-y-6 pt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.0, duration: 0.8 }}
        onAnimationComplete={() => setShowCreatorsSection(true)}
      >
        <div className="rounded-3xl border-2 border-white/20 bg-white/10 p-8 backdrop-blur-lg">
          {showCreatorsSection && (
            <>
              <h3 className="mb-6 text-4xl font-bold text-white">
                <TypingText text="From the creators of Knotly 💝" delay={500} speed={60} />
              </h3>
              <h3 className="mb-6 text-2xl leading-relaxed text-white/90">
                <TypingText
                  text="Thank you for using Knotly to help you with your journey and to make your special day unforgettable. We hope that everything went well on your end! We are just 6 broke students from NUS who want to do well for this module and to earn a living. If you think this benefited you, do consider helping us! 🙏"
                  delay={3000}
                  speed={50}
                />
              </h3>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 17.0, duration: 0.8 }}
              >
                <Button
                  onClick={() => setShowQRCode(!showQRCode)}
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-10 py-5 text-xl font-bold text-white shadow-2xl hover:from-yellow-500 hover:to-orange-600"
                >
                  ✨ Get Good Karma ✨
                </Button>
              </motion.div>

              {/* QR Code Modal */}
              {showQRCode && (
                <motion.div
                  className="mt-6 inline-block rounded-2xl bg-white p-6"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                >
                  <h3 className="mb-4 text-2xl font-bold text-gray-800">Scan to Support Us!</h3>
                  <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-xl">
                    <Image src={qrCode} alt="PayLah QR Code" fill className="object-contain" />
                  </div>
                  <h3 className="mt-4 text-lg text-gray-600">Every little bit helps! 🙏</h3>
                </motion.div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function FinalSlide({
  onSave,
  isSaving,
  data,
  wedding,
  formatCurrency,
  formatDate,
}: FinalSlideProps) {
  return {
    background: FireworksParticles,
    content: (
      <FinalSlideContent
        onSave={onSave}
        isSaving={isSaving}
        data={data}
        wedding={wedding}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    ),
  };
}
