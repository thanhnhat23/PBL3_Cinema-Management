"use client";

import { CardMovie } from "@/components/layout/cardMovie";
import dynamic from "next/dynamic";
import { ChevronRight } from "../components/icons/chevron-right";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Tab, Tabs, Image } from "@heroui/react";
import { Cctv } from "../components/icons/cctv";
import { TrendingUpIcon } from "../components/icons/trending-up";
import { FlameIcon, type FlameIconHandle } from "../components/icons/flame";
import { useMovieStore } from "@/stores/useMovieStore";
import CardSkeleton from "@/components/skeletons/cardMovie";
import { Meteors } from "@/components/ui/effects/meteors";
import { Iphone } from "@/components/ui/iphone";
import { SparklesText } from "@/components/ui/texts/sparkles-text";
import { AuroraText } from "@/components/ui/texts/aurora-text";
import { Highlighter } from "@/components/ui/texts/highlighter";
import Link from "next/link";
import { _axios } from "@/lib/axios";
import Swal from "sweetalert2";

const Carousel = dynamic(() => import("@/components/layout/carousel"), {
  ssr: true,
});

export default function HomePage() {
    return (
    <Suspense>
        <Home />
    </Suspense>
    );
}

function Home() {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState<string>('nowplaying');
    const flameRef = useRef<FlameIconHandle | null>(null);
    const trendingRef = useRef<FlameIconHandle | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const { 
        fetchMoviesByStatus,
        fetchPopularMovies,
        moviesByStatusMap,
        popularMovies,
        isFetchingMoviesByStatus,
        isFetchingPopularMovies,
    } = useMovieStore();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const token = searchParams.get('token');
                if (!token) return;
                await _axios.post('/v1/auth/verify-email', { verificationToken: token });

                Swal.fire({
                    title: 'Thành công',
                    text: 'Xác minh email thành công! Bạn có thể đăng nhập ngay bây giờ.',
                    icon: 'success',
                });
            } catch (error) {
                console.log('Error verifying email: ', error);
                Swal.fire({
                    title: 'Lỗi',
                    text: 'Xác minh email thất bại. Vui lòng thử lại.',
                    icon: 'error',
                });
            }
        };
        verifyEmail();
    }, [searchParams]);

    useEffect(() => {
        if (hoveredItem === 'popular') {
            flameRef.current?.startAnimation();
        } else {
            flameRef.current?.stopAnimation();
        }
        if (hoveredItem === 'upcoming') {
            trendingRef.current?.startAnimation();
        } else {
            trendingRef.current?.stopAnimation();
        }
    }, [hoveredItem]);

    useEffect(() => {
        fetchMoviesByStatus(0, 8);
        fetchMoviesByStatus(1, 8);
        fetchPopularMovies(8);
    }, [fetchMoviesByStatus, fetchPopularMovies]);

    const nowPlayingMovies = moviesByStatusMap[0] ?? [];
    const upcomingMovies = moviesByStatusMap[1] ?? [];
    const isLoadingNowPlaying = isFetchingMoviesByStatus;
    const isLoadingUpcoming = isFetchingMoviesByStatus;
    const isLoadingPopular = isFetchingPopularMovies;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-0 md:py-6">
      <Carousel />

      {/* Card Movie Sections */}
      <div className="relative my-4 md:my-8 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-2 items-center justify-start">
            <span className="md:inline hidden w-1 h-8 bg-black dark:bg-white"></span>
            <h1 className="inline md:hidden text-2xl font-bold">Xem gì hôm nay?</h1>
            <h1 className="md:inline hidden text-3xl font-bold">Phim</h1>
            <Tabs 
                key="tabs" 
                aria-label="Tabs variants" 
                variant="underlined" 
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
                size="md"
                className="md:text-lg text-md font-semibold ml-0 md:ml-4"
            >
                <Tab key="nowplaying" title={
                        <div className="flex" onMouseEnter={() => setHoveredItem('nowplaying')} onMouseLeave={() => setHoveredItem(null)}>
                            <Cctv 
                            animate={hoveredItem === 'nowplaying'}
                            className="inline w-5 h-5 mr-2 mb-1" 
                            size={18}
                            />
                            <span>Đang chiếu</span>
                        </div>
                    }
                />

                <Tab key="coming-soon" title={
                        <div className="flex" onMouseEnter={() => setHoveredItem('upcoming')} onMouseLeave={() => setHoveredItem(null)}>
                            <TrendingUpIcon 
                            ref={trendingRef}
                            className="inline w-5 h-5 mr-2 mb-1" 
                            size={18}
                            />
                            <span>Sắp chiếu</span>
                        </div>
                    } 
                />

                <Tab key="popular" title={
                        <div className="flex" onMouseEnter={() => setHoveredItem('popular')} onMouseLeave={() => setHoveredItem(null)}>
                            <FlameIcon 
                            ref={flameRef}
                            className="inline w-5 h-5 mr-2 mb-1" 
                            size={18}
                            />
                            <span>Phổ biến</span>
                        </div>
                    } 
                />
            </Tabs>
        </div>
        
        {selectedTab === 'nowplaying' && (
            <div className="min-h-screen gap-4 md:gap-8 grid grid-cols-2 sm:grid-cols-4 p-2 md:pt-8 ">
                {isLoadingNowPlaying ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <CardSkeleton key={index} />
                    ))
                ) : (
                    nowPlayingMovies.map((movie, index) => (
                      <CardMovie movie={movie} index={index} key={index} />
                    ))
                )}
            </div>
        )}
        
        {selectedTab === 'coming-soon' && (
            <div className="min-h-screen gap-8 grid grid-cols-2 sm:grid-cols-4 p-2 md:pt-8 ">
                {isLoadingUpcoming ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <CardSkeleton key={index} />
                    ))
                ) : (
                    upcomingMovies.map((movie, index) => (
                      <CardMovie movie={movie} index={index} key={index} />
                    )) 
                )}
            </div>
        )}
        
        {selectedTab === 'popular' && (
            <div className="min-h-screen gap-8 grid grid-cols-2 sm:grid-cols-4 p-2 md:pt-8 ">
                {isLoadingPopular ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <CardSkeleton key={index} />
                    ))
                ) : (
                    popularMovies.map((movie, index) => (
                      <CardMovie movie={movie} index={index} key={index} />
                    ))
                )}
            </div>
        )}
      </div>

      <div className="flex items-center pb-8 md:py-4 group relative">
          <button
              className={`flex items-center justify-center border-1 border-orange-400 text-sm md:text-base text-orange-400 font-semibold transition
              duration-300 ease-in-out px-4 py-2 rounded-[0.2rem] group-hover:bg-orange-400 group-hover:text-white cursor-pointer`}
              onMouseEnter={() => setHoveredItem("see-more")}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => router.push('/movies')}
          >
              Xem thêm 
              <ChevronRight animate={hoveredItem === "see-more"} size={18} className="text-orange-400 group-hover:text-white"/>
          </button>
      </div>

      <hr className="w-full p-px my-8 bg-gray-400/30"/>

      {/* Coupon Section */}
      <div className="flex flex-col gap-6 items-center my-8 w-[90%] md:p-4">
        <div className="flex gap-2 justify-start w-full items-center">
                <span className="inline w-1 h-6 md:h-8 bg-black dark:bg-white"></span>
                <h1 className="inline text-2xl md:text-3xl font-bold">Ưu đãi đặc biệt</h1>
        </div>

        <div className="md:grid grid-cols-2 md:grid-cols-3 p-4 md:p-8 gap-4 md:gap-10 w-full">
            <div className="flex flex-col items-center mb-8">
                <Image 
                    src="https://cdn.galaxycine.vn/media/2026/2/3/tang-qua-nam-moi-3_1770109637475.jpg" 
                    alt="Voucher Tết" 
                    className="w-72 h-36 md:w-150 md:h-76 object-cover object-top rounded-lg border border-gray-300 shadow-md"
                />
                <h2 className="text-center mt-2 text-md md:text-lg font-medium md:font-bold">Tết Mã Ngập Quà – Năm Mới Nở Hoa</h2>
            </div>

            <div className="flex flex-col items-center mb-8">
                <Image 
                    src="https://www.galaxycine.vn/media/2025/9/4/momo-galaxy-2_1756958593143.jpg" 
                    alt="Voucher MoMo"  
                    className="w-72 h-36 md:w-150 md:h-76 object-cover object-top rounded-lg border border-gray-300 shadow-md"
                />
                <h2 className="text-center mt-2 text-md md:text-lg font-medium md:font-bold">MilkyWayyy Cinema Và MoMo Tặng Bắp Nước Miễn Phí</h2>
            </div>

            <div className="flex flex-col items-center">
                <Image 
                    src="https://www.galaxycine.vn/media/2025/1/22/bangqltv-digital-1135x660_1737516350592.jpg" 
                    alt="Ưu Đãi Thành Viên Galaxy Cinema 2026" 
                    className="w-72 h-36 md:w-150 md:h-76 object-cover object-top rounded-lg border border-gray-300 shadow-md"
                />
                <h2 className="text-center mt-2 text-md md:text-lg font-medium md:font-bold">Ưu Đãi Thành Viên Galaxy Cinema 2026</h2>
            </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="relative z-25 h-125 flex flex-col items-center justify-center  w-full border overflow-hidden bg-black">
        <Meteors number={50} />

        <div className="w-52 md:absolute md:left-1/4 md:-translate-x-1/2">
            <Iphone src="/banner.jpg"/>
        </div>
        
        <div className="absolute right-1/3 translate-x-1/2 hidden md:flex flex-col items-center justify-center gap-4 p-4 md:p-8 mt-4 md:mt-0">
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center tracking-tighter flex gap-2">
                <SparklesText>Đặt vé Online </SparklesText>
                -
                <AuroraText> Không lo trễ nải</AuroraText>
            </h2>
            <p className="text-center text-white/80 mt-4 max-w-xl">
                Đặt vé {" "}
                <Highlighter action="underline" color="#87ceeb">
                    nhanh chóng, tiện lợi ngay từ trang chủ của MilkyWayyy Cinema.
                </Highlighter>{" "}
                Không cần chờ đợi, không cần lo lắng về việc hết vé! Đến với MilkyWayyy Cinema để trải nghiệm dịch vụ đặt vé tuyệt vời nhất!
            </p>
        </div>
      </div>

      {/* About Section */}
      <div className="flex flex-col gap-6 items-center my-8 w-[90%] md:p-4">
        <div className="flex gap-2 justify-start w-full items-center">
            <span className="inline w-1 h-6 md:h-8 bg-black dark:bg-white"></span>
            <h1 className="inline text-2xl md:text-3xl font-bold">Trang chủ</h1>
        </div>

        <div className="flex flex-col gap-3 text-justify text-sm md:text-base">
            <p className="antialiased md:subpixel-antialiased font-stretch-normal">
                <span className="font-medium">MilkyWayyy Cinema</span> là một trong những công ty tư nhân đầu tiên về điện ảnh được thành lập từ năm 2026, đã khẳng định thương hiệu là 1 trong 10 địa điểm vui chơi giải trí được yêu thích nhất. Ngoài hệ thống rạp chiếu phim hiện đại, thu hút hàng triệu lượt người đến xem, <span className="font-medium">MilkyWayyy Cinema</span> còn hấp dẫn khán giả bởi không khí thân thiện cũng như chất lượng dịch vụ hàng đầu.
            </p>

            <p className="antialiased md:subpixel-antialiased font-stretch-normal">
                Đến website <Link href="https://milkywayyy.me" className="text-blue-400 hover:underline underline-offset-4">milkywayyy.me</Link>, khách hàng sẽ dễ dàng tham khảo các phim hay nhất, phim mới nhất đang chiếu hoặc sắp chiếu luôn được cập nhật thường xuyên. Lịch chiếu tại tất cả hệ thống rạp chiếu phim của <span className="font-medium">MilkyWayyy Cinema</span> cũng được cập nhật đầy đủ hàng ngày hàng giờ trên trang chủ.
            </p>

            <p className="antialiased md:subpixel-antialiased font-stretch-normal">
                Giờ đây đặt vé tại <span className="font-medium">MilkyWayyy Cinema</span> càng thêm dễ dàng chỉ với vài thao tác vô cùng đơn giản. Để mua vé, hãy vào tab Mua vé. Quý khách có thể chọn Mua vé theo phim, theo rạp, hoặc theo ngày. Sau đó, tiến hành mua vé theo các bước hướng dẫn. Chỉ trong vài phút, quý khách sẽ nhận được tin nhắn và email phản hồi Đặt vé thành công của <span className="font-medium">MilkyWayyy Cinema</span>. Quý khách có thể dùng tin nhắn lấy vé tại quầy vé của <span className="font-medium">MilkyWayyy Cinema</span> hoặc quét mã QR để một bước vào rạp mà không cần tốn thêm bất kỳ công đoạn nào nữa.
            </p>

            <p className="antialiased md:subpixel-antialiased font-stretch-normal">
                Nếu bạn đã chọn được phim hay để xem, hãy đặt vé cực nhanh bằng box Mua Vé Nhanh ngay từ Trang Chủ. Chỉ cần một phút, tin nhắn và email phản hồi của <span className="font-medium">MilkyWayyy Cinema</span> sẽ gửi ngay vào điện thoại và hộp mail của bạn.
            </p>

            <p className="antialiased md:subpixel-antialiased font-stretch-normal">
                Nếu chưa quyết định sẽ xem phim mới nào, hãy tham khảo các bộ phim hay trong mục Phim Đang Chiếu cũng như Phim Sắp Chiếu tại rạp chiếu phim bằng cách vào mục Bình Luận Phim ở Góc Điện Ảnh để đọc những bài bình luận chân thật nhất, tham khảo và cân nhắc. Sau đó, chỉ việc đặt vé bằng box Mua Vé Nhanh ngay ở đầu trang để chọn được suất chiếu và chỗ ngồi vừa ý nhất.  
            </p>

            <p className="antialiased md:subpixel-antialiased font-stretch-normal">
                <span className="font-medium">MilkyWayyy Cinema</span> luôn có những chương trình khuyến mãi, ưu đãi, quà tặng vô cùng hấp dẫn như giảm giá vé, tặng vé xem phim miễn phí, tặng Combo, tặng quà phim…  dành cho các khách hàng.
            </p>

            <p className="antialiased md:subpixel-antialiased font-stretch-normal">
                Trang web <Link href="https://milkywayyy.me" className="text-blue-400 hover:underline underline-offset-4">milkywayyy.me</Link> còn có mục Góc Điện Ảnh - nơi lưu trữ dữ liệu về phim, diễn viên và đạo diễn, những bài viết chuyên sâu về điện ảnh, hỗ trợ người yêu phim dễ dàng hơn trong việc lựa chọn phim và bổ sung thêm kiến thức về điện ảnh cho bản thân. Ngoài ra, vào mỗi tháng, <span className="font-medium">MilkyWayyy Cinema</span> cũng giới thiệu các phim sắp chiếu hot nhất trong mục Phim Hay Tháng .
            </p>

            <p className="antialiased md:subpixel-antialiased font-stretch-normal">
                Hiện nay, <span className="font-medium">MilkyWayyy Cinema</span> đang ngày càng phát triển hơn nữa với các chương trình đặc sắc, các khuyến mãi hấp dẫn, đem đến cho khán giả những bộ phim bom tấn của thế giới và Việt Nam nhanh chóng và sớm nhất.
            </p>
        </div>
      </div>
    </div>
  )
}
