"use client";

import Image from "next/image";
import { useCinemaStore } from "@/stores/useCinemaStore";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { GoogleMapView } from "@/components/ui/google-map";
import DetailPageSkeleton from "@/components/skeletons/detailPage";
import { BlurFade } from "@/components/ui/effects/blur-fade";

export default function CinemasPage() {
  const { selectedCinema, isFetchingCinemaDetails, fetchCinemaById } = useCinemaStore();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    if (id) {
      fetchCinemaById(Number(id));
    }
  }, [id, fetchCinemaById]);

  if (isFetchingCinemaDetails || !selectedCinema) {
    return <DetailPageSkeleton />;
  }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Immersive Cinema Backdrop */}
            <div className="relative w-full h-[70vh] md:h-[65vh] overflow-hidden">
                <div className="absolute inset-0 z-10 bg-linear-to-t from-background via-background/20 to-transparent" />
                <div className="absolute inset-0 z-10 bg-linear-to-r from-white/40 via-transparent to-white/40 dark:from-black/60 dark:to-black/60" />
                <Image
                    src={selectedCinema?.image_overview ?? "/placeholder-cinema.jpg"}
                    alt="Cinema image"
                    fill
                    priority
                    className="object-cover object-center scale-105"
                />
                
                {/* Floating Content Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end px-4 md:px-0 md:w-[85%] mx-auto pb-12 md:pb-20 pt-32">
                    <BlurFade delay={0.1}>
                        <div className="flex flex-col items-start gap-4">
                             <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-white/10 backdrop-blur-md border border-zinc-200 dark:border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 dark:text-white shadow-2xl">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Premium Location
                            </div>
                            <h1 className="text-3xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase drop-shadow-2xl">
                                {selectedCinema?.name}
                            </h1>
                             <div className="flex flex-col md:flex-row md:items-center gap-2 text-zinc-600 dark:text-white/80 font-bold uppercase text-[10px] md:text-xs tracking-widest bg-zinc-50/80 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-zinc-200 dark:border-white/10 w-full md:w-auto">
                                <div className="flex items-center gap-2">
                                    <span className="text-emerald-400">ADDRESS:</span>
                                    <span className="truncate">{selectedCinema?.address}</span>
                                </div>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="md:w-[85%] mx-auto px-4 md:px-0 mt-12 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Ticket Pricing & Promotions */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-2xl rounded-sm p-6 md:p-8 shadow-2xl border border-white/20 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 md:h-8 bg-emerald-500 rounded-full" />
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Biểu phí dịch vụ</h2>
                            </div>
                            
                            <div className="relative group overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 shadow-lg">
                                <Image
                                    src="https://cdn.galaxycine.vn/media/2025/12/15/gia-ve---hanoi-centre_1765787046614.jpg" 
                                    alt="Giá vé"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                    <span className="text-white font-black uppercase tracking-widest text-xs border border-white/40 px-4 py-2 rounded-full backdrop-blur-md">Phóng to để xem</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Map Information */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-2xl rounded-sm p-6 md:p-8 shadow-2xl border border-white/20 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 md:h-8 bg-emerald-500 rounded-full" />
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Thông tin liên hệ</h2>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-1 p-4 rounded-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Điện thoại hỗ trợ</span>
                                    <span className="text-xl font-bold tracking-tighter">{selectedCinema?.phone_number || "1900 xxxx"}</span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Vị trí trên bản đồ</span>
                                    <div className="rounded-sm overflow-hidden p-2 shadow-xl border border-zinc-100 dark:border-white/10 grayscale-30 hover:grayscale-0 transition-all duration-700">
                                        <GoogleMapView
                                            latitude={selectedCinema?.latitude}
                                            longitude={selectedCinema?.longitude}
                                            title={selectedCinema?.name}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 rounded-sm bg-emerald-500/5 border border-emerald-500/10 mt-2">
                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-relaxed italic">
                                        {selectedCinema?.description || "Rạp của chúng tôi được trang bị hệ thống âm thanh Dolby Atmos và màn hình IMAX hiện đại, mang đến trải nghiệm điện ảnh chân thực nhất."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}