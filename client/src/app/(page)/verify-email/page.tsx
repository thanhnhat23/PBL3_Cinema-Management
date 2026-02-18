'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { _axios } from '@/lib/axios';
import { Button } from '@/components/ui/buttons/buttonCarousel';
export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');

        if (!token) {
          setStatus('error');
          setMessage('Invalid verification link');
          return;
        }

        console.log('Verifying with token:', token);

        const response = await _axios.get(`/v1/auth/verify-email?token=${token}`);

        setStatus('success');
        setMessage('Email verified successfully! Redirecting to home...');
        
        // Redirect to home sau 2 giây
        setTimeout(() => router.push('/'), 2000);
      } catch (error: any) {
        const errorMsg = error.response?.data?.Message || error.message;
        
        console.error('Verification error:', errorMsg);
        
        if (errorMsg.includes('expired') || errorMsg.includes('Please register again')) {
          setStatus('expired');
          setMessage('Verification link has expired. Please register again.');
        } else {
          setStatus('error');
          setMessage(errorMsg || 'Email verification failed');
        }
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Verifying your email...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <p className="text-green-600 text-2xl mb-4">✓ {message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <p className="text-red-600 text-xl mb-4">✗ {message}</p>
            <Button 
              onClick={() => router.push('/')}
            >
              Back to Home
            </Button>
          </>
        )}
        
        {status === 'expired' && (
          <>
            <p className="text-red-600 text-xl mb-4">✗ {message}</p>
            <Button 
              onClick={() => router.push('/register')}
            >
              Register Again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}