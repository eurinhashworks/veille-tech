"use client";

import React from 'react';
import { motion } from 'framer-motion';
import TrendsWidget from '@/components/dashboard/TrendsWidget';
import StatsWidget from '@/components/dashboard/StatsWidget';
import QuickActionsWidget from '@/components/dashboard/QuickActionsWidget';
import LastReviewWidget from '@/components/dashboard/LastReviewWidget';

// Dummy data for migration
const MOCK_TRENDS = [
  { technology: "AI Agent", currentMentions: 150, predictedMentions: 300, impactScore: 9, sentiment: 0.8 },
  { technology: "React 19", currentMentions: 100, predictedMentions: 120, impactScore: 7, sentiment: 0.9 },
  { technology: "Next.js", currentMentions: 200, predictedMentions: 210, impactScore: 8, sentiment: 0.7 }
];

const MOCK_STATS = {
  totalReviews: 42,
  topCategory: "AI"
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsWidget stats={MOCK_STATS} variants={itemVariants} />
        <TrendsWidget topTrends={MOCK_TRENDS} variants={itemVariants} />
      </div>
      <QuickActionsWidget variants={itemVariants} />
      <LastReviewWidget lastReview={null} variants={itemVariants} />
    </motion.div>
  );
}
