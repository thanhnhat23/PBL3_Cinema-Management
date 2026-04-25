import { showtimeHours } from "./showtime-options";

type SelectSeatTabProps = {
    selectedSeats: string[];
    selectedShowtime: string;
    onSelectSeats: (seats: string[]) => void;
    onSelectShowtime: (time: string) => void;
};

const rows = ["G", "F", "E", "D", "C", "B", "A"];
const rightSeats = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
const soldSeatMap: Record<string, boolean> = {
    A1: true,
    B5: true,
    C8: true,
    D3: true,
    E10: true,
    F2: true,
    G9: true,
};
const soldSeatImage = "https://i.pinimg.com/1200x/11/c0/1e/11c01ea0714ce8ab63afa0a8a6688e16.jpg";

export function SelectSeatTab({
    selectedSeats,
    selectedShowtime,
    onSelectSeats,
    onSelectShowtime,
}: SelectSeatTabProps) {

    const toggleSeat = (seatCode: string) => {
        if (soldSeatMap[seatCode]) {
            return;
        }

        const hasSeat = selectedSeats.includes(seatCode);
        if (hasSeat) {
            onSelectSeats(selectedSeats.filter((seat) => seat !== seatCode));
            return;
        }

        onSelectSeats([...selectedSeats, seatCode]);
    };

    const renderSeat = (row: string, seatNumber: number) => {
        const seatCode = `${row}${seatNumber}`;
        const isSold = Boolean(soldSeatMap[seatCode]);
        const isSelected = selectedSeats.includes(seatCode);

        return (
            <button
                key={seatCode}
                type="button"
                onClick={() => toggleSeat(seatCode)}
                disabled={isSold}
                className={`h-7 w-7 rounded-sm border text-xs transition-colors duration-150 ${
                    isSold
                        ? "cursor-not-allowed border-neutral-300 bg-center bg-cover bg-no-repeat text-transparent"
                        : isSelected
                          ? "border-fuchsia-500 bg-fuchsia-500"
                          : "cursor-pointer border-neutral-300 hover:border-blue-500"
                }`}
                style={isSold ? { backgroundImage: `url(${soldSeatImage})` } : undefined}
                aria-pressed={isSelected}
                aria-label={`Ghế ${seatCode}`}
            >
                {seatNumber}
            </button>
        );
    };

    const renderCoupleSeat = (row: string) => {
        const coupleSeatCodes = [`${row}11`, `${row}12`];
        const isSold = coupleSeatCodes.some((seatCode) => Boolean(soldSeatMap[seatCode]));
        const isSelected = coupleSeatCodes.every((seatCode) => selectedSeats.includes(seatCode));

        const toggleCoupleSeat = () => {
            if (isSold) {
                return;
            }

            if (isSelected) {
                onSelectSeats(selectedSeats.filter((seat) => !coupleSeatCodes.includes(seat)));
                return;
            }

            const nextSeats = Array.from(new Set([...selectedSeats, ...coupleSeatCodes]));
            onSelectSeats(nextSeats);
        };

        return (
            <button
                key={`${row}-couple-seat`}
                type="button"
                onClick={toggleCoupleSeat}
                disabled={isSold}
                className={`h-7 w-14 rounded-md border text-xs transition-colors duration-150 ${
                    isSold
                        ? "cursor-not-allowed border-neutral-300 bg-center bg-cover bg-no-repeat text-transparent"
                        : isSelected
                          ? "border-fuchsia-500 bg-fuchsia-500"
                          : "cursor-pointer border-blue-700 hover:border-blue-500"
                }`}
                style={isSold ? { backgroundImage: `url(${soldSeatImage})` } : undefined}
                aria-pressed={isSelected}
                aria-label={`Ghế đôi ${row}11-${row}12`}
            >
                11 - 12
            </button>
        );
    };

    return (
        <div className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-xs border-1 border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center gap-4 px-4 py-5 border-b border-neutral-200 dark:border-neutral-800">
                <p className="text-base font-medium text-neutral-700 dark:text-neutral-300">Đổi suất chiếu</p>
                <div className="flex gap-3">
                    {showtimeHours.map((time) => {
                        const isActive = selectedShowtime === time;

                        return (
                            <button
                                key={time}
                                type="button"
                                onClick={() => onSelectShowtime(time)}
                                aria-pressed={isActive}
                                className={`px-4 py-2 text-base font-light rounded-sm border cursor-pointer shadow-sm transition-all duration-200 ${
                                    isActive
                                        ? "bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 ring-1 ring-neutral-500/40"
                                        : "bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                                }`}
                            >
                                {time}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="px-4 py-6">
                <div className="max-h-90 overflow-y-auto pr-2">
                    <div className="min-w-180">
                        {rows.map((row) => (
                            <div key={row} className="mb-4 flex items-center justify-between gap-4">
                                <span className="w-4 text-sm text-neutral-600 dark:text-neutral-300">{row}</span>

                                <div className="flex items-center gap-12">
                                    <div className="flex items-center gap-2">{renderCoupleSeat(row)}</div>

                                    <div className="flex items-center gap-2">
                                        {rightSeats.map((seatNumber) => renderSeat(row, seatNumber))}
                                    </div>
                                </div>

                                <span className="w-4 text-sm text-neutral-600 dark:text-neutral-300">{row}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="mt-8 text-center text-xl font-semibold tracking-wide text-neutral-300 dark:text-neutral-700">
                    Màn hình
                </p>
                <div className="mt-3 h-1.5 w-full rounded-full bg-neutral-300" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 px-4 py-5 dark:border-neutral-800">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                        <span
                            className="h-5 w-5 rounded-sm border border-neutral-300 bg-center bg-cover bg-no-repeat"
                            style={{ backgroundImage: `url(${soldSeatImage})` }}
                        />
                        Ghế đã bán
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                        <span className="h-5 w-5 rounded-sm border border-fuchsia-500 bg-fuchsia-500" />
                        Ghế đang chọn
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                        <span className="h-5 w-5 rounded-sm border border-neutral-300 bg-transparent" />
                        Ghế đơn
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                        <span className="h-5 w-12 rounded-md border border-blue-700 bg-transparent" />
                        Ghế đôi
                    </div>
                </div>
            </div>
        </div>
    );
}
