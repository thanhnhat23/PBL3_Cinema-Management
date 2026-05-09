import { create } from 'zustand';
import { _axios } from '@/lib/axios';

import { PaymentStatus } from '@/types/payment';

export type VnpayPaymentMethod = 'VNPAYQR' | 'VNBANK';

export interface VnpayPayment {
  payment_id: number;
  booking_id: number;
  amount: number;
  method: VnpayPaymentMethod;
  status: PaymentStatus;
  vnp_BankCode?: string | null;
  vnp_TransactionNo?: string | null;
  vnp_IpAddr?: string | null;
  vnp_TxnRef?: string | null;
  vnp_ResponseCode?: string | null;
  vnp_OrderInfo?: string | null;
  vnp_SecureHash?: string | null;
  vnp_CreateDate: string;
  vnp_ExpireDate: string;
  paid_at?: string | null;
}

export interface CreateVnpayPaymentPayload {
  booking_id: number;
  method: VnpayPaymentMethod;
  amount?: number;
  orderInfo?: string;
  returnUrl?: string;
}

export interface CreateVnpayPaymentResult {
  payment_id: number;
  txnRef: string;
  paymentUrl: string;
  status: PaymentStatus;
  expireAt: string;
}

export interface VnpayPaymentCallbackResult {
  isValidSignature: boolean;
  isSuccess: boolean;
  txnRef: string;
  responseCode: string;
  message: string;
  status?: PaymentStatus;
}

export const useVnpayStore = create<{
  payments: VnpayPayment[];
  selectedPayment: VnpayPayment | null;
  latestCreateResult: CreateVnpayPaymentResult | null;
  callbackResult: VnpayPaymentCallbackResult | null;
  isFetchingPayments: boolean;
  isFetchingPayment: boolean;
  isCreatingPayment: boolean;
  isVerifyingCallback: boolean;
  fetchAllPayments: () => Promise<void>;
  fetchPaymentById: (paymentId: number) => Promise<void>;
  createPaymentUrl: (payload: CreateVnpayPaymentPayload) => Promise<CreateVnpayPaymentResult | null>;
  verifyVnpayReturn: (query: Record<string, string>) => Promise<VnpayPaymentCallbackResult | null>;
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
      const response = await _axios.get<VnpayPayment[]>('/v1/VnpayPayment/get-all');
      set({ payments: response.data ?? [] });
    } catch (error) {
      console.error('Error fetching VNPAY payments:', error);
    } finally {
      set({ isFetchingPayments: false });
    }
  },

  fetchPaymentById: async (paymentId: number) => {
    try {
      set({ isFetchingPayment: true });
      const response = await _axios.get<VnpayPayment>(`/v1/VnpayPayment/get/${paymentId}`);
      set({ selectedPayment: response.data ?? null });
    } catch (error) {
      console.error(`Error fetching VNPAY payment ${paymentId}:`, error);
      set({ selectedPayment: null });
    } finally {
      set({ isFetchingPayment: false });
    }
  },

  createPaymentUrl: async (payload: CreateVnpayPaymentPayload) => {
    try {
      set({ isCreatingPayment: true });
      const response = await _axios.post<CreateVnpayPaymentResult>('/v1/VnpayPayment/create-url', {
        booking_id: payload.booking_id,
        method: payload.method,
        amount: payload.amount,
        orderInfo: payload.orderInfo,
        returnUrl: payload.returnUrl,
      });

      const result = response.data;
      set({ latestCreateResult: result });
      return result;
    } catch (error) {
      console.error('Error creating VNPAY payment URL:', error);
      return null;
    } finally {
      set({ isCreatingPayment: false });
    }
  },

  verifyVnpayReturn: async (query: Record<string, string>) => {
    try {
      set({ isVerifyingCallback: true });
      const params = new URLSearchParams(query).toString();
      const response = await _axios.get<VnpayPaymentCallbackResult>(`/v1/VnpayPayment/vnpay-return?${params}`);
      const result = response.data;

      set({ callbackResult: result });
      return result;
    } catch (error) {
      console.error('Error verifying VNPAY return:', error);
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
