import { useMemo, useState, useEffect, useRef } from "react";
import type { Seat } from "@/stores/useSeatStore";
import { Monitor, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { useAuthStore } from "@/stores/useAuthStore";
import { addToast } from "@heroui/toast";
import { SIGNALR_HUB_URL } from "@/lib/config";

interface SelectSeatTabProps {
  selectedSeatCodes: string[];
  activeShowtimeId: string;
  seats: Seat[];
  onSelectSeats: (newSelection: string[]) => void;
  onSelectShowtime: (showtimeId: string) => void;
  showtimeOptions?: Array<{ id: number; label: string }>;
}

const SOLD_SEAT_ICON = "https://i.pinimg.com/1200x/11/c0/1e/11c01ea0714ce8ab63afa0a8a6688e16.jpg";

enum SeatStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  OCCUPIED = 'occupied'
}

export function SelectSeatTab({
  selectedSeatCodes,
  activeShowtimeId,
  seats,
  onSelectSeats,
  onSelectShowtime,
  showtimeOptions = [],
}: SelectSeatTabProps) {
  const { t } = useTranslation();
  const authUser = useAuthStore(state => state.authUser);

  const [lockedSeats, setLockedSeats] = useState<Record<number, { userId: string; expiresAt: string }>>({});
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const seatsRef = useRef(seats);
  const selectedSeatCodesRef = useRef(selectedSeatCodes);
  const onSelectSeatsRef = useRef(onSelectSeats);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    seatsRef.current = seats;
    selectedSeatCodesRef.current = selectedSeatCodes;
    onSelectSeatsRef.current = onSelectSeats;
  }, [seats, selectedSeatCodes, onSelectSeats]);

  useEffect(() => {
    if (!activeShowtimeId) return;

    let isMounted = true;

    const newConnection = new HubConnectionBuilder()
      .withUrl(SIGNALR_HUB_URL)
      .configureLogging(LogLevel.None)
      .withAutomaticReconnect()
      .build();

    newConnection.on("CurrentLockedSeats", (lockedList: Array<{ showtimeId: number; seatId: number; userId: string; expiresAt: string }>) => {
      if (!isMounted) return;
      const locksMap: Record<number, { userId: string; expiresAt: string }> = {};
      lockedList.forEach(item => {
        locksMap[item.seatId] = { userId: item.userId, expiresAt: item.expiresAt };
      });
      setLockedSeats(locksMap);
    });

    newConnection.on("SeatLocked", (item: { showtimeId: number; seatId: number; userId: string; expiresAt: string }) => {
      if (!isMounted) return;
      setLockedSeats(prev => ({
        ...prev,
        [item.seatId]: { userId: item.userId, expiresAt: item.expiresAt }
      }));
    });

    newConnection.on("SeatUnlocked", (item: { showtimeId: number; seatId: number }) => {
      if (!isMounted) return;
      setLockedSeats(prev => {
        const next = { ...prev };
        delete next[item.seatId];
        return next;
      });

      // If it was locked by us and is still in our selection, we deselect it locally
      const seat = seatsRef.current.find(s => s.seat_id === item.seatId);
      if (seat) {
        const seatCode = `${String.fromCharCode(65 + seat.row)}${seat.column}`;
        if (selectedSeatCodesRef.current.includes(seatCode)) {
          onSelectSeatsRef.current(selectedSeatCodesRef.current.filter(code => code !== seatCode));
          addToast({
            title: t('booking.seat_tab.lock_expired_title'),
            description: t('booking.seat_tab.lock_expired_desc', { seatCode }),
            color: "warning",
            variant: "flat"
          });
        }
      }
    });

    newConnection.on("LockResult", (res: { success: boolean; showtimeId: number; seatId: number; message: string }) => {
      if (!isMounted) return;
      if (res.success) {
        const seat = seatsRef.current.find(s => s.seat_id === res.seatId);
        if (seat) {
          const seatCode = `${String.fromCharCode(65 + seat.row)}${seat.column}`;
          if (!selectedSeatCodesRef.current.includes(seatCode)) {
            onSelectSeatsRef.current([...selectedSeatCodesRef.current, seatCode]);
          }
        }
      } else {
        addToast({
          title: t('common.error'),
          description: t('booking.seat_tab.already_locked'),
          color: "danger",
          variant: "flat"
        });
      }
    });

    newConnection.on("UnlockResult", (res: { success: boolean; showtimeId: number; seatId: number; message: string }) => {
      if (!isMounted) return;
      if (res.success) {
        const seat = seatsRef.current.find(s => s.seat_id === res.seatId);
        if (seat) {
          const seatCode = `${String.fromCharCode(65 + seat.row)}${seat.column}`;
          onSelectSeatsRef.current(selectedSeatCodesRef.current.filter(code => code !== seatCode));
        }
      }
    });

    const startConnection = async () => {
      try {
        await newConnection.start();
        if (!isMounted) {
          newConnection.stop().catch(() => {});
          return;
        }
        console.log("SignalR connected to SeatLockHub");
        connectionRef.current = newConnection;
        setConnection(newConnection);

        // Join showtime group
        if (newConnection.state === HubConnectionState.Connected) {
          await newConnection.invoke("JoinShowtimeGroup", parseInt(activeShowtimeId, 10));
        }
      } catch (err: any) {
        if (isMounted) {
          if (err?.toString().includes("stopped during negotiation")) {
            console.log("SignalR connection aborted during negotiation due to component unmount.");
          } else {
            console.error("SignalR Connection Error: ", err);
          }
        }
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      if (newConnection) {
        if (newConnection.state === HubConnectionState.Connected) {
          newConnection.invoke("LeaveShowtimeGroup", parseInt(activeShowtimeId, 10))
            .then(() => newConnection.stop())
            .catch(err => console.error("Error leaving SignalR group/stopping connection: ", err));
        } else {
          newConnection.stop()
            .catch(err => console.error("Error stopping connection: ", err));
        }
      }
    };
  }, [activeShowtimeId, t]);

  const layoutData = useMemo(() => {
    if (!seats.length) {
      return { rowLabels: [], columnIndices: [], seatMap: new Map<string, Seat>() };
    }

    const seatMap = new Map<string, Seat>();
    const uniqueRowsSet = new Set<number>();
    const uniqueColsSet = new Set<number>();

    seats.forEach(seat => {
      const seatCode = `${String.fromCharCode(65 + seat.row)}${seat.column}`;
      seatMap.set(seatCode, seat);
      uniqueRowsSet.add(seat.row);
      uniqueColsSet.add(seat.column);
    });

    const rowLabels = Array.from(uniqueRowsSet)
      .sort((a, b) => b - a)
      .map(r => String.fromCharCode(65 + r));
      
    const columnIndices = Array.from(uniqueColsSet).sort((a, b) => a - b);

    return { rowLabels, columnIndices, seatMap };
  }, [seats]);

  const { rowLabels, columnIndices, seatMap } = layoutData;

  const handleSeatClick = (seatCode: string, isWide = false) => {
    const conn = connectionRef.current;
    if (!conn || conn.state !== HubConnectionState.Connected) {
      addToast({
        title: t('common.error') || "Lỗi kết nối",
        description: t('booking.seat_tab.not_connected') || "Kết nối máy chủ bị gián đoạn. Vui lòng thử lại sau giây lát!",
        color: "danger",
        variant: "flat"
      });
      return;
    }

    if (isWide) {
        const row = seatCode.charAt(0);
        const col = parseInt(seatCode.substring(1));
        const prevCol = col - 1;
        const code1 = `${row}${prevCol}`;
        const code2 = `${row}${col}`;
        
        const s1 = seatMap.get(code1);
        const s2 = seatMap.get(code2);
        if (!s1 || !s2) return;
        
        const isSold1 = s1.status !== SeatStatus.AVAILABLE || (lockedSeats[s1.seat_id] && lockedSeats[s1.seat_id].userId !== authUser?.id);
        const isSold2 = s2.status !== SeatStatus.AVAILABLE || (lockedSeats[s2.seat_id] && lockedSeats[s2.seat_id].userId !== authUser?.id);
        if (isSold1 || isSold2) return;
        
        const isAlreadySelected = selectedSeatCodes.includes(code1) || selectedSeatCodes.includes(code2);
        if (isAlreadySelected) {
            conn.invoke("UnlockSeat", parseInt(activeShowtimeId, 10), s1.seat_id, authUser?.id || "");
            conn.invoke("UnlockSeat", parseInt(activeShowtimeId, 10), s2.seat_id, authUser?.id || "");
        } else {
            conn.invoke("LockSeat", parseInt(activeShowtimeId, 10), s1.seat_id, authUser?.id || "");
            conn.invoke("LockSeat", parseInt(activeShowtimeId, 10), s2.seat_id, authUser?.id || "");
        }
    } else {
        const targetSeat = seatMap.get(seatCode);
        if (!targetSeat) return;

        const isLockedByOthers = targetSeat.status === SeatStatus.RESERVED || targetSeat.status === SeatStatus.OCCUPIED || (lockedSeats[targetSeat.seat_id] && lockedSeats[targetSeat.seat_id].userId !== authUser?.id);
        if (isLockedByOthers) return;

        const isAlreadySelected = selectedSeatCodes.includes(seatCode);
        if (isAlreadySelected) {
            conn.invoke("UnlockSeat", parseInt(activeShowtimeId, 10), targetSeat.seat_id, authUser?.id || "");
        } else {
            conn.invoke("LockSeat", parseInt(activeShowtimeId, 10), targetSeat.seat_id, authUser?.id || "");
        }
    }
  };

  const renderSeatIcon = (row: string, col: number, isWide = false) => {
    const seatCode = `${row}${col}`;
    const seatData = seatMap.get(seatCode);
    
    if (!seatData) return <div key={seatCode} className={isWide ? "w-16 h-8" : "w-8 h-8"} />;

    let isSold = seatData.status === SeatStatus.RESERVED || seatData.status === SeatStatus.OCCUPIED;
    const isLockedByOthers = lockedSeats[seatData.seat_id] && lockedSeats[seatData.seat_id].userId !== authUser?.id;
    if (isLockedByOthers) {
        isSold = true;
    }

    let isSelected = selectedSeatCodes.includes(seatCode);
    
    if (isWide) {
        const prevCol = col - 1;
        const prevSeatCode = `${row}${prevCol}`;
        const prevSeatData = seatMap.get(prevSeatCode);
        if (prevSeatData) {
            const prevLockedByOthers = lockedSeats[prevSeatData.seat_id] && lockedSeats[prevSeatData.seat_id].userId !== authUser?.id;
            isSold = isSold || prevSeatData.status === SeatStatus.RESERVED || prevSeatData.status === SeatStatus.OCCUPIED || prevLockedByOthers;
            isSelected = isSelected || selectedSeatCodes.includes(prevSeatCode);
        }
    }

    return (
      <button
        key={seatCode}
        type="button"
        onClick={() => handleSeatClick(seatCode, isWide)}
        disabled={isSold}
        className={cn(
          "h-8 transition-all duration-300 rounded-sm border text-[10px] font-black uppercase flex items-center justify-center relative group",
          isWide ? "w-16" : "w-8",
          isSold 
            ? "cursor-not-allowed border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 opacity-20 grayscale" 
            : isSelected
              ? "border-amber-500 bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-110 z-10"
              : "cursor-pointer border-zinc-300 dark:border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 text-zinc-500 dark:text-zinc-400"
        )}
        aria-label={`Seat ${seatCode}`}
      >
        {isSold ? (
            <div className="absolute inset-0 bg-center bg-cover rounded-sm" style={{ backgroundImage: `url(${SOLD_SEAT_ICON})` }} />
        ) : (
            <span className="relative z-10">{isWide ? `${col-1}-${col}` : col}</span>
        )}
      </button>
    );
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-sm border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden">
      {/* Showtime Switcher Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 px-8 py-6 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5">
        <div className="flex items-center gap-2">
            <Monitor size={16} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{t('booking.seat_tab.change_showtime')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {showtimeOptions.map((showtime) => (
            <button
              key={showtime.id}
              type="button"
              onClick={() => onSelectShowtime(String(showtime.id))}
              className={cn(
                "px-5 py-2 text-xs font-bold rounded-sm border transition-all duration-300",
                activeShowtimeId === String(showtime.id)
                  ? "bg-amber-500 border-amber-500 text-white shadow-lg"
                  : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-500 hover:border-amber-500/50"
              )}
            >
              {showtime.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Seat Grid */}
      <div className="p-8 md:p-12">
        <div className="overflow-x-auto pb-8 custom-scrollbar">
          <div className="min-w-fit mx-auto px-4">
            {rowLabels.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                    <Info size={32} />
                  </div>
                  <p className="text-zinc-500 font-medium italic">{t('booking.seat_tab.no_seat_info')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rowLabels.map((row) => {
                  const processedCols = new Set<number>();
                  return (
                    <div key={row} className="flex items-center justify-center gap-6">
                      <span className="w-8 text-center text-xs font-black text-zinc-300 dark:text-zinc-600">{row}</span>
                      
                      <div className="flex items-center gap-2">
                        {columnIndices.map(col => {
                          if (processedCols.has(col)) return null;

                          const seat = seatMap.get(`${row}${col}`);
                          if (!seat) return <div key={`${row}${col}`} className="w-8 h-8" />;

                          // Check if this is a Couple seat and can be paired with next consecutive column
                          if (seat.type_id === 2) {
                            const nextCol = col + 1;
                            const nextSeat = seatMap.get(`${row}${nextCol}`);
                            if (nextSeat && nextSeat.type_id === 2) {
                              processedCols.add(col);
                              processedCols.add(nextCol);
                              return renderSeatIcon(row, nextCol, true);
                            }
                          }

                          processedCols.add(col);
                          return renderSeatIcon(row, col, false);
                        })}
                      </div>

                      <span className="w-8 text-center text-xs font-black text-zinc-300 dark:text-zinc-600">{row}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* Screen Visualization */}
        <div className="relative mt-20">
          <p className="pb-4 text-center text-[10px] font-black uppercase tracking-[1em] text-zinc-400 opacity-50">{t('booking.seat_tab.screen')}</p>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-2 bg-amber-500/20 blur-xl" />
          <div className="h-1 w-[70%] mx-auto bg-linear-to-r from-transparent via-amber-500 to-transparent rounded-full opacity-50 shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 pt-10 border-t border-zinc-100 dark:border-white/5">
            <LegendItem color="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-white/10" label={t('booking.seat_tab.legend.single')} />
            <LegendItem color="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-white/10 w-8" label={t('booking.seat_tab.legend.double')} />
            <LegendItem color="bg-amber-500 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]" label={t('booking.seat_tab.legend.selecting')} />
            <LegendItem color="bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 opacity-30" label={t('booking.seat_tab.legend.sold')} />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("h-4 w-4 rounded-xs border", color)} />
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</span>
    </div>
  );
}
