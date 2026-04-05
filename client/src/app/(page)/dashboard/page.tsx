'use client';

import { Separator } from '@/components/ui/effects/separator';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
} from '@/components/layout/sidebar';
import Image from 'next/image';
import { 
    Clapperboard,
    House, 
    Ticket, 
    Drama, 
    MapPinHouse, 
    TicketPercent,
    Speech,
    User,
    ChevronLeft,
    ChartNoAxesGantt,
    Boxes, 
    Sparkles
} from 'lucide-react';
import type { ReactNode } from 'react';


const Management = ["Phim", "Phòng", "Vé", "Suất chiếu", "Rạp chiếu", "Khuyến mãi", "Diễn viên", "Người dùng"] as const;
const Icon: Record<(typeof Management)[number], ReactNode> = {
  "Phim": <Clapperboard />,
  "Phòng": <House />,
  "Vé": <Ticket />,
  "Suất chiếu": <Drama />,
  "Rạp chiếu": <MapPinHouse />,
  "Khuyến mãi": <TicketPercent />,
  "Diễn viên": <Speech />,
  "Người dùng": <User />
};

export default function Dashboard() {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                                <div className="flex aspect-square size-12 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                                    <Image src="/logo.png" alt="Logo" width={40} height={40} />
                                </div>

                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="font-semibold tracking-wide text-base text-gray-50">
                                        Milky Wayyy
                                    </span>
                                    <span className="text-xs text-gray-300">
                                        Cinema
                                    </span>
                                </div>

                                <Sparkles className="text-fuchsia-400" />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                {/* Content Sidebar */}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className='gap-1'>
                            <ChartNoAxesGantt />
                            Quản lí tác vụ
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {Management.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton className="text-md font-normal">
                                        {Icon[item]}
                                        {item}
                                        <ChevronLeft className="ml-auto" />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel className='gap-1'>
                            <Boxes />
                            Khác
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>Item 1</SidebarMenuItem>
                            <SidebarMenuItem>Item 2</SidebarMenuItem>
                            <SidebarMenuItem>Item 3</SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>Item 1</SidebarMenuItem>
                        <SidebarMenuItem>Item 2</SidebarMenuItem>
                        <SidebarMenuItem>Item 3</SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>

            <SidebarInset>
                <SidebarTrigger />
            </SidebarInset>
        </SidebarProvider>
    )
}