"use client"

import { Tabs, Tab, Divider, Button } from "@heroui/react";
import { useState, useEffect, useMemo } from "react";
import { Popcorn, Armchair, Clapperboard, WalletCards, BadgeCheck, ChevronRight, ChevronLeft, Calendar, MapPin, Monitor } from "lucide-react";
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

// Stores
import { useLocationStore } from '@/stores/useLocationStore';
import { useCinemaStore } from '@/stores/useCinemaStore';
import { useMovieStore } from '@/stores/useMovieStore';
import { useShowTimeStore } from '@/stores/useShowTimeStore';
import { useSeatStore } from '@/stores/useSeatStore';

// Components
import { SelectServiceTab } from '@/components/layout/SelectTab/SelectServiceTab';
import { SelectSeatTab } from '@/components/layout/SelectTab/SelectSeatTab';

interface BookingSelection {
  location: string;
  movieTitle: string;
  cinemaId: string;
  showtimeDate: string;
  showtimeId: string;
  selectedSeats: string[];
}

const STEPS = [
  { key: "select-service", label: "Phim", icon: <Clapperboard size={20} /> },
  { key: "select-seat", label: "Ghế", icon: <Armchair size={20} /> },
  { key: "select-food", label: "Đồ ăn", icon: <Popcorn size={20} /> },
  { key: "payment", label: "Thanh toán", icon: <WalletCards size={20} /> },
  { key: "confirmation", label: "Xác nhận", icon: <BadgeCheck size={20} /> }
];

