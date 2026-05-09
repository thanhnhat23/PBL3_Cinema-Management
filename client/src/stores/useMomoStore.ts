import { create } from 'zustand';
import { _axios } from '@/lib/axios';

import { PaymentStatus } from '@/types/payment';

export interface MomoPayment {
  payment_id: number;
  booking_id: number;
  amount: number;
  requestType: string;
  status: PaymentStatus;
  orderId: string;
  requestId: string;
  transId?: string | null;
  orderInfo?: string | null;
  resultCode?: number | null;
  message?: string | null;
  createdAt: string;
  paidAt?: string | null;
}

export interface CreateMomoPaymentPayload {
  booking_id: number;
  orderInfo?: string;
  requestType?: string; // captureMoMoWallet or payWithATM
  returnUrl?: string;
}

export interface CreateMomoPaymentResult {
  payment_id: number;
  orderId: string;
  payUrl: string;
  status: PaymentStatus;
}

export interface MomoPaymentCallbackResult {
  isValidSignature: boolean;
  isSuccess: boolean;
  orderId: string;
  message?: string;
  resultCode?: number;
  status: PaymentStatus;
}

export const useMomoStore = create<{
  payments: MomoPayment[];
  selectedPayment: MomoPayment | null;
  latestCreateResult: CreateMomoPaymentResult | null;
  callbackResult: MomoPaymentCallbackResult | null;
  isFetchingPayments: boolean;
  isFetchingPayment: boolean;
  isCreatingPayment: boolean;
  isVerifyingCallback: boolean;
  fetchAllPayments: () => Promise<void>;
  fetchPaymentById: (paymentId: number) => Promise<void>;
  createMomoPayment: (payload: CreateMomoPaymentPayload) => Promise<CreateMomoPaymentResult | null>;
  verifyMomoCallback: (query: Record<string, string>) => Promise<MomoPaymentCallbackResult | null>;
  clearPaymentState: () => void;
}>((set) => ({
  payments: [],
  selectedPayment: null,
  latestCreateResult: null,
  callbackResult: null,
  isFetchingPayments: false,
  isFetchingPayment: false,
  isCreatingPayment: false,
  isVerifyingCallback: false,

  fetchAllPayments: async () => {
    try {
      set({ isFetchingPayments: true });
      const response = await _axios.get<MomoPayment[]>('/v1/momoPayment');
      set({ payments: response.data ?? [] });
    } catch (error) {
      console.error('Error fetching MoMo payments:', error);
    } finally {
      set({ isFetchingPayments: false });
    }
  },

  fetchPaymentById: async (paymentId: number) => {
    try {
      set({ isFetchingPayment: true });
      const response = await _axios.get<MomoPayment>(`/v1/momoPayment/${paymentId}`);
      set({ selectedPayment: response.data ?? null });
    } catch (error) {
      console.error(`Error fetching MoMo payment ${paymentId}:`, error);
      set({ selectedPayment: null });
    } finally {
      set({ isFetchingPayment: false });
    }
  },

  createMomoPayment: async (payload: CreateMomoPaymentPayload) => {
    try {
      set({ isCreatingPayment: true });
      const response = await _axios.post<CreateMomoPaymentResult>('/v1/momoPayment/create', payload);
      const result = response.data;
      set({ latestCreateResult: result });
      return result;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      console.error('Error creating MoMo payment:', message);
      return null;
    } finally {
      set({ isCreatingPayment: false });
    }
  },

  verifyMomoCallback: async (query: Record<string, string>) => {
    try {
      set({ isVerifyingCallback: true });
      const params = new URLSearchParams(query).toString();
      const response = await _axios.get<MomoPaymentCallbackResult>(`/v1/momoPayment/callback?${params}`);
      const result = response.data;
      set({ callbackResult: result });
      return result;
    } catch (error) {
      console.error('Error verifying MoMo callback:', error);
      return null;
    } finally {
      set({ isVerifyingCallback: false });
    }
  },

  clearPaymentState: () =>
    set({
      selectedPayment: null,
      latestCreateResult: null,
      callbackResult: null,
    }),
}));
