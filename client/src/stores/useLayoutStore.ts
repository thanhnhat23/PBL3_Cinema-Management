import { create } from 'zustand';

interface LayoutStore {
    openLayout: 
        'Thống kê' 
        | 'Phim' 
        | 'Vé' 
        | 'Suất chiếu' 
        | 'Rạp chiếu' 
        | 'Người dùng'
        | 'Đồng bộ dữ liệu'
        | 'Thống kê doanh thu'
        | 'Thức ăn'
        | null;

    setOpenLayout: (layout: 
        'Thống kê' 
        | 'Phim' 
        | 'Vé' 
        | 'Suất chiếu' 
        | 'Rạp chiếu'  
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