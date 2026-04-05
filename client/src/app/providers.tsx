'use client'

import { HeroUIProvider } from '@heroui/react'
import { ToastProvider } from "@heroui/toast";
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { AuthDialog } from '@/components/layout/formDialog';
import FooterLayout from '@/components/layout/footer';
import NavbarLayout from '@/components/layout/navbar';
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
  
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
      <AuthInitializer>
        {isHideNavFooter ? null : <NavbarLayout />}
        {children}
        {isHideNavFooter ? null : <FooterLayout />}
        <AuthDialog />
      </AuthInitializer>
    </HeroUIProvider>
  )
}