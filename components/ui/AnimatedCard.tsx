'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { zsColors } from '@/lib/design-system/zs-colors';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
  glowColor?: string;
  disabled?: boolean;
}

export function AnimatedCard({
  children,
  className = '',
  hoverScale = 1.02,
  style,
  onClick,
  glowColor,
  disabled = false
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Mouse position tracking for glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for mouse movement
  const springConfig = { damping: 20, stiffness: 300 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);
  
  // Transform mouse position to rotation
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['1deg', '-1deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-1deg', '1deg']);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        cursor: onClick && !disabled ? 'pointer' : 'default',
        opacity: disabled ? 0.6 : 1
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={disabled ? {} : { 
        scale: hoverScale,
        transition: { duration: 0.2 }
      }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={disabled ? undefined : onClick}
    >
      {/* Glow effect on hover */}
      {glowColor && !disabled && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mouseXSpring.get() * 100 + 50}% ${mouseYSpring.get() * 100 + 50}%, ${glowColor}20, transparent 40%)`,
            opacity: 0,
            zIndex: -1
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* 3D rotation effect */}
      <motion.div
        style={{
          rotateX: disabled ? 0 : rotateX,
          rotateY: disabled ? 0 : rotateY,
          transformPerspective: 1000
        }}
      >
        {children}
      </motion.div>
      
      {/* Subtle shadow that follows mouse */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: `${mouseXSpring.get() * 20}px ${mouseYSpring.get() * 20}px 40px rgba(0,0,0,0.1)`,
            zIndex: -2
          }}
        />
      )}
    </motion.div>
  );
}

// Specialized button with ripple effect
interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  style
}: AnimatedButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);
    
    onClick?.(e);
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  const variantStyles = {
    primary: {
      backgroundColor: zsColors.primary.blue,
      color: zsColors.neutral.white,
      border: 'none'
    },
    secondary: {
      backgroundColor: zsColors.neutral.white,
      color: zsColors.primary.blue,
      border: `1px solid ${zsColors.primary.blue}`
    },
    ghost: {
      backgroundColor: 'transparent',
      color: zsColors.neutral.darkGray,
      border: 'none'
    }
  };

  return (
    <motion.button
      className={`relative overflow-hidden rounded-lg font-medium transition-all ${sizeClasses[size]} ${className}`}
      style={{
        ...variantStyles[variant],
        ...style,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={handleClick}
      disabled={disabled}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: variant === 'primary' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'
          }}
          initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            width: 300,
            height: 300,
            x: -150,
            y: -150,
            opacity: 0
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
      
      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// List item with stagger animation
interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export function AnimatedList({
  children,
  className = '',
  staggerDelay = 0.05
}: AnimatedListProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { 
              opacity: 1, 
              x: 0,
              transition: {
                duration: 0.3,
                ease: 'easeOut'
              }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

import { useState } from 'react';
import React from 'react';