import { useMemo } from "react";
import type { Seat } from "@/stores/useSeatStore";
import { Monitor, Info } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const handleSeatClick = (seatCode: string) => {
    const targetSeat = seatMap.get(seatCode);
    if (!targetSeat) return;

    const isLocked = targetSeat.status === SeatStatus.RESERVED || targetSeat.status === SeatStatus.OCCUPIED;
    if (isLocked) return;

    const isAlreadySelected = selectedSeatCodes.includes(seatCode);
    const updatedSelection = isAlreadySelected
      ? selectedSeatCodes.filter(code => code !== seatCode)
      : [...selectedSeatCodes, seatCode];

    onSelectSeats(updatedSelection);
  };

  const renderSeatIcon = (row: string, col: number, isWide = false) => {
    const seatCode = `${row}${col}`;
    const seatData = seatMap.get(seatCode);
    
    if (!seatData) return <div key={seatCode} className={isWide ? "w-16 h-8" : "w-8 h-8"} />;

    const isSold = seatData.status === SeatStatus.RESERVED || seatData.status === SeatStatus.OCCUPIED;
    const isSelected = selectedSeatCodes.includes(seatCode);

    return (
      <button
        key={seatCode}
        type="button"
        onClick={() => handleSeatClick(seatCode)}
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
            <div className="absolute inset-0 bg-center bg-cover opacity-30" style={{ backgroundImage: `url(${SOLD_SEAT_ICON})` }} />
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
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Đổi suất chiếu</span>
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
                  <p className="text-zinc-500 font-medium italic">Không tìm thấy thông tin sơ đồ ghế</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rowLabels.map((row) => (
                  <div key={row} className="flex items-center justify-center gap-6">
                    <span className="w-8 text-center text-xs font-black text-zinc-300 dark:text-zinc-600">{row}</span>
                    
                    <div className="flex items-center gap-12">
                      <div className="flex gap-2 flex-row-reverse">
                        {columnIndices
                          .filter(col => col > 2) 
                          .map(col => renderSeatIcon(row, col))}
                      </div>

                      <div className="flex items-center gap-2">
                          {seatMap.has(`${row}1`) && seatMap.has(`${row}2`) && renderSeatIcon(row, 2, true)}
                      </div>
                    </div>

                    <span className="w-8 text-center text-xs font-black text-zinc-300 dark:text-zinc-600">{row}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Screen Visualization */}
        <div className="relative mt-20">
          <p className="pb-4 text-center text-[10px] font-black uppercase tracking-[1em] text-zinc-400 opacity-50">Màn hình</p>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-2 bg-amber-500/20 blur-xl" />
          <div className="h-1 w-[70%] mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full opacity-50 shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 pt-10 border-t border-zinc-100 dark:border-white/5">
            <LegendItem color="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-white/10" label="Ghế đơn" />
            <LegendItem color="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-white/10 w-8" label="Ghế đôi" />
            <LegendItem color="bg-amber-500 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]" label="Đang chọn" />
            <LegendItem color="bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 opacity-30" label="Đã bán" />
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
