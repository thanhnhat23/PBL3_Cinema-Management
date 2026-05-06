'use client'

import { Briefcase, Users, Star, GraduationCap, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@heroui/react";
import Link from "next/link";

export default function Recruitment() {
    const jobs = [
        {
            title: "Giám sát sảnh rạp (Floor Supervisor)",
            location: "Toàn quốc",
            type: "Toàn thời gian",
            salary: "8,000,000 - 12,000,000 VNĐ",
            desc: "Quản lý hoạt động vận hành tại sảnh, điều phối nhân viên và giải quyết các khiếu nại của khách hàng."
        },
        {
            title: "Nhân viên Phục vụ (Cinema Staff)",
            location: "Đà Nẵng / Huế / HCM",
            type: "Bán thời gian",
            salary: "25,000 - 30,000 VNĐ/giờ",
            desc: "Bán vé, phục vụ bắp nước và hỗ trợ khách hàng tại khu vực rạp chiếu."
        },
        {
            title: "Kỹ thuật viên phòng chiếu",
            location: "Đà Nẵng / Hà Nội / Nha Trang / Huế",
            type: "Toàn thời gian",
            salary: "10,000,000 - 15,000,000 VNĐ",
            desc: "Vận hành hệ thống máy chiếu, âm thanh và bảo trì thiết bị kỹ thuật trong rạp."
        }
    ];

    const benefits = [
        { icon: <Star />, text: "Xem phim miễn phí hàng tuần" },
        { icon: <Users />, text: "Môi trường trẻ trung, năng động" },
        { icon: <GraduationCap />, text: "Đào tạo kỹ năng chuyên nghiệp" },
        { icon: <Clock />, text: "Giờ làm việc linh hoạt" }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-20 px-6">
            <div className="max-w-6xl mx-auto space-y-20">
                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        Join Our Team
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-none">
                        GIA NHẬP <span className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">VŨ TRỤ</span> MILKYWAYYY
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto text-lg">
                        Bạn đam mê điện ảnh? Bạn muốn làm việc trong môi trường sáng tạo và chuyên nghiệp? Hãy cùng chúng tôi tạo nên những trải nghiệm tuyệt vời cho khán giả.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {benefits.map((benefit, i) => (
                        <div key={i} className="p-8 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-sm text-center space-y-4 hover:border-amber-500/50 transition-all duration-300 shadow-sm group">
                            <div className="inline-flex p-3 bg-amber-500/10 rounded-xl text-amber-500 group-hover:scale-110 transition-transform">
                                {benefit.icon}
                            </div>
                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-tighter italic leading-tight">
                                {benefit.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Job Listings */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
                        <h2 className="text-2xl font-black uppercase tracking-widest text-zinc-900 dark:text-white italic">Vị trí đang tuyển</h2>
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
                    </div>

                    <div className="grid gap-6">
                        {jobs.map((job, i) => (
                            <div key={i} className="group p-8 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-sm hover:shadow-2xl hover:border-amber-500/30 transition-all duration-500">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-3">
                                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1.5">
                                                <MapPin size={12} /> {job.location}
                                            </span>
                                            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1.5">
                                                <Briefcase size={12} /> {job.type}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
                                            {job.title}
                                        </h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl italic leading-relaxed">
                                            &quot;{job.desc}&quot;
                                        </p>
                                        <p className="text-amber-600 font-black text-sm uppercase tracking-widest">
                                            Lương: {job.salary}
                                        </p>
                                    </div>
                                    <Button 
                                        as={Link}
                                        href="/recruitment/apply"
                                        className="w-full md:w-auto px-6 rounded-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black uppercase tracking-widest text-xs group-hover:bg-amber-500 group-hover:text-white transition-all shadow-xl"
                                        endContent={<ArrowRight size={16} />}
                                    >
                                        Ứng tuyển ngay
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="p-12 bg-linear-to-r from-amber-500 to-orange-600 rounded-sm text-center space-y-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="relative z-10 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">Bạn chưa thấy vị trí phù hợp?</h2>
                        <p className="font-medium text-amber-100 max-w-2xl mx-auto">
                            Đừng ngần ngại gửi hồ sơ của bạn cho chúng tôi. Chúng tôi luôn tìm kiếm những tài năng mới để cùng phát triển MilkyWayyy trong tương lai.
                        </p>
                        <div className="pt-4">
                            <a href="mailto:hr@milkywayyy.com" className="px-10 py-4 bg-white text-amber-600 font-black uppercase tracking-widest text-sm rounded-lg hover:bg-zinc-900 hover:text-white transition-all inline-block shadow-lg">
                                Gửi CV tự do
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
