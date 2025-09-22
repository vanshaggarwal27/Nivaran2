'use client';
import React, { useEffect, useState, useRef } from 'react';
import {
  motion,
  SpringOptions,
  useMotionValue,
  useSpring,
  AnimatePresence,
  Transition,
  Variant,
} from 'framer-motion';
import { cn } from '@/lib/utils';

type CursorProps = {
  children: React.ReactNode;
  className?: string;
  springConfig?: SpringOptions;
  attachToParent?: boolean;
  transition?: Transition;
  variants?: {
    initial: Variant;
    animate: Variant;
    exit: Variant;
  };
  onPositionChange?: (x: number, y: number) => void;
};

export function Cursor({
  children,
  className,
  springConfig,
  attachToParent,
  variants,
  transition,
  onPositionChange,
}: CursorProps) {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!attachToParent) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'auto';
    }

    const updatePosition = (e: MouseEvent) => {
      if (attachToParent && parentRef.current) {
        const rect = parentRef.current.getBoundingClientRect();
        cursorX.set(e.clientX - rect.left);
        cursorY.set(e.clientY - rect.top);
      } else {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }
      onPositionChange?.(e.clientX, e.clientY);
    };

    document.addEventListener('mousemove', updatePosition);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
    };
  }, [cursorX, cursorY, onPositionChange, attachToParent]);

  const cursorXSpring = useSpring(cursorX, springConfig || { duration: 0 });
  const cursorYSpring = useSpring(cursorY, springConfig || { duration: 0 });

  useEffect(() => {
    if (attachToParent && cursorRef.current) {
      parentRef.current = cursorRef.current.parentElement;
      
      const handleMouseEnter = () => {
        console.log('Mouse entered parent element');
        if (parentRef.current) {
          parentRef.current.style.cursor = 'none';
          setIsVisible(true);
        }
      };

      const handleMouseLeave = () => {
        console.log('Mouse left parent element');
        if (parentRef.current) {
          parentRef.current.style.cursor = 'auto';
          setIsVisible(false);
        }
      };

      if (parentRef.current) {
        parentRef.current.addEventListener('mouseenter', handleMouseEnter);
        parentRef.current.addEventListener('mouseleave', handleMouseLeave);
      }

      return () => {
        if (parentRef.current) {
          parentRef.current.removeEventListener('mouseenter', handleMouseEnter);
          parentRef.current.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    } else {
      setIsVisible(true);
    }
  }, [attachToParent]);

  return (
    <motion.div
      ref={cursorRef}
      className={cn(
        'pointer-events-none z-50',
        attachToParent ? 'absolute' : 'fixed left-0 top-0',
        className
      )}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial='initial'
            animate='animate'
            exit='exit'
            variants={variants}
            transition={transition}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
