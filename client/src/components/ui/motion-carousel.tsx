'use client';

import * as React from 'react';
import { motion, type Transition } from 'motion/react';
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/buttons/buttonCarousel';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

type PropType = {
  slides: Array<{ src: string; alt: string; priority?: boolean }>;
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
  stiffness: 240,
  damping: 24,
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

  const onPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const onNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const {
    selectedIndex,
    prevDisabled,
    nextDisabled,
    onPrev,
    onNext,
  } = useEmblaControls(emblaApi);

  return (
    <div className="relative w-full space-y-4 [--slide-height:15rem] md:[--slide-height:33rem] [--slide-spacing:0rem] md:[--slide-spacing:1.5rem] [--slide-size:100%] md:[--slide-size:75%]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map(({ src, alt, priority }, index) => {
            const isActive = index === selectedIndex;

            return (
              <motion.div
                key={index}
                className="h-(--slide-height) mr-(--slide-spacing) basis-(--slide-size) flex-none flex min-w-0"
              >
                <motion.div
                  className="size-full flex items-center justify-center select-none border-2 rounded-none md:rounded-lg"
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.9,
                  }}
                  transition={transition}
                >
                  <Image 
                    src={src}
                    alt={alt} 
                    width={3000}
                    height={900}
                    priority={priority}
                    className="w-full h-full object-fill rounded-none md:rounded-lg cursor-pointer"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute top-1/3 md:top-50 left-0 right-0 flex justify-between">
        <Button size="custom-right" onClick={onPrev} disabled={prevDisabled} variant={"accent"}>
          <ChevronLeft className="size-5 md:size-8" />
        </Button>

        <Button size="custom-left" onClick={onNext} disabled={nextDisabled} variant={"accent"}>
          <ChevronRight className="size-5 md:size-8" />
        </Button>
      </div>
    </div>
  );
}

export { MotionCarousel };
