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
import i18n, { i18nConfig } from '@/lib/i18n';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize Client-side/SSR i18n features
if (!i18n.isInitialized) {
  i18n.use(initReactI18next);
  
  if (typeof window !== 'undefined') {
    i18n.use(LanguageDetector);
  }

  i18n.init({
    ...i18nConfig,
    detection: {
      order: ['cookie', 'localStorage', 'htmlTag'],
      lookupCookie: 'i18next',
      caches: ['cookie', 'localStorage'],
    },
  });
}


function AuthInitializer({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}

export function Providers({children, locale}: { children: React.ReactNode, locale?: string }) {
  const pathname = usePathname();
  const isHideNavFooter = pathname === '/dashboard';

  // Sync language on server and client
  if (locale && i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }

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