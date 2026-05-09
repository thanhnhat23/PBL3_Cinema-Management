'use client';

import * as React from 'react';
import { motion, AnimatePresence, type Transition } from 'motion/react';
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/buttons/buttonCarousel';
import { ChevronRight, ChevronLeft, Ticket } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import Autoplay from 'embla-carousel-autoplay';

type PropType = {
  slides: Array<{
    id?: number;
    src: string;
    alt: string;
    title?: string;
    overview?: string;
    priority?: boolean
  }>;
  options?: EmblaOptionsType;
};

type EmblaControls = {
  selectedIndex: number;
  scrollSnaps: number[];
  prevDisabled: boolean;
  nextDisabled: boolean;
  onDotClick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

const transition: Transition = {
  type: 'spring',
  stiffness: 150,
  damping: 25,
  mass: 1,
};

const useEmblaControls = (
  emblaApi: EmblaCarouselType | undefined,
): EmblaControls => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [prevDisabled, setPrevDisabled] = React.useState(true);
  const [nextDisabled, setNextDisabled] = React.useState(true);

  const onDotClick = React.useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onPrev = React.useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNext = React.useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const updateSelectionState = (api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
    setPrevDisabled(!api.canScrollPrev());
    setNextDisabled(!api.canScrollNext());
  };

  const onInit = React.useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
    updateSelectionState(api);
  }, []);

  const onSelect = React.useCallback((api: EmblaCarouselType) => {
    updateSelectionState(api);
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    emblaApi.on('reInit', onInit).on('select', onSelect);

    return () => {
      emblaApi.off('reInit', onInit).off('select', onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  };
};

function MotionCarousel(props: PropType) {
  const { slides, options } = props;
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      ...options,
      align: 'center',
      containScroll: false,
    },
    [
      Autoplay({
        delay: 7000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  } = useEmblaControls(emblaApi);

  return (
    <div className="relative w-full group/carousel [--slide-height:25rem] md:[--slide-height:42rem] [--slide-spacing:0rem] md:[--slide-spacing:1rem] [--slide-size:100%] md:[--slide-size:85%]">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom h-full">
          {slides.map((slide, index) => {
            const isActive = index === selectedIndex;

            return (
              <motion.div
                key={index}
                className="h-(--slide-height) mr-(--slide-spacing) basis-(--slide-size) flex-none flex min-w-0"
              >
                <motion.div
                  className="relative size-full flex items-center justify-center select-none overflow-hidden rounded-none md:rounded-lg border border-white/5"
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.92,
                    opacity: isActive ? 1 : 0.5,
                  }}
                  transition={transition}
                >
                  {/* Backdrop Image */}
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={slide.priority}
                    sizes="(max-width: 768px) 100vw, 85vw"
                    className={cn(
                      "object-cover transition-transform duration-1000 ease-out",
                      isActive ? "scale-105" : "scale-100"
                    )}
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-transparent to-transparent opacity-60" />

                  {/* Movie Info Overlay */}
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 gap-4 md:gap-6 z-20">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-2 max-w-2xl"
                        >
                          <h2 className="text-xl md:text-4xl lg:text-5xl font-black text-white leading-tight uppercase italic drop-shadow-xl">
                            {slide.title}
                          </h2>
                          <p className="text-sm md:text-lg text-white/70 font-medium line-clamp-2 md:line-clamp-3 drop-shadow-md">
                            {slide.overview}
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: 0.4 }}
                          className="flex items-center md:justify-start justify-center gap-4 mb-2"
                        >
                          <Button
                            asChild
                            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold md:font-bold px-6 h-10 md:px-8 md:h-12 text-sm md:text-base rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-2 group/btn cursor-pointer"
                          >
                            <Link href={`/movies/${slide.id}`}>
                              <Ticket className="size-5 group-hover/btn:rotate-12 transition-transform" />
                              {t('navbar.buy_tickets_now')}
                            </Link>
                          </Button>

                          <Button
                            asChild
                            variant="outline"
                            className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-semibold md:font-bold px-6 h-10 md:px-8 md:h-12 text-sm md:text-base rounded-full backdrop-blur-md transition-all cursor-pointer"
                          >
                            <Link href={`/movies/${slide.id}`}>
                              {t('home.see_more')}
                            </Link>
                          </Button>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between z-30 pointer-events-none">
        <Button
          size="icon"
          onClick={onPrev}
          disabled={prevDisabled}
          className={cn(
            "pointer-events-auto cursor-pointer size-12 md:size-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 -translate-x-4 group-hover/carousel:translate-x-0 disabled:opacity-0",
          )}
        >
          <ChevronLeft className="size-6 md:size-8" />
        </Button>

        <Button
          size="icon"
          onClick={onNext}
          disabled={nextDisabled}
          className={cn(
            "pointer-events-auto cursor-pointer size-12 md:size-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 translate-x-4 group-hover/carousel:translate-x-0 disabled:opacity-0",
          )}
        >
          <ChevronRight className="size-6 md:size-8" />
        </Button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={cn(
              "h-1.5 transition-all duration-500 rounded-full cursor-pointer",
              index === selectedIndex
                ? "w-8 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                : "w-2 bg-white/30 hover:bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export { MotionCarousel };
