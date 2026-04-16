"use client";

import { MotionCarousel } from "@/components/ui/motion-carousel";
import { EmblaOptionsType } from "embla-carousel";

export default function Carousel() {
    const OPTIONS: EmblaOptionsType = { loop: true };
    const SLIDE_IMAGE = [
        "https://cdn.galaxycine.vn/media/2026/2/10/phim-tet-3_1770710921760.jpg",
        "https://cdn.galaxycine.vn/media/2026/1/29/le-doat-hon-2048_1769654643967.jpg",
        "https://cdn.galaxycine.vn/media/2026/2/6/huyen-tinh-da-trach-2048_1770358920786.jpg",
        "https://cdn.galaxycine.vn/media/2026/2/10/te-le-quy-linh-nhi-2048_1770712765405.jpg",
        "https://cdn.galaxycine.vn/media/2026/2/1/2048-tam-tan-ky_1769883042086.jpg"
    ];
    const SLIDES = SLIDE_IMAGE.map((src, index) => ({ 
        src, 
        alt: `Slide ${index + 1}`,
        priority: index === 0
    }));

    return (
        <div>
            <MotionCarousel slides={SLIDES} options={OPTIONS} />
        </div>
    )
}