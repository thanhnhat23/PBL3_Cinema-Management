'use client'

import {HeroUIProvider} from '@heroui/react'
import {ToastProvider} from "@heroui/toast";
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { AuthDialog } from '@/components/layout/formDialog';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
      <AuthInitializer>
        {children}
        <AuthDialog />
      </AuthInitializer>
    </HeroUIProvider>
  )
}