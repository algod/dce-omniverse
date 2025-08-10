'use client';

import { motion } from 'framer-motion';
import { zsColors } from '@/lib/design-system/zs-colors';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rect' | 'circle';
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  width = '100%',
  height = '20px',
  variant = 'rect',
  animation = 'pulse'
}: SkeletonProps) {
  const radiusMap = {
    text: '4px',
    rect: '8px',
    circle: '50%'
  };

  const animationVariants: any = {
    pulse: {
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    wave: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }
    },
    none: {}
  };

  return (
    <motion.div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: radiusMap[variant],
        backgroundColor: zsColors.neutral.lightGray + '30',
        background: animation === 'wave' 
          ? `linear-gradient(90deg, ${zsColors.neutral.lightGray}30 25%, ${zsColors.neutral.lightGray}50 50%, ${zsColors.neutral.lightGray}30 75%)`
          : undefined,
        backgroundSize: animation === 'wave' ? '200% 100%' : undefined
      }}
      animate={animation !== 'none' ? animationVariants[animation] : undefined}
    />
  );
}

// Chart skeleton
export function ChartSkeleton() {
  return (
    <div className="p-4 bg-white rounded-lg" style={{ height: '400px' }}>
      <Skeleton width="200px" height="24px" className="mb-4" />
      <div className="flex items-end justify-between h-[320px]">
        {[0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 0.7].map((height, i) => (
          <Skeleton
            key={i}
            width="12%"
            height={`${height * 100}%`}
            animation="wave"
          />
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <Skeleton key={i} width="12%" height="12px" />
        ))}
      </div>
    </div>
  );
}

// Agent card skeleton
export function AgentCardSkeleton() {
  return (
    <div className="p-5 bg-white rounded-xl border" 
      style={{ borderColor: zsColors.neutral.lightGray }}
    >
      <div className="flex items-start gap-3">
        <Skeleton width="48px" height="48px" variant="rect" />
        <div className="flex-1">
          <Skeleton width="60%" height="20px" className="mb-2" />
          <Skeleton width="100%" height="14px" className="mb-1" />
          <Skeleton width="80%" height="14px" />
        </div>
      </div>
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex p-4" style={{ 
        backgroundColor: zsColors.neutral.offWhite,
        borderBottom: `1px solid ${zsColors.neutral.lightGray}`
      }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1 px-2">
            <Skeleton width="80%" height="16px" />
          </div>
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex p-4"
          style={{ 
            borderBottom: rowIndex < rows - 1 ? `1px solid ${zsColors.neutral.lightGray}` : undefined
          }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1 px-2">
              <Skeleton 
                width={colIndex === 0 ? "60%" : "40%"} 
                height="14px"
                animation="wave"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Chat message skeleton
export function ChatMessageSkeleton({ isUser = false }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
        <Skeleton width="32px" height="32px" variant="circle" />
        <div>
          <div className="p-3 rounded-lg" style={{
            backgroundColor: isUser ? zsColors.neutral.offWhite : zsColors.neutral.white,
            border: !isUser ? `1px solid ${zsColors.neutral.lightGray}` : undefined
          }}>
            <Skeleton width="200px" height="14px" className="mb-2" />
            <Skeleton width="150px" height="14px" />
          </div>
          <Skeleton width="60px" height="10px" className="mt-2" />
        </div>
      </div>
    </div>
  );
}

// Full page skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: zsColors.neutral.offWhite }}>
      {/* Header */}
      <div className="mb-8">
        <Skeleton width="300px" height="36px" className="mb-3" />
        <Skeleton width="500px" height="20px" />
      </div>

      {/* Tab navigation */}
      <div className="flex gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} width="100px" height="40px" />
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat panel */}
        <div className="bg-white rounded-lg p-4" style={{ minHeight: '500px' }}>
          <Skeleton width="150px" height="24px" className="mb-4" />
          <ChatMessageSkeleton />
          <ChatMessageSkeleton isUser />
          <ChatMessageSkeleton />
        </div>

        {/* Visualization panel */}
        <div>
          <ChartSkeleton />
        </div>
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <AgentCardSkeleton />
        <AgentCardSkeleton />
        <AgentCardSkeleton />
      </div>
    </div>
  );
}

// Analytics loading state
export function AnalyticsLoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full border-2 border-t-transparent"
          style={{ borderColor: zsColors.primary.blue }}
        />
        <div>
          <Skeleton width="200px" height="20px" className="mb-2" />
          <Skeleton width="300px" height="14px" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartSkeleton />
        <div className="space-y-4">
          <TableSkeleton rows={3} cols={3} />
          <div className="p-4 bg-white rounded-lg">
            <Skeleton width="150px" height="18px" className="mb-3" />
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between mb-2">
                <Skeleton width="100px" height="14px" />
                <Skeleton width="60px" height="20px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}