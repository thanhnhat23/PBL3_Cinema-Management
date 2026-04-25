import { 
    CloudSync, 
    Play, 
    Pause, 
    Settings, 
    MessageCircle, 
    Flame, 
    TrendingUp, 
    Film
} from "lucide-react";
import { useSyncDateStore } from "@/stores/useSyncDataStore"; 
import { useState } from "react";

export default function LayoutSyncData() {
    const [activeSyncName, setActiveSyncName] = useState<string | null>(null);
    const { 
        syncMovie,
        syncStatusMovie, 
        syncReviewMovie, 
        stopSync,
        isSyncingMovie, 
        isSyncingReviewMovie, 
        isSyncingStatusMovie 
    } = useSyncDateStore();

    const getSyncStatus = (name: string) => {
        if (name.includes("phim")) return { loading: isSyncingMovie, type: 'movie' as const };
        if (name.includes("đánh giá")) return { loading: isSyncingReviewMovie, type: 'review' as const };
        return { loading: isSyncingStatusMovie, type: 'status' as const };
    };

    const handleSyncData = (name: string) => async () => {
        const { loading, type } = getSyncStatus(name);

        if (loading) {
            stopSync(type);
            return;
        }

        try {
            setActiveSyncName(name);
            if (name === "Đồng bộ phim sắp chiếu") await syncMovie("upcoming");
            else if (name === "Đồng bộ phim đang chiếu") await syncMovie("nowplaying");
            else if (name === "Đồng bộ phim phổ biến") await syncMovie("popular");
            else if (name === "Đồng bộ đánh giá phim") await syncReviewMovie();
            else await syncStatusMovie();
        } catch (error) {
            console.log('Error syncing data:', error);
        } finally {
            setActiveSyncName(null); // Xong thì reset
        }
    }

    const setting = [
        {
            name: "Đồng bộ phim sắp chiếu",
            icon: <TrendingUp size={16} />
        },
        {
            name: "Đồng bộ phim đang chiếu",
            icon: <Film size={16} />
        },
        {
            name: "Đồng bộ phim phổ biến",
            icon: <Flame size={16} />
        },
        {
            name: "Đồng bộ đánh giá phim",
            icon: <MessageCircle size={16} />
        },
        {
            name: "Cập nhật trạng thái thủ công",   
            icon: <Settings size={16} />
        }
    ]

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-2xl font-bold flex items-center gap-2 mb-8">
                <CloudSync />
                Dashboard: Đồng bộ dữ liệu API
            </h1>

            {setting.map((item, index) => {
                const { loading } = getSyncStatus(item.name);
                const isThisItemLoading = loading && activeSyncName === item.name;

                return (
                    <div
                        key={index} 
                        className="flex items-center gap-2"
                    >
                        <div className="w-96 px-4 py-2 border-1 border-neutral-200 dark:border-neutral-800 rounded-md bg-sidebar">
                            <p className="text-lg font-semibold flex gap-2 items-center justify-start">
                                {item.icon}
                                {item.name}
                            </p>
                        </div>

                        <div className="w-56 flex justify-center">
                            <button 
                                onClick={handleSyncData(item.name)}
                                className={`py-2 px-4 rounded-lg flex items-center justify-center cursor-pointer text-white shadow-sm ${
                                    !isThisItemLoading ? "bg-green-500 hover:bg-green-400 hover:dark:bg-green-600" : "bg-red-500 hover:bg-red-400 hover:dark:bg-red-600"
                                }`}
                            >
                                {!isThisItemLoading ? 
                                    <>
                                        <Play size={16} />
                                        <span className="ml-2">Đồng bộ</span> 
                                    </>
                                :
                                    <>
                                        <Pause size={16} />
                                        <span className="ml-2">Ngừng</span> 
                                    </>
                                }
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}
