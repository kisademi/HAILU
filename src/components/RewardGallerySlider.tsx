import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ResilientImage } from './ResilientImage';

interface GallerySlide {
  imageUrl: string;
  styleName: string;
}

interface RewardGallerySliderProps {
  slides: GallerySlide[];
  title: string;
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}

export const RewardGallerySlider: React.FC<RewardGallerySliderProps> = ({
  slides,
  title,
  activeIndex,
  onSelectIndex,
}) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ x: number; scrollLeft: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const scrollToSlide = (index: number) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    onSelectIndex(clamped);
    const el = scrollerRef.current;
    if (el) {
      el.scrollTo({
        left: clamped * el.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const nextIdx = Math.round(el.scrollLeft / el.clientWidth);
    if (nextIdx !== activeIndex && nextIdx >= 0 && nextIdx < slides.length) {
      onSelectIndex(nextIdx);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, scrollLeft: el.scrollLeft };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const start = dragStartRef.current;
    if (!isDragging || !el || !start) return;
    const delta = e.clientX - start.x;
    el.scrollLeft = start.scrollLeft - delta;
  };

  const endMouseDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    dragStartRef.current = null;
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const snapped = Math.round(el.scrollLeft / el.clientWidth);
    scrollToSlide(snapped);
  };

  const currentSlide = slides[activeIndex] || slides[0];

  return (
    <div className="relative aspect-[4/3] bg-white border-b border-slate-100 overflow-hidden select-none group">
      {/* Top Style Indicator */}
      <div className="absolute top-3 left-3 z-20 bg-white/95 border border-sky-100 rounded-lg px-2.5 py-1 text-[11px] font-medium text-sky-800 shadow-xs">
        款式 {activeIndex + 1}/{slides.length} · {currentSlide.styleName}
      </div>

      {/* Horizontal Swipe Track */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endMouseDrag}
        onMouseLeave={endMouseDrag}
        className={`w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        aria-label={`${title}款式滑动预览`}
      >
        {slides.map((slide, idx) => (
          <div
            key={`${slide.styleName}-${idx}`}
            className="w-full h-full shrink-0 snap-center flex items-center justify-center bg-white p-2"
          >
            <ResilientImage
              src={slide.imageUrl}
              alt={`${title} - ${slide.styleName}`}
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
        ))}
      </div>

      {/* Left / Right Navigation Arrows */}
      <button
        type="button"
        onClick={() => scrollToSlide(activeIndex === 0 ? slides.length - 1 : activeIndex - 1)}
        aria-label="上一款帆布包"
        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-slate-200/80 text-slate-700 flex items-center justify-center shadow-sm transition-colors"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => scrollToSlide(activeIndex === slides.length - 1 ? 0 : activeIndex + 1)}
        aria-label="下一款帆布包"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-slate-200/80 text-slate-700 flex items-center justify-center shadow-sm transition-colors"
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* Bottom Dots + Swipe Hint */}
      <div className="absolute bottom-2.5 inset-x-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1.5 rounded-full border border-slate-200/70 pointer-events-auto">
          {slides.map((slide, idx) => (
            <button
              key={slide.styleName}
              type="button"
              onClick={() => scrollToSlide(idx)}
              aria-label={`查看款式：${slide.styleName}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeIndex ? 'w-4 bg-sky-600' : 'w-1.5 bg-slate-300 hover:bg-sky-300'
              }`}
            />
          ))}
        </div>

        <span className="text-[10px] font-medium text-slate-500 bg-white/90 px-2 py-1 rounded-md border border-slate-200/70">
          左右滑动切换款式
        </span>
      </div>
    </div>
  );
};
