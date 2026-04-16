import { create } from 'zustand';

interface LayoutStore {
    openLayout: 
        'Thống kê' 
        | 'Phim' 
        | 'Phòng' 
        | 'Vé' 
        | 'Suất chiếu' 
        | 'Rạp chiếu' 
        | 'Khuyến mãi' 
        | 'Diễn viên'
        | 'Review' 
        | 'Người dùng'
        | 'Đồng bộ dữ liệu'
        | 'Thống kê doanh thu'
        | 'Thức ăn'
        | null;

    setOpenLayout: (layout: 
        'Thống kê' 
        | 'Phim' 
        | 'Phòng' 
        | 'Vé' 
        | 'Suất chiếu' 
        | 'Rạp chiếu' 
        | 'Khuyến mãi' 
        | 'Diễn viên'
        | 'Review' 
        | 'Người dùng'
        | 'Đồng bộ dữ liệu'
        | 'Thống kê doanh thu'
        | 'Thức ăn'
        | null) => void;
}

export const useLayoutStore = create<LayoutStore>((set) => ({
    openLayout: 'Thống kê',
    setOpenLayout: (layout) => set({ openLayout: layout }),
}));