export default function BookingPage() {
  const [selection, setSelection] = useState<BookingSelection>({
    location: "",
    movieTitle: "",
    cinemaId: "",
    showtimeDate: "",
    showtimeId: "",
    selectedSeats: []
  });

  const [currentStep, setCurrentStep] = useState("select-service");
  const [unlockedStepIndex, setUnlockedStepIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "select-location": true
  });

  const locations = useLocationStore(state => state.locations);
  const fetchAllLocations = useLocationStore(state => state.fetchAllLocations);
  
  const cinemas = useCinemaStore(state => state.cinemas);
  const fetchAllCinemas = useCinemaStore(state => state.fetchAllCinemas);
  
  const movies = useMovieStore(state => state.movies);
  const fetchAllMovies = useMovieStore(state => state.fetchAllMovies);
  
  const showtimes = useShowTimeStore(state => state.showtimes);
  const isLoadingShowtimes = useShowTimeStore(state => state.isFetching);
  const fetchAllShowtimes = useShowTimeStore(state => state.fetchAllShowtimes);
  
  const seats = useSeatStore(state => state.seats);
  const fetchSeatsForShowtime = useSeatStore(state => state.fetchSeatsForShowtime);
  const { t } = useTranslation();

  const STEPS = [
    { key: "select-service", label: t('booking.steps.movie'), icon: <Clapperboard size={20} /> },
    { key: "select-seat", label: t('booking.steps.seat'), icon: <Armchair size={20} /> },
    { key: "select-food", label: t('booking.steps.food'), icon: <Popcorn size={20} /> },
    { key: "payment", label: t('booking.steps.payment'), icon: <WalletCards size={20} /> },
    { key: "confirmation", label: t('booking.steps.confirmation'), icon: <BadgeCheck size={20} /> }
  ];

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        fetchAllLocations(),
        fetchAllCinemas(),
        fetchAllMovies(),
        fetchAllShowtimes()
      ]);
    };
    init();
  }, [fetchAllLocations, fetchAllCinemas, fetchAllMovies, fetchAllShowtimes]);

  useEffect(() => {
    if (selection.showtimeId) {
      fetchSeatsForShowtime(parseInt(selection.showtimeId, 10));
    }
  }, [selection.showtimeId, fetchSeatsForShowtime]);

  const activeMovie = useMemo(() => 
    movies.find(m => m.title === selection.movieTitle), 
  [movies, selection.movieTitle]);

  const activeShowtime = useMemo(() => 
    showtimes.find(st => st.showtime_id === parseInt(selection.showtimeId, 10)),
  [showtimes, selection.showtimeId]);

  const filteredShowtimes = useMemo(() => {
    if (!selection.showtimeDate || !activeMovie) return [];
    
    return showtimes.filter(st => {
      const stDate = new Date(st.startTime).toISOString().split('T')[0];
      const matchesDate = stDate === selection.showtimeDate;
      const matchesMovie = st.movie_id === activeMovie.movie_id;
      const matchesCinema = selection.cinemaId ? st.cinema_id === parseInt(selection.cinemaId, 10) : true;
      
      return matchesDate && matchesMovie && matchesCinema;
    });
  }, [showtimes, selection.showtimeDate, activeMovie, selection.cinemaId]);

  const handleSelectionChange = <K extends keyof BookingSelection>(key: K, value: BookingSelection[K]) => {
    setSelection(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'location') {
        next.movieTitle = "";
        next.cinemaId = "";
        next.showtimeDate = "";
        next.showtimeId = "";
        next.selectedSeats = [];
      } else if (key === 'movieTitle') {
        next.cinemaId = "";
        next.showtimeDate = "";
        next.showtimeId = "";
        next.selectedSeats = [];
      } else if (key === 'cinemaId' || key === 'showtimeDate') {
        next.showtimeId = "";
        next.selectedSeats = [];
      }
      return next;
    });

    if (key === 'location') {
      setExpandedSections({ "select-location": false, "select-movie": true });
    }
    if (key === 'movieTitle') {
      setExpandedSections({ "select-movie": false, "select-showtime": true });
    }
  };

  const toggleSection = (key: string, forceState?: boolean) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: forceState !== undefined ? forceState : !prev[key]
    }));
  };

  const canProceed = useMemo(() => {
    if (currentStep === "select-service") {
      return !!(selection.location && selection.movieTitle && selection.showtimeId);
    }
    if (currentStep === "select-seat") {
      return selection.selectedSeats.length > 0;
    }
    return true;
  }, [currentStep, selection]);

  const navigateToStep = (stepKey: string) => {
    const stepIdx = STEPS.findIndex(s => s.key === stepKey);
    if (stepIdx <= unlockedStepIndex) setCurrentStep(stepKey);
  };

  const nextStep = () => {
    if (!canProceed) return;
    const currentIdx = STEPS.findIndex(s => s.key === currentStep);
    if (currentIdx < STEPS.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentStep(STEPS[nextIdx].key);
      setUnlockedStepIndex(prev => Math.max(prev, nextIdx));
    }
  };

  const prevStep = () => {
    const currentIdx = STEPS.findIndex(s => s.key === currentStep);
    if (currentIdx > 0) setCurrentStep(STEPS[currentIdx - 1].key);
  };

  const legacyStateSelect = { 
    "select-location": [selection.location], 
    "select-movie": [selection.movieTitle],
    "select-cinema": [selection.cinemaId],
    "select-showtime": [selection.showtimeDate, selection.showtimeId],
    "select-seat": selection.selectedSeats
  };

  const summaryDisplay = [
    { label: t('booking.selection.select_cinema'), val: selection.location },
    { label: t('booking.selection.select_movie'), val: selection.movieTitle },
    { 
      label: t('booking.selection.select_showtime'), 
      val: activeShowtime ? `${selection.showtimeDate} ${new Date(activeShowtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : "" 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD] dark:bg-[#050505]">
      {/* Step Navigation Header */}
      <div className="sticky top-0 z-30 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs
            items={STEPS}
            variant="underlined"
            selectedKey={currentStep}
            onSelectionChange={(k) => navigateToStep(String(k))}
            disabledKeys={STEPS.slice(unlockedStepIndex + 1).map(s => s.key)}
            classNames={{
              tabList: "gap-4 md:gap-12 relative rounded-none p-0 border-none h-20",
              cursor: "w-full bg-amber-500 h-[3px] rounded-full",
              tab: "max-w-fit px-0 h-20",
              tabContent: "group-data-[selected=true]:text-amber-500 font-black uppercase text-xs tracking-[0.2em] transition-all duration-300"
            }}
          >
            {(step) => (
              <Tab 
                key={step.key} 
                title={
                  <div className="flex gap-2.5 items-center justify-center">
                    <div className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      currentStep === step.key ? "bg-amber-500/10 text-amber-500" : "text-zinc-400"
                    )}>
                      {step.icon}
                    </div>
                    <span className="hidden md:block">{step.label}</span>
                  </div>
                } 
              />
            )}
          </Tabs>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-8 max-w-7xl w-full mx-auto px-6 py-10">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {currentStep === "select-service" ? (
            <SelectServiceTab
              select={summaryDisplay.map(s => ({ key: s.label === t('booking.selection.select_cinema') ? "select-location" : s.label === t('booking.selection.select_movie') ? "select-movie" : "select-showtime", label: s.label, state: s.val ? `- ${s.val}` : "" }))}
              showSelect={expandedSections}
              stateSelect={legacyStateSelect}
              locations={locations}
              cinemas={cinemas}
              nowShowingMovies={movies.filter(m => m.status === 0)}
              showtimes={showtimes}
              selectedCinema={cinemas.find(c => String(c.cinema_id) === selection.cinemaId)}
              isLoadingShoTimes={isLoadingShowtimes}
              onToggleSection={toggleSection}
              onSelectValue={(k, v) => {
                if (k === 'select-location') handleSelectionChange('location', v[0]);
                if (k === 'select-movie') handleSelectionChange('movieTitle', v[0]);
                if (k === 'select-cinema') handleSelectionChange('cinemaId', v[0]);
                if (k === 'select-showtime') {
                   handleSelectionChange('showtimeDate', v[0]);
                   if (v[1]) handleSelectionChange('showtimeId', v[1]);
                }
              }}
              onFetchShowtimes={fetchAllShowtimes}
            />
          ) : currentStep === "select-seat" ? (
            <SelectSeatTab
              selectedSeatCodes={selection.selectedSeats}
              activeShowtimeId={selection.showtimeId}
              seats={seats}
              showtimeOptions={filteredShowtimes.map(st => ({
                id: st.showtime_id,
                label: new Date(st.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              }))}
              onSelectSeats={(s) => handleSelectionChange('selectedSeats', s)}
              onSelectShowtime={(id) => handleSelectionChange('showtimeId', id)}
            />
          ) : (
             <div className="w-full min-h-100 flex flex-col items-center justify-center bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-sm border border-zinc-200 dark:border-white/10 shadow-2xl p-12 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <BadgeCheck size={40} />
                </div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                  {STEPS.find(s => s.key === currentStep)?.label}
                </h2>
                <p className="text-zinc-500 font-medium max-w-md">
                  {t('booking.feature_updating')}
                </p>
             </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="md:w-96 space-y-6">
          <div className="sticky top-28 space-y-6">
            <div className="relative group overflow-hidden bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-sm shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-amber-500 to-orange-600" />
              
              <div className="p-6 space-y-6">
                <div className="flex gap-6">
                  <div className="relative w-28 h-40 shrink-0 rounded-lg overflow-hidden shadow-xl border border-white/10">
                    <Image
                      src={activeMovie?.poster_path ? `https://image.tmdb.org/t/p/w185${activeMovie.poster_path}` : "/h.png"}
                      alt="Movie Poster"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex flex-col gap-3 py-1">
                    <h2 className="text-lg font-black leading-tight text-zinc-900 dark:text-white uppercase italic">
                      {selection.movieTitle || t('booking.selection.not_selected_movie')}
                    </h2>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                        <MapPin size={14} className="text-amber-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">{selection.location || t('booking.selection.not_selected_cinema')}</span>
                      </div>
                      
                      {activeShowtime && (
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                          <Calendar size={14} className="text-amber-500" />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {selection.showtimeDate} • {new Date(activeShowtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}

                      {activeShowtime?.Room?.nameRoom && (
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                          <Monitor size={14} className="text-amber-500" />
                          <span className="text-xs font-bold uppercase tracking-wider">{t('booking.selection.room')}: {activeShowtime.Room.nameRoom}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Divider className="bg-zinc-200 dark:bg-white/10" />

                {selection.selectedSeats.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{t('booking.sidebar.selected_seats')}</p>
                    <div className="flex flex-wrap gap-2">
                      {selection.selectedSeats.map(seat => (
                        <span key={seat} className="px-3 py-1 rounded-md bg-amber-500/10 text-amber-500 text-xs font-black border border-amber-500/20 shadow-sm">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-end pt-4 border-t border-zinc-100 dark:border-white/5">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">{t('booking.sidebar.total')}</span>
                  <span className="text-2xl font-black text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                    0 <span className="text-sm">{t('common.currency_vnd')}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                variant="bordered"
                size="lg"
                onClick={prevStep}
                isDisabled={currentStep === "select-service"}
                className="flex gap-2 items-center justify-center px-4 py-2 rounded-sm border-2 font-bold text-sm transition-all hover:bg-zinc-100 dark:hover:bg-white/5"
                startContent={<ChevronLeft size={18} />}
              >
                {t('booking.buttons.back')}
              </Button>

              <Button
                size="lg"
                onClick={nextStep}
                isDisabled={!canProceed}
                className={cn(
                  "flex gap-2 items-center justify-center px-4 py-2 rounded-sm font-bold text-sm transition-all shadow-xl",
                  canProceed 
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.4)] hover:-translate-y-1" 
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                )}
                endContent={<ChevronRight size={18} />}
              >
                {t('booking.buttons.next')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}