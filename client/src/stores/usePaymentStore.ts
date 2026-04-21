import { create } from 'zustand';
import { _axios } from '@/lib/axios';

export type PaymentMethod = 'VNPAYQR' | 'VNBANK';
export type PaymentStatus = 'Pending' | 'Success' | 'Failed' | 'Refunded';

export interface Payment {
  payment_id: number;
  booking_id: number;
  amount: number;
  method: PaymentMethod;
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
  refund_code?: string | null;
  refund_at?: string | null;
}

export interface CreatePaymentPayload {
  booking_id: number;
  method: PaymentMethod;
  amount?: number;
  orderInfo?: string;
  returnUrl?: string;
}

export interface CreatePaymentResult {
  payment_id: number;
  txnRef: string;
  paymentUrl: string;
  status: PaymentStatus;
  expireAt: string;
}

export interface PaymentCallbackResult {
  isValidSignature: boolean;
  isSuccess: boolean;
  txnRef: string;
  responseCode: string;
  message: string;
  status?: PaymentStatus;
}

export const usePaymentStore = create<{
  payments: Payment[];
  selectedPayment: Payment | null;
  latestCreateResult: CreatePaymentResult | null;
  callbackResult: PaymentCallbackResult | null;
  isFetchingPayments: boolean;
  isFetchingPayment: boolean;
  isCreatingPayment: boolean;
  isVerifyingCallback: boolean;
  fetchAllPayments: () => Promise<void>;
  fetchPaymentById: (paymentId: number) => Promise<void>;
  createPaymentUrl: (payload: CreatePaymentPayload) => Promise<CreatePaymentResult | null>;
  verifyVnpayReturn: (query: Record<string, string>) => Promise<PaymentCallbackResult | null>;
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
      const response = await _axios.get<Payment[]>('/v1/payment/get-all');
      set({ payments: response.data ?? [] });
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      set({ isFetchingPayments: false });
    }
  },

  fetchPaymentById: async (paymentId: number) => {
    try {
      set({ isFetchingPayment: true });
      const response = await _axios.get<Payment>(`/v1/payment/get/${paymentId}`);
      set({ selectedPayment: response.data ?? null });
    } catch (error) {
      console.error(`Error fetching payment ${paymentId}:`, error);
      set({ selectedPayment: null });
    } finally {
      set({ isFetchingPayment: false });
    }
  },

  createPaymentUrl: async (payload: CreatePaymentPayload) => {
    try {
      set({ isCreatingPayment: true });
      const response = await _axios.post<CreatePaymentResult>('/v1/payment/create-url', {
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
      console.error('Error creating payment URL:', error);
      return null;
    } finally {
      set({ isCreatingPayment: false });
    }
  },

  verifyVnpayReturn: async (query: Record<string, string>) => {
    try {
      set({ isVerifyingCallback: true });
      const params = new URLSearchParams(query).toString();
      const response = await _axios.get<PaymentCallbackResult>(`/v1/payment/vnpay-return?${params}`);
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
