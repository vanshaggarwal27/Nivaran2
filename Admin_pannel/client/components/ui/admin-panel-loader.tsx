'use client';
import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

function TextShimmer({
  children,
  as: Component = 'p',
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const MotionComponent = motion(Component as any);

  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]',
        '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
        'dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
}

interface AdminPanelLoaderProps {
  text?: string;
  logoSize?: number;
}

export function AdminPanelLoader({ 
  text = "Loading Admin Panel...",
  logoSize = 120
}: AdminPanelLoaderProps = {}) {
  const logoRef = useRef<HTMLDivElement>(null);

  // Dynamic logo animation variants
  const logoVariants = {
    initial: { scale: 1, rotate: 0 },
    animate: {
      scale: [1, 1.1, 0.9, 1.05, 1],
      rotate: [0, 180, 360],
      borderRadius: ["20%", "50%", "20%", "40%", "20%"],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1]
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0.3, scale: 1 },
    animate: {
      opacity: [0.3, 0.8, 0.5, 1, 0.3],
      scale: [1, 1.2, 0.8, 1.3, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1.5, 0],
      opacity: [0, 0.6, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeOut",
        repeatDelay: 0.5
      }
    }
  };

  const orbitalVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i * 10)}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Main logo container */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Orbital rings */}
        <motion.div
          variants={orbitalVariants}
          animate="animate"
          className="absolute inset-0 w-40 h-40 border border-primary/20 rounded-full"
          style={{ width: logoSize * 1.8, height: logoSize * 1.8 }}
        />
        <motion.div
          variants={orbitalVariants}
          animate="animate"
          className="absolute inset-0 w-32 h-32 border border-primary/30 rounded-full"
          style={{ 
            width: logoSize * 1.4, 
            height: logoSize * 1.4,
            animationDirection: 'reverse'
          }}
        />

        {/* Pulse rings */}
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className="absolute inset-0 border-2 border-primary/40 rounded-full"
          style={{ width: logoSize * 2, height: logoSize * 2 }}
        />

        {/* Glow effect */}
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
          style={{ width: logoSize * 1.5, height: logoSize * 1.5 }}
        />

        {/* Main logo */}
        <motion.div
          ref={logoRef}
          variants={logoVariants}
          initial="initial"
          animate="animate"
          className="relative z-10 bg-gradient-to-br from-primary via-primary/80 to-primary/60 shadow-2xl flex items-center justify-center"
          style={{ 
            width: logoSize, 
            height: logoSize,
            boxShadow: `0 0 ${logoSize/3}px rgba(var(--primary), 0.3)`
          }}
        >
          {/* Inner geometric shapes */}
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              className="absolute w-8 h-8 bg-background rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute w-4 h-4 bg-primary-foreground rounded-sm"
              animate={{
                rotate: [0, -180, -360],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute w-6 h-1 bg-background rounded-full"
              animate={{
                scaleX: [1, 1.5, 1],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        {/* Orbiting dots */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-primary rounded-full"
            style={{
              transformOrigin: `${logoSize * 0.8}px center`,
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.8
            }}
          />
        ))}
      </div>

      {/* Loading text with shimmer effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center"
      >
        <TextShimmer
          className="text-lg font-medium text-foreground/80 tracking-wide"
          duration={2.5}
          spread={3}
        >
          {text}
        </TextShimmer>
        
        {/* Progress dots */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary/60 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Subtle version indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 text-xs text-muted-foreground font-mono"
      >
        v2.1.0
      </motion.div>
    </div>
  );
}
