'use client';

import React from 'react';

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  slideDirection?: 'left' | 'right';
}

export default function Carousel({ 
  children, 
  className = '', 
  slideDirection = 'left' 
}: CarouselProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="mask-edges">
        <div className={`animate-scroll-${slideDirection} flex gap-4`}>
          {/* Double the children to create seamless loop */}
          {React.Children.map(children, (child) => (
            <React.Fragment key={Math.random()}>{child}</React.Fragment>
          ))}
          {React.Children.map(children, (child) => (
            <React.Fragment key={Math.random()}>{child}</React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
} 