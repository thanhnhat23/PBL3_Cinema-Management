"use client";

import Image from "next/image";
import { useCinemaStore } from "@/stores/useCinemaStore";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { GoogleMapView } from "@/components/ui/google-map";
import DetailPageSkeleton from "@/components/skeletons/detailPage";

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
    <div className="min-h-screen flex flex-col item-center md:w-[85%] w-full mx-auto">
          <div className="flex flex-col gap-4 border-b-1 border-zinc-200 pb-8">
            <Image
              src={selectedCinema?.image_overview ?? "/placeholder-cinema.jpg"}
              alt="Cinema image"
              width={2500}
              height={600}
              className="object-fill w-full md:h-140 h-52 object-center md:mask-x-from-94% mask-x-from-98%"
            />

            <h1 className="md:text-3xl text-xl font-semibold md:mt-16 px-4">
              {selectedCinema?.name ?? "Tên rạp không xác định"}
            </h1>

            <p className="dark:text-neutral-200 text-neutral-800 px-4">
              {selectedCinema?.address ?? "Địa chỉ không xác định"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 md:mt-6 p-4">
            <div>
              <div className="flex gap-2 w-full items-center justify-start mb-4">
                <span className="w-1 h-5 bg-black dark:bg-white"></span>
                <h1 className="text-xl md:text-2xl font-bold">Giá vé</h1>
              </div>

              <Image
                src="https://cdn.galaxycine.vn/media/2025/12/15/gia-ve---hanoi-centre_1765787046614.jpg" 
                alt="Giá vé"
                width={700}
                height={600}
                className="rounded-sm shadow-sm border-1 border-zinc-200 object-cover"
              />
            </div>

            <div>
              <div className="flex gap-2 w-full items-center justify-start mb-4">
                <span className="w-1 h-5 bg-black dark:bg-white"></span>
                <h1 className="text-xl md:text-2xl font-bold">Chi tiết</h1>
              </div>

              <div className="flex flex-col gap-4">
                <p className="flex gap-1">
                  <span className="font-semibold dark:text-gray-300 text-gray-700 whitespace-nowrap">Địa chỉ: </span> {" "}
                  {selectedCinema?.address ?? "Địa chỉ không xác định"}
                </p>

                <p className="flex gap-1">
                  <span className="font-semibold dark:text-gray-300 text-gray-700">Điện thoại: </span> {" "}
                  {selectedCinema?.phone_number ?? "Điện thoại không xác định"}
                </p>

                <GoogleMapView
                  latitude={selectedCinema?.latitude}
                  longitude={selectedCinema?.longitude}
                  title={selectedCinema?.name}
                />

                {selectedCinema?.description ?? "Chưa cập nhật mô tả."}
              </div>
            </div>
          </div>
    </div>
  );
}