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
import { useSnackStore } from '@/stores/useSnackStore';

// Components
import { SelectServiceTab } from '@/components/layout/SelectTab/SelectServiceTab';
import { SelectSeatTab } from '@/components/layout/SelectTab/SelectSeatTab';
import { SelectFoodTab } from '@/components/layout/SelectTab/SelectFoodTab';
import { SelectPaymentTab } from '@/components/layout/SelectTab/SelectPaymentTab';
import { ConfirmationTab } from '@/components/layout/SelectTab/ConfirmationTab';

// Stores
import { useCouponStore } from '@/stores/useCouponStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useVnpayStore } from '@/stores/useVnpayStore';
import { useMomoStore } from '@/stores/useMomoStore';
import { useBookingStore } from '@/stores/useBookingStore';
import type { PaymentMethod } from '@/types/payment';

interface BookingSelection {
  location: string;
  movieTitle: string;
  cinemaId: string;
  showtimeDate: string;
  showtimeId: string;
  selectedSeats: string[];
  selectedSnacks: Record<number, number>; // snack_id -> quantity
  paymentMethod: PaymentMethod | "";
  couponId: number | null;
}

export default function BookingPage() {
  const [selection, setSelection] = useState<BookingSelection>({
    location: "",
    movieTitle: "",
    cinemaId: "",
    showtimeDate: "",
    showtimeId: "",
    selectedSeats: [],
    selectedSnacks: {},
    paymentMethod: "",
    couponId: null
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

  const isFetchingMovies = useMovieStore(state => state.isFetchingMovies);
  const isFetchingLocations = useLocationStore(state => state.isFetchingLocations);

  const snacks = useSnackStore(state => state.snacks);
  const isFetchingSnacks = useSnackStore(state => state.isFetchingSnacks);
  const fetchAllSnacks = useSnackStore(state => state.fetchAllSnacks);

  const coupons = useCouponStore(state => state.coupons);
  const fetchAllCoupons = useCouponStore(state => state.fetchAllCoupons);
  const validateCoupon = useCouponStore(state => state.validateCoupon);

  const authUser = useAuthStore(state => state.authUser);

  const createBooking = useBookingStore(state => state.createBooking);
  const isCreatingBooking = useBookingStore(state => state.isCreatingBooking);

  const createVnpayUrl = useVnpayStore(state => state.createPaymentUrl);
  const isCreatingVnpay = useVnpayStore(state => state.isCreatingPayment);

  const createMomoUrl = useMomoStore(state => state.createMomoPayment);
  const isCreatingMomo = useMomoStore(state => state.isCreatingPayment);

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [realBookingData, setRealBookingData] = useState<{ booking_id: number; paymentUrl: string } | null>(null);

  const seats = useSeatStore(state => state.seats);
  const fetchSeatsForShowtime = useSeatStore(state => state.fetchSeatsForShowtime);
  const { t } = useTranslation();

  const STEPS = useMemo(() => [
    { key: "select-service", label: t('booking.steps.movie'), icon: <Clapperboard size={20} /> },
    { key: "select-seat", label: t('booking.steps.seat'), icon: <Armchair size={20} /> },
    { key: "select-food", label: t('booking.steps.food'), icon: <Popcorn size={20} /> },
    { key: "confirmation", label: t('booking.steps.confirmation'), icon: <BadgeCheck size={20} /> },
    { key: "payment", label: t('booking.steps.payment'), icon: <WalletCards size={20} /> },
  ], [t]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        fetchAllLocations(),
        fetchAllCinemas(),
        fetchAllMovies(),
        fetchAllShowtimes(),
        fetchAllSnacks(),
        fetchAllCoupons()
      ]);
    };
    init();
  }, [fetchAllLocations, fetchAllCinemas, fetchAllMovies, fetchAllShowtimes, fetchAllSnacks, fetchAllCoupons]);

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

      const matchesStatus = st.status === 1 || st.status === 2;

      return matchesDate && matchesMovie && matchesCinema && matchesStatus;
    });
  }, [showtimes, selection.showtimeDate, activeMovie, selection.cinemaId]);

  const seatsTotal = useMemo(() => {
    return selection.selectedSeats.reduce((acc, code) => {
      const seat = seats.find(s => `${String.fromCharCode(65 + s.row)}${s.column}` === code);
      return acc + (seat?.price || 0);
    }, 0);
  }, [selection.selectedSeats, seats]);
  const snacksTotal = Object.entries(selection.selectedSnacks)
    .reduce((acc, [id, qty]) => {
      const snack = snacks.find(s => s.snack_id === parseInt(id));
      return acc + (snack?.price || 0) * qty;
    }, 0);
  const subtotal = seatsTotal + snacksTotal;

  const activeCoupon = coupons.find(c => c.coupon_id === selection.couponId) || null;
  const discountAmount = useMemo(() => {
    if (!activeCoupon) return 0;
    let disc = 0;
    if (activeCoupon.type === 0) {
      disc = (subtotal * activeCoupon.discountValue) / 100;
      if (activeCoupon.maxDiscountAmount > 0) disc = Math.min(disc, activeCoupon.maxDiscountAmount);
    } else {
      disc = activeCoupon.discountValue;
    }
    return disc;
  }, [activeCoupon, subtotal]);

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleSelectionChange = (key: keyof BookingSelection, value: any) => {
    setSelection(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'location') {
        next.movieTitle = "";
        next.cinemaId = "";
        next.showtimeDate = "";
        next.showtimeId = "";
        next.selectedSeats = [];
        setExpandedSections({
          "select-location": false,
          "select-movie": true,
          "select-showtime": false
        });
      } else if (key === 'movieTitle') {
        next.cinemaId = "";
        next.showtimeDate = "";
        next.showtimeId = "";
        next.selectedSeats = [];
        setExpandedSections({
          "select-location": false,
          "select-movie": false,
          "select-showtime": true
        });
      } else if (key === 'cinemaId' || key === 'showtimeDate') {
        next.showtimeId = "";
        next.selectedSeats = [];
        next.selectedSnacks = {};
      } else if (key === 'showtimeId' && value) {
        // Auto collapse all if showtime is selected
        setExpandedSections({
          "select-location": false,
          "select-movie": false,
          "select-showtime": false
        });
      }
      if (key !== 'paymentMethod') {
        setRealBookingData(null);
      }
      return next;
    });
  };

  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!couponCode.trim()) {
      setSelection(prev => ({ ...prev, couponId: null }));
      return;
    }

    if (!authUser) {
        setCouponError(t('auth.login_required') || "Please login to use coupon.");
        return;
    }

    const result = await validateCoupon(couponCode.trim(), authUser.id, subtotal);

    if (!result.isValid) {
      setCouponError(result.message);
      setSelection(prev => ({ ...prev, couponId: null }));
      return;
    }

    // Find the coupon to get its ID (though the backend should ideally return it too)
    const coupon = coupons.find(c => c.code.toLowerCase() === couponCode.trim().toLowerCase());
    
    setRealBookingData(null);
    setSelection(prev => ({ ...prev, couponId: coupon?.coupon_id || null }));
  };


  const handleSnackQuantityChange = (snackId: number, quantity: number) => {
    setRealBookingData(null);
    setSelection(prev => ({
      ...prev,
      selectedSnacks: {
        ...prev.selectedSnacks,
        [snackId]: quantity
      }
    }));
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
    if (currentStep === "select-food") {
      return true; // Food is optional
    }
    if (currentStep === "confirmation") {
      return !!selection.paymentMethod;
    }
    return true;
  }, [currentStep, selection]);

  const navigateToStep = (stepKey: string) => {
    const stepIdx = STEPS.findIndex(s => s.key === stepKey);
    if (stepIdx <= unlockedStepIndex) setCurrentStep(stepKey);
  };

  const nextStep = async () => {
    if (!canProceed) return;
    const currentIdx = STEPS.findIndex(s => s.key === currentStep);
    if (currentIdx < STEPS.length - 1) {
      const nextIdx = currentIdx + 1;
      const nextKey = STEPS[nextIdx].key;

      if (nextKey === "payment") {
        if (!activeShowtime) return;

        const snacksPayload = Object.entries(selection.selectedSnacks)
          .filter(([id, qty]) => qty > 0)
          .map(([id, qty]) => ({ snack_id: parseInt(id), quantity: qty }));

        const selectedSeatIds = selection.selectedSeats.map(code => {
          const seat = seats.find(s => `${String.fromCharCode(65 + s.row)}${s.column}` === code);
          return seat?.seat_id;
        }).filter((id): id is number => id !== undefined);

        try {
          let bookingId = realBookingData?.booking_id;
          let currentFinalAmount = finalTotal;

          if (!bookingId) {
            const bookingResult = await createBooking({
              showtime_id: activeShowtime.showtime_id,
              coupon_id: selection.couponId,
              snacks: snacksPayload,
              seat_ids: selectedSeatIds,
              totalAmount: subtotal,
              discountAmount: discountAmount,
              finalAmount: finalTotal
            });
            
            if (!bookingResult) return;
            bookingId = bookingResult.booking_id;
            currentFinalAmount = bookingResult.finalAmount;
          }

          if (bookingId && selection.paymentMethod) {
            setCurrentStep(nextKey);
            setUnlockedStepIndex(prev => Math.max(prev, nextIdx));

            let paymentUrl = "";

            if (selection.paymentMethod === 'MOMO' || selection.paymentMethod === 'MOMO_ATM') {
              const momoResult = await createMomoUrl({
                booking_id: bookingId,
                orderInfo: `${t('payment.order_payment_info')} #${bookingId}`,
                requestType: selection.paymentMethod === 'MOMO_ATM' ? 'payWithATM' : 'captureWallet',
                returnUrl: `${window.location.origin}/order/momo_return`
              });
              paymentUrl = momoResult?.payUrl || "";
            } else {
                const vnpayResult = await createVnpayUrl({
                  booking_id: bookingId,
                  method: selection.paymentMethod as any,
                  amount: currentFinalAmount,
                  orderInfo: `${t('payment.order_payment_info')} #${bookingId}`,
                  returnUrl: `${window.location.origin}/order/vnpay_return`
                });
              paymentUrl = vnpayResult?.paymentUrl || "";
            }

            if (paymentUrl) {
              setRealBookingData({
                booking_id: bookingId,
                paymentUrl: paymentUrl
              });
            } else {
              return;
            }
          } else if (!selection.paymentMethod) {
            return;
          }
        } catch (error) {
          return console.error("Error during booking/payment creation:", error);
        }
      } else {
        setCurrentStep(nextKey);
        setUnlockedStepIndex(prev => Math.max(prev, nextIdx));
      }
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
    "select-seat": selection.selectedSeats,
    "select-food": Object.entries(selection.selectedSnacks).map(([k, v]) => `${k}:${v}`)
  };

  const summaryDisplay = useMemo(() => [
    { label: t('booking.selection.selected_cinema'), val: selection.location },
    { label: t('booking.selection.selected_movie'), val: selection.movieTitle },
    {
      label: t('booking.selection.selected_showtime'),
      val: activeShowtime ? `${selection.showtimeDate} ${new Date(activeShowtime.startTime).toLocaleTimeString(t('locale_code'), { hour: '2-digit', minute: '2-digit' })}` : ""
    },
    {
      label: t('booking.steps.seat'),
      val: selection.selectedSeats.length > 0 ? selection.selectedSeats.join(", ") : ""
    },
    {
      label: t('booking.steps.food'),
      val: Object.values(selection.selectedSnacks).reduce((a, b) => a + b, 0) > 0
        ? `${Object.values(selection.selectedSnacks).reduce((a, b) => a + b, 0)} items`
        : ""
    }
  ], [t, selection.location, selection.movieTitle, selection.showtimeDate, activeShowtime, selection.selectedSeats, selection.selectedSnacks]);

  const selectProps = useMemo(() => {
    return summaryDisplay.slice(0, 3).map((s, idx) => {
      let key = "";
      if (idx === 0) key = "select-location";
      else if (idx === 1) key = "select-movie";
      else key = "select-showtime";

      return {
        key,
        label: s.label,
        state: s.val ? `- ${s.val}` : ""
      };
    });
  }, [summaryDisplay]);


  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD] dark:bg-[#050505]">
      {/* Step Navigation Header */}
      <div className="sticky top-0 z-30 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10">
        <div className="mx-auto px-6">
          <Tabs
            items={STEPS}
            variant="underlined"
            fullWidth
            selectedKey={currentStep}
            onSelectionChange={(k) => navigateToStep(String(k))}
            disabledKeys={STEPS.slice(unlockedStepIndex + 1).map(s => s.key)}
            classNames={{
              base: "w-full justify-center",
              tabList: "gap-4 md:gap-12 relative rounded-none border-none h-20 justify-center",
              cursor: "w-full bg-amber-500 h-[3px] rounded-full",
              tab: "max-w-fit h-20",
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
          <div className={cn(currentStep !== "select-service" && "hidden")}>
            <SelectServiceTab
              select={selectProps}
              showSelect={expandedSections}
              stateSelect={legacyStateSelect}
              locations={locations}
              cinemas={cinemas}
              nowShowingMovies={movies.filter(m => m.status === 0)}
              showtimes={showtimes}
              selectedCinema={cinemas.find(c => String(c.cinema_id) === selection.cinemaId)}
              isLoadingMovies={isFetchingMovies}
              isLoadingLocations={isFetchingLocations}
              isLoadingShowtimes={isLoadingShowtimes}
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
          </div>

          {selection.showtimeId && currentStep !== "select-service" && (
            <div className={cn(currentStep !== "select-seat" && "hidden")}>
              <SelectSeatTab
                selectedSeatCodes={selection.selectedSeats}
                activeShowtimeId={selection.showtimeId}
                seats={seats}
                showtimeOptions={filteredShowtimes.map(st => ({
                  id: st.showtime_id,
                  label: new Date(st.startTime).toLocaleTimeString(t('locale_code'), { hour: '2-digit', minute: '2-digit' }),
                }))}
                onSelectSeats={(s) => handleSelectionChange('selectedSeats', s)}
                onSelectShowtime={(id) => handleSelectionChange('showtimeId', id)}
              />
            </div>
          )}

          {unlockedStepIndex >= 2 && (
            <div className={cn(currentStep !== "select-food" && "hidden")}>
              <SelectFoodTab
                snacks={snacks}
                selectedSnacks={selection.selectedSnacks}
                isLoading={isFetchingSnacks}
                onUpdateQuantity={handleSnackQuantityChange}
              />
            </div>
          )}

          {unlockedStepIndex >= 3 && (
            <div className={cn(currentStep !== "confirmation" && "hidden")}>
              <ConfirmationTab
                movieTitle={selection.movieTitle}
                cinemaName={cinemas.find(c => String(c.cinema_id) === selection.cinemaId)?.name || ""}
                showtimeDate={selection.showtimeDate}
                showtimeTime={activeShowtime ? new Date(activeShowtime.startTime).toLocaleTimeString(t('locale_code'), { hour: '2-digit', minute: '2-digit' }) : ""}
                selectedSeats={selection.selectedSeats}
                selectedSnacks={selection.selectedSnacks}
                snacks={snacks}
                subtotal={subtotal}
                discountAmount={discountAmount}
                finalTotal={finalTotal}
                selectedMethod={selection.paymentMethod}
                onSelectMethod={(m) => setSelection(prev => ({ ...prev, paymentMethod: m }))}
                couponCode={couponCode}
                onCouponChange={setCouponCode}
                onApplyCoupon={handleApplyCoupon}
                activeCoupon={activeCoupon}
                couponError={couponError}
              />
            </div>
          )}

          {unlockedStepIndex >= 4 && (
            <div className={cn(currentStep !== "payment" && "hidden")}>
              <SelectPaymentTab
                selectedMethod={selection.paymentMethod}
                onSelectMethod={(m) => setSelection(prev => ({ ...prev, paymentMethod: m }))}
                activeCoupon={activeCoupon}
                subtotal={subtotal}
                orderCode={realBookingData?.booking_id.toString()}
                paymentUrl={realBookingData?.paymentUrl}
                onBack={() => navigateToStep('confirmation')}
              />
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
                            {selection.showtimeDate} • {new Date(activeShowtime.startTime).toLocaleTimeString(t('locale_code'), { hour: '2-digit', minute: '2-digit' })}
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

                {Object.entries(selection.selectedSnacks).some(([id, qty]) => qty > 0) && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{t('booking.steps.food')}</p>
                    <div className="space-y-2">
                      {Object.entries(selection.selectedSnacks).map(([id, qty]) => {
                        if (qty === 0) return null;
                        const snack = snacks.find(s => s.snack_id === parseInt(id));
                        return (
                          <div key={id} className="flex justify-between items-center text-xs font-bold">
                            <span className="text-zinc-600 dark:text-zinc-300 italic">{snack?.name}</span>
                            <span className="text-amber-500 font-black">x{qty}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-end pt-4 border-t border-zinc-100 dark:border-white/5">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">{t('booking.sidebar.total')}</span>
                  <span className="text-2xl font-black text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                    {finalTotal.toLocaleString()} <span className="text-sm">{t('common.currency_vnd')}</span>
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
                onClick={currentStep === "payment" ? () => realBookingData?.paymentUrl && (window.location.href = realBookingData.paymentUrl) : nextStep}
                isDisabled={!canProceed || isCreatingBooking || isCreatingVnpay || isCreatingMomo}
                isLoading={isCreatingBooking || isCreatingVnpay || isCreatingMomo}
                className={cn(
                  "flex gap-2 items-center justify-center px-4 py-2 rounded-sm font-bold text-sm transition-all shadow-xl min-w-30",
                  canProceed
                    ? "bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.4)] hover:-translate-y-1"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                )}
                endContent={currentStep === "payment" ? <BadgeCheck size={18} /> : <ChevronRight size={18} />}
              >
                {currentStep === "payment" 
                  ? t('payment_tab.finish_button')
                  : t('booking.buttons.next')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}