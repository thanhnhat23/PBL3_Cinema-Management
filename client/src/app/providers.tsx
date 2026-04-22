'use client'

import { HeroUIProvider } from '@heroui/react'
import { ToastProvider } from "@heroui/toast";
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatBotStore } from '@/stores/useChatBot';
import { AuthDialog } from '@/components/layout/formDialog';
import FooterLayout from '@/components/layout/footer';
import NavbarLayout from '@/components/layout/navbar';
import ChatBot from '@/components/layout/chatBot';
import { usePathname } from 'next/navigation';


function AuthInitializer({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}

export function Providers({children}: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHideNavFooter = pathname === '/dashboard';

  const { authUser, isCheckingAuth } = useAuthStore();
  const { loadHistory, clearChat } = useChatBotStore();

  useEffect(() => {
    if (!isCheckingAuth && authUser?.id) {
      void loadHistory();
    }
  }, [authUser?.id, isCheckingAuth, loadHistory]);

  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      clearChat();
    }
  }, [authUser, isCheckingAuth, clearChat]);
  
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
      <AuthInitializer>
        {isHideNavFooter ? null : <NavbarLayout />}
        {children}
        {isHideNavFooter ? null : <FooterLayout />}
        <AuthDialog />
        {!isCheckingAuth && authUser ? <ChatBot /> : null}
      </AuthInitializer>
    </HeroUIProvider>
  )
}