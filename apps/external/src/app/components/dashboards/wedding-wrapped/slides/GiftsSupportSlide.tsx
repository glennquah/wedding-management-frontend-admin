'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WeddingWrappedResponseDto } from '@shared/api';
import { TypingText } from '../TypingText';
import { FloatingHearts } from '../ParticleEffects';

interface GiftsSupportSlideContentProps {
  giftSupportInsights: WeddingWrappedResponseDto['giftSupportInsights'];
  formatCurrency: (amount: number) => string;
}

function GiftsSupportSlideContent({ giftSupportInsights, formatCurrency }: GiftsSupportSlideContentProps) {
  const [showQuestion, setShowQuestion] = useState(false);
  const [showGiftValue, setShowGiftValue] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showMostWanted, setShowMostWanted] = useState(false);
  const [showTopContributor, setShowTopContributor] = useState(false);

  const getGiftComment = () => {
    if (giftSupportInsights.totalGiftValue > 10000) {
      return 'Okay WOW! 💰 Your friends and family went ALL OUT!';
    } else if (giftSupportInsights.totalGiftValue > 5000) {
      return 'That\'s some serious love right there! 💝';
    } else if (giftSupportInsights.totalGiftValue > 2000) {
      return 'Not too shabby! Your people came through! 🎁';
    } else {
      return 'It\'s the thought that counts! ❤️';
    }
  };

  const getWishlistComment = () => {
    const completion = giftSupportInsights.wishlistCompletion;
    if (completion >= 95) {
      return 'BINGO! Nearly a perfect score! 🎯';
    } else if (completion >= 75) {
      return 'Most boxes checked! Well done! ✅';
    } else if (completion >= 50) {
      return 'Halfway there! Living on a prayer! 🎵';
    } else {
      return 'Room for more surprises! 🎁';
    }
  };

  return (
    <div className="space-y-6 max-w-[90vw] w-full">
        <motion.h2
          className="text-[120px] font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <TypingText text="Gifts & Support" speed={80} />
        </motion.h2>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            onAnimationComplete={() => setTimeout(() => setShowQuestion(true), 1500)}
          >
            <h3 className="text-8xl text-white/90 text-center">
              <TypingText
                text="Time to count the love... 💕"
                delay={1200}
                speed={70}
              />
            </h3>
          </motion.div>

          {showQuestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="text-9xl text-white font-bold text-center">
                <TypingText
                  text="How generous were your guests?"
                  delay={300}
                  speed={60}
                  onComplete={() => setTimeout(() => setShowGiftValue(true), 1000)}
                />
              </h3>
            </motion.div>
          )}

          {showGiftValue && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 text-center shadow-2xl"
                initial={{ scale: 0, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <div className="text-6xl font-bold text-white mb-2">
                  {formatCurrency(giftSupportInsights.totalGiftValue)}
                </div>
                <div className="text-xl text-white/90">Total Gift Value</div>
              </motion.div>

              <h3 className="text-8xl text-pink-200 font-semibold text-center">
                <TypingText
                  text={getGiftComment()}
                  delay={800}
                  speed={50}
                  onComplete={() => setTimeout(() => setShowWishlist(true), 1200)}
                />
              </h3>
            </motion.div>
          )}

          {showWishlist && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 text-center shadow-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.4, delay: 0.3 }}
              >
                <div className="text-6xl font-bold text-white mb-2">
                  {giftSupportInsights.wishlistCompletion.toFixed(0)}%
                </div>
                <div className="text-xl text-white/90">Wishlist Completion</div>
              </motion.div>

              <h3 className="text-8xl text-purple-200 font-semibold text-center">
                <TypingText
                  text={getWishlistComment()}
                  delay={1000}
                  speed={50}
                  onComplete={() => setTimeout(() => setShowMostWanted(true), 1000)}
                />
              </h3>
            </motion.div>
          )}

          {showMostWanted && giftSupportInsights.topWishlistContributorName && (
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-7xl text-pink-300 font-semibold mb-3">
                <TypingText text="💖 Wishlist Champion!" delay={300} speed={70} />
              </h3>
              <h3 className="text-6xl text-white/70 mb-2">
                <TypingText
                  text="Reserved the most wishlist items!"
                  delay={1500}
                  speed={60}
                />
              </h3>
              <h3 className="text-9xl text-white font-bold pt-1">
                <TypingText
                  text={giftSupportInsights.topWishlistContributorName}
                  delay={3200}
                  speed={60}
                />
              </h3>
              <h3 className="text-6xl text-white/60 mt-2">
                <TypingText
                  text={`${giftSupportInsights.topWishlistContributorCount} ${giftSupportInsights.topWishlistContributorCount === 1 ? 'item' : 'items'} reserved 🎯`}
                  delay={4500}
                  speed={50}
                  onComplete={() => setTimeout(() => setShowTopContributor(true), 800)}
                />
              </h3>
            </motion.div>
          )}

          {showTopContributor && giftSupportInsights.topContributorName && (
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-7xl text-yellow-300 font-semibold mb-3">
                <TypingText text="🌟 MVP - Most Valuable Present!" delay={300} speed={70} />
              </h3>
              <h3 className="text-6xl text-white/70 mb-2">
                <TypingText
                  text="The ultimate gift-giver! 🏆"
                  delay={1800}
                  speed={60}
                />
              </h3>
              <h3 className="text-9xl text-white font-bold pt-1">
                <TypingText
                  text={giftSupportInsights.topContributorName}
                  delay={3200}
                  speed={70}
                />
              </h3>
              <h3 className="text-8xl text-white/80 mt-2">
                <TypingText
                  text={formatCurrency(giftSupportInsights.topContribution || 0)}
                  delay={4500}
                  speed={50}
                />
              </h3>
              <h3 className="text-5xl text-white/50 mt-2">
                <TypingText
                  text="You better send a REALLY good thank you card! 😄"
                  delay={5500}
                  speed={50}
                />
              </h3>
            </motion.div>
          )}
        </div>
      </div>
  );
}

interface GiftsSupportSlideProps {
  giftSupportInsights: WeddingWrappedResponseDto['giftSupportInsights'];
  formatCurrency: (amount: number) => string;
}

export function GiftsSupportSlide({ giftSupportInsights, formatCurrency }: GiftsSupportSlideProps) {
  return {
    background: FloatingHearts,
    content: <GiftsSupportSlideContent giftSupportInsights={giftSupportInsights} formatCurrency={formatCurrency} />,
  };
}
