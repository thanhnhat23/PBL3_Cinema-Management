'use client'

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { Button, Accordion, AccordionItem, Tabs, Tab, Progress } from "@heroui/react";
import { Settings } from "@/components/icons/settings";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { UserRound } from "@/components/icons/user-round";
import { HistoryIcon, type HistoryIconHandle } from "@/components/icons/history";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { IoIosMail } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { MdPassword } from "react-icons/md";
import { useDialogStore } from "@/stores/useDialogStore";
import { CircleCheck } from 'lucide-react';
import { BadgeCheck } from 'lucide-react';
import { AvatarElement } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { authUser } = useAuthStore();
  const { fetchUserById, user } = useUserStore();
  const searchParams = useSearchParams();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const { setOpenDialog } = useDialogStore();
  const historyRef = useRef<HistoryIconHandle>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const tabParam = searchParams.get('tab');
  const [selectedTab, setSelectedTab] = useState<string>(() => {
      if (tabParam && ['info', 'history'].includes(tabParam)) {
          return tabParam;
      }
      return 'info';
  });

  useEffect(() => {
    if (hoveredItem === 'history') {
        historyRef.current?.startAnimation();
    } else {
        historyRef.current?.stopAnimation();
    }
  }, [hoveredItem]);

  useEffect(() => {
    if (!id || id === "tmdb-user") return;
    fetchUserById(id);
  }, [id, fetchUserById]);

  return (
    <div className="flex justify-center items-start">
      <div className="md:w-[70%] w-full mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-900 shadow-lg flex flex-col items-center p-4">
          <div className="w-28 flex justify-center relative my-4">
            <AvatarElement 
              user={user} 
              width="w-28" 
              height="h-28" 
              left="left-1/2" 
              translatex="-translate-x-1/2" 
              widthDeco="w-34"
            />

            {authUser?.id === id && (
              <Button 
                size="sm"
                radius="full"
                variant="shadow"
                isIconOnly
                className="absolute bottom-0 right-0 z-20"
                color="primary"
                onClick={() => setOpenDialog('settings')}
              >
                <Settings size={16} />
              </Button>
            )}
          </div>

          <div className="w-full flex gap-2 items-center justify-center cursor-default">
            <UserRound animateOnHover size={16}/>
            <h1 className="text-xl font-semibold">{user?.username}</h1>

            {Number(user?.role) === 0 ? (
              <BadgeCheck size={18} className="mt-1 text-red-500"/>
            ) : Number(user?.role) === 1 ? (
              <CircleCheck size={18} className="mt-1 text-green-500"/>
            ) : null}
          </div>

          <hr className="w-full my-4" />

          <div className="w-full flex flex-col gap-2">
            <h1 className="text-lg md:text-xl font-semibold">Tổng chi {new Date().getFullYear()}</h1>
            <div className="w-full flex items-center gap-4">
              <Progress 
                value={1000000} 
                label="Chi tiêu"
                maxValue={4000000}
                formatOptions={{style: "currency", currency: "VND"}}
                showValueLabel={true}
                size="md"
                classNames={{
                  indicator: "bg-linear-to-r from-pink-300 to-purple-500",
                }}
              />
            </div>
          </div>

          <hr className="w-full my-4" />

          <div className="w-full flex flex-col gap-2">
            <Accordion>
              <AccordionItem key="1" aria-label="Hotline support" title="Hotline hỗ trợ" className="font-semibold">
                <Link href="tel:19002310" className="text-blue-500 hover:underline">
                  19002310
                </Link>
              </AccordionItem>
              <AccordionItem key="2" aria-label="Email support" title="Email hỗ trợ" className="font-semibold">
                <Link href="mailto:milkywayyy@cinema.me" className="text-blue-500 hover:underline">
                  milkywayyy@cinema.me
                </Link>
              </AccordionItem>
              <AccordionItem key="3" aria-label="Source web" title="Source website" className="font-semibold">
                <Link href="https://github.com/thanhnhat23/PBL3_Cinema-Management" className="text-blue-500 hover:underline">
                  Cinema Management
                </Link>
              </AccordionItem>
              <AccordionItem 
                key="4" aria-label="About us" 
                title="Về chúng tôi" 
                classNames={ {heading: "font-semibold"} }
              >
                - Đây là một ứng dụng của đồ án PBL3 của trường Đại học Bách Khoa Đà Nẵng  
                <br /> - Gồm 2 thành viên thực hiện: Lương Thanh Nhật và Nguyễn Thị Nghĩa. 
                <br /> - Đây không phải là một ứng dụng thương mại, mà chỉ là một sản phẩm của đồ án, nên sẽ không có dịch vụ hỗ trợ thực sự nào cả. 
                <br /> - Nếu bạn có bất kỳ câu hỏi hoặc phản hồi nào về ứng dụng, vui lòng liên hệ với chúng tôi qua github đã cung cấp ở trên. Chúng tôi rất mong nhận được phản hồi từ bạn để cải thiện ứng dụng trong tương lai.
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="w-full md:w-2/3 rounded-lg p-2 md:p-4 flex flex-col self-start bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-900 shadow-lg">
          <div className="w-full flex items-center justify-center p-2">
            <Tabs 
              key="tabs"
              aria-label="Options" 
              variant="underlined" 
              size={isDesktop ? "lg" : "md"}
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
            >
              <Tab key="info" title={
                <div className="flex items-center justify-center gap-2" onMouseEnter={() => setHoveredItem('info')} onMouseLeave={() => setHoveredItem(null)}>
                    <UserRound
                        animate={hoveredItem === 'info'}
                        size={16}
                    />
                    <span>Thông tin cá nhân</span>
                </div>
              } />

              <Tab key="history" title={
                <div className="flex items-center justify-center gap-2" onMouseEnter={() => setHoveredItem('history')} onMouseLeave={() => setHoveredItem(null)}>
                    <HistoryIcon 
                      ref={historyRef}
                      size={16}
                    />
                    <span>Lịch sử đặt vé</span>
                </div>
              } />
            </Tabs>
          </div>

          <hr className="w-full p-2"/>

          {selectedTab === "info" && (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-md font-semibold">Tên cá nhân:</p>
                <div className="w-full flex gap-2 md:gap-4 items-center rounded-sm bg-neutral-200 dark:bg-neutral-800 p-2">
                  <FaUser size={isDesktop ? 18 : 16} className="text-neutral-500"/>
                  <p className="text-md md:text-lg text-neutral-500">{user?.username ? user?.username : 'Không có dữ liệu'}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-md font-semibold">Email: </p>
                <div className="w-full flex gap-2 md:gap-4 items-center rounded-sm bg-neutral-200 dark:bg-neutral-800 p-2">
                  <IoIosMail size={isDesktop ? 22 : 18} className="text-neutral-500"/>
                  <p className="text-md md:text-lg text-neutral-500">{user?.email ? user?.email : 'Không có dữ liệu'}</p>
                  {authUser?.id === id && (
                    <Button 
                      isIconOnly 
                      size="sm" 
                      radius="full" 
                      variant="light" 
                      color="primary" 
                      className="ml-auto"
                      onClick={() => setOpenDialog('change-email')}
                    >
                      <FiEdit3 size={16}/>
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-md font-semibold">Ngày tạo tài khoản: </p>
                <div className="w-full flex gap-2 md:gap-4 items-center rounded-sm bg-neutral-200 dark:bg-neutral-800 p-2">
                  <MdDateRange size={isDesktop ? 22 : 18} className="text-neutral-500"/>
                  <p className="text-md md:text-lg text-neutral-500">{user?.createdAt ? new Date(user?.createdAt).toLocaleDateString('vi-VN') : 'Không có dữ liệu'}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-md font-semibold">Trạng thái: </p>
                <div className={`w-full flex gap-2 md:gap-4 items-center rounded-sm p-2 ${user?.isVerified ? 'bg-fuchsia-500/70' : 'bg-red-500/70'}`}>
                  <FaUserCheck size={isDesktop ? 22 : 18} className={`${user?.isVerified ? 'text-fuchsia-200' : 'text-red-200'}`}/>
                  <p className={`text-md md:text-lg ${user?.isVerified ? 'text-fuchsia-200' : 'text-red-200'}`}>{user?.isVerified ? "Đã xác minh email" : "Chưa xác minh email"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-md font-semibold">Ngày sinh: </p>
                <div className="w-full flex gap-2 md:gap-4 items-center rounded-sm bg-neutral-200 dark:bg-neutral-800 p-2">
                  <MdDateRange size={isDesktop ? 22 : 18} className="text-neutral-500"/>
                  <p className="text-md md:text-lg text-neutral-500">{user?.birthDate ? new Date(user.birthDate).toLocaleDateString('vi-VN') : 'Không có dữ liệu'}</p>
                  {authUser?.id === id && (
                    <Button 
                      isIconOnly 
                      size="sm" 
                      radius="full" 
                      variant="light" 
                      color="primary" 
                      className="ml-auto"
                      onClick={() => setOpenDialog('change-birthdate')}
                    >
                      <FiEdit3 size={16}/>
                    </Button>
                  )}
                </div>
              </div>

              {authUser?.id === id && (
                <div className="flex flex-col gap-1">
                  <p className="text-md font-semibold">Mật khẩu: </p>
                  <div className="w-full flex gap-2 md:gap-4 items-center rounded-sm bg-neutral-200 dark:bg-neutral-800 p-2">
                    <MdPassword size={isDesktop ? 22 : 18} className="text-neutral-500"/>
                    <p className="text-md md:text-lg text-neutral-500">●●●●●●●●●●●●</p>
                    <Button 
                      isIconOnly 
                      size="sm" 
                      radius="full" 
                      variant="light" 
                      color="primary" 
                      className="ml-auto"
                      onClick={() => setOpenDialog('change-password')}
                    >
                      <FiEdit3 size={16}/>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTab === "history" && (
            <div className="w-full p-4">
              <h2 className="text-xl font-semibold mb-4">Lịch sử đặt vé</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}