export default function Loading() {
  return (
    <div className="p-6 space-y-8 animate-pulse">
      {/* Giả lập Tiêu đề trang */}
      <div className="h-8 bg-slate-200 rounded-md w-1/4 mb-4"></div>
      
      {/* Giả lập một lưới danh sách phim (Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            {/* Giả lập Poster phim */}
            <div className="h-64 bg-slate-200 rounded-xl w-full"></div>
            {/* Giả lập Tên phim */}
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            {/* Giả lập Thông tin thêm */}
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}