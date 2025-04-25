
import React from 'react';
import { cn } from '../../lib/utils';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: 'first' | 'second' | 'third' | 'fourth' | 'fifth';
  animation?: 'fade' | 'slide' | 'scale';
  hoverEffect?: boolean;
  glassmorphism?: boolean;
}

const AnimatedCard = ({
  children,
  className,
  delay = 'first',
  animation = 'fade',
  hoverEffect = true,
  glassmorphism = false,
  ...props
}: AnimatedCardProps) => {
  const getAnimationClass = () => {
    switch (animation) {
      case 'fade':
        return 'opacity-0 animate-fade-in';
      case 'slide':
        return 'opacity-0 animate-slide-up';
      case 'scale':
        return 'opacity-0 animate-scale-in';
      default:
        return 'opacity-0 animate-fade-in';
    }
  };

  const getHoverClass = () => {
    if (!hoverEffect) return '';
    return 'transition-all duration-300 hover:shadow-md hover:-translate-y-1';
  };

  const getDelayClass = () => {
    return `appear-${delay}`;
  };

  const getGlassmorphismClass = () => {
    if (!glassmorphism) return '';
    return 'glass-card';
  };

  return (
    <div
      className={cn(
        'rounded-xl p-6',
        getAnimationClass(),
        getHoverClass(),
        getDelayClass(),
        getGlassmorphismClass(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
