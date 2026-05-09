import { create } from 'zustand';
import { _axios } from '@/lib/axios';

export interface Seat {
    seat_id: number;
    room_id: number;
    row: number;
    column: number;
    status: 'available' | 'reserved' | 'occupied';
    price: number;
    type_id: number;
}

const mapSeatStatus = (status: string): 'available' | 'reserved' | 'occupied' => {
    const normalized = status.toLowerCase();
    if (normalized === 'reserved') return 'reserved';
    if (normalized === 'occupied') return 'occupied';
    return 'available';
}

export const useSeatStore = create<{
    seats: Seat[];
    selectedSeat: Seat | null;

    isFetchingSeats: boolean;

    fetchSeatsOnRoom: (roomId: number) => Promise<void>;
    fetchSeatsForShowtime: (showtimeId: number) => Promise<void>;

}>((set) => ({
    seats: [],
    selectedSeat: null,
    isFetchingSeats: false,

    fetchSeatsOnRoom: async (roomId: number) => {
        set({ isFetchingSeats: true });
        try {
            const response = await _axios.get(`/v1/room/get/${roomId}`);

            const roomData = response.data;
            // Be defensive about API shape. Accept multiple possible payloads.
            const seatsSource = Array.isArray(roomData?.seats)
                ? roomData.seats
                : Array.isArray(roomData?.data?.seats)
                ? roomData.data.seats
                : Array.isArray(roomData?.room?.seats)
                ? roomData.room.seats
                : [];

            const mappedSeats: Seat[] = seatsSource.map((seat: any) => ({
                seat_id: seat.seat_id,
                room_id: seat.room_id,
                row: (seat.row_index ?? seat.row ?? 1) - 1,
                column: seat.column_index ?? seat.column ?? 1,
                status: mapSeatStatus(seat.status),
                type_id: seat.type_id ?? 1,
                price: 0
            }));

            set({ seats: mappedSeats });
        } catch (error) {
            console.error('Error fetching seats:', error);
        } finally {
            set({ isFetchingSeats: false });
        }
    },

    fetchSeatsForShowtime: async (showtimeId: number) => {
        set({ isFetchingSeats: true });
        try {
            const response = await _axios.get(`/v1/showtime/get/${showtimeId}`);
            const st = response.data;

            // st.ShowTimeSeats is expected to be an array
            const sts = Array.isArray(st?.showTimeSeats) || Array.isArray(st?.ShowTimeSeats) ? (st.showTimeSeats ?? st.ShowTimeSeats) : [];

            const mappedSeats: Seat[] = sts.map((stsItem: any) => {
                const seatObj = stsItem.Seat ?? stsItem.seat ?? stsItem;

                const rowIndex = seatObj?.row_index ?? seatObj?.row ?? 1;
                const colIndex = seatObj?.column_index ?? seatObj?.column ?? 1;

                const statusRaw = stsItem.status ?? stsItem.Status ?? 0;
                const statusStr = typeof statusRaw === 'string' ? statusRaw : (statusRaw === 0 ? 'available' : statusRaw === 1 ? 'reserved' : 'occupied');

                return {
                    seat_id: seatObj?.seat_id ?? stsItem.seat_id ?? 0,
                    room_id: seatObj?.room_id ?? stsItem.room_id ?? st?.room_id ?? 0,
                    row: (rowIndex ?? 1) - 1,
                    column: colIndex ?? 1,
                    status: statusStr as 'available' | 'reserved' | 'occupied',
                    price: stsItem.price ?? stsItem.Price ?? 0,
                    type_id: seatObj?.type_id ?? stsItem.type_id ?? 1,
                };
            });

            set({ seats: mappedSeats });
        } catch (error) {
            console.error('Error fetching seats for showtime:', error);
        } finally {
            set({ isFetchingSeats: false });
        }
    },
}));