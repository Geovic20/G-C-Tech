"use client";

import React, { useState, useRef, useEffect, useCallback, CSSProperties } from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { cn } from '@/src/lib/utils';

// --- Component Interfaces ---
export interface Testimonial {
  id: string | number;
  initials: string;
  name: string;
  role: string;
  quote: string;
  tags: { text: string; type: 'featured' | 'default' }[];
  stats: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; text: string; }[];
  avatarGradient: string;
}

export interface TestimonialStackProps {
  testimonials: Testimonial[];
  /** Number of cards to display behind the main card */
  visibleBehind?: number;
  title: string;
  subtitle: string;
}

// --- The component ---
export const TestimonialStack = ({ testimonials, visibleBehind = 2, title, subtitle }: TestimonialStackProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const totalCards = testimonials.length;

  const navigate = useCallback((newIndex: number) => {
    setActiveIndex((newIndex + totalCards) % totalCards);
  }, [totalCards]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (index !== activeIndex) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    dragStartRef.current = clientX;
  };

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    setDragOffset(clientX - dragStartRef.current);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    if (Math.abs(dragOffset) > 100) {
      navigate(activeIndex + (dragOffset < 0 ? 1 : -1));
    }
    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, activeIndex, navigate]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!testimonials?.length) return null;

  return (
    <div className="relative h-[500px] md:h-[550px] w-full flex flex-col items-center justify-center mb-16 px-4">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">{subtitle}</p>
      </div>
      
      <div className="relative w-full max-w-2xl h-[300px] md:h-[340px]">
        {testimonials.map((testimonial, index) => {
          const displayOrder = (index - activeIndex + totalCards) % totalCards;
          const isActive = index === activeIndex;

          const style: CSSProperties = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transition: isDragging && isActive ? 'none' : 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
            cursor: isActive ? (isDragging ? 'grabbing' : 'grab') : 'default',
            touchAction: 'none'
          };

          if (displayOrder === 0) {
            style.transform = `translateX(${dragOffset}px) scale(1)`;
            style.opacity = 1;
            style.zIndex = totalCards;
          } else if (displayOrder <= visibleBehind) {
            const scale = 1 - 0.08 * displayOrder;
            const translateY = -2.5 * displayOrder;
            const rotate = displayOrder % 2 === 0 ? 1 : -1;
            style.transform = `scale(${scale}) translateY(${translateY}rem) rotate(${rotate}deg)`;
            style.opacity = 1 - 0.3 * displayOrder;
            style.zIndex = totalCards - displayOrder;
          } else {
            style.transform = 'scale(0.8) translateY(-6rem)';
            style.opacity = 0;
            style.zIndex = 0;
          }

          return (
            <div
              ref={el => cardRefs.current[index] = el}
              key={testimonial.id}
              className={cn(
                "glass-effect rounded-[40px] p-8 md:p-12 shadow-2xl shadow-blue-900/10 flex flex-col justify-between",
                isActive && isDragging && "scale-[1.02]"
              )}
              style={style}
              onMouseDown={(e) => handleDragStart(e, index)}
              onTouchStart={(e) => handleDragStart(e, index)}
            >
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 text-blue-500/10 w-12 h-12 md:w-16 md:h-16 -z-10" />
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                  <div className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-lg shadow-blue-500/20",
                    testimonial.avatarGradient
                  )}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-xs md:text-sm font-medium text-gray-400">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto hidden sm:flex gap-2">
                    {testimonial.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          tag.type === 'featured' ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                        )}
                      >
                        {tag.text}
                      </span>
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 text-base md:text-xl font-medium leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </div>

              <div className="flex items-center gap-6 md:gap-10 mt-6 md:mt-10 pt-6 md:pt-8 border-t border-gray-100/50">
                {testimonial.stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-[#007bff]" />
                    </div>
                    <span className="text-sm font-bold text-gray-600 tracking-tight">{stat.text}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-12">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === activeIndex ? "w-10 bg-[#007bff]" : "w-2 bg-gray-200"
            )}
          />
        ))}
      </div>
    </div>
  );
};
