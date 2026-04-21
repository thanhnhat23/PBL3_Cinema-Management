import { create } from 'zustand';
import { _axios } from '@/lib/axios';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
	id: string;
	role: ChatRole;
	content: string;
	createdAt: string;
}

interface ChatApiData {
	reply: string;
	ExtractedInfo?: Record<string, string>;
	isInfoComplete?: boolean;
}

interface SendMessageResponse {
	Message: string;
	Data: ChatApiData;
}

export const useChatBotStore = create<{
	messages: ChatMessage[];
	isSending: boolean;
	extractedInfo: Record<string, string>;
	isInfoComplete: boolean;
	sendMessage: (message: string) => Promise<void>;
	clearChat: () => void;
}>((set) => ({
	messages: [],
	isSending: false,
	extractedInfo: {},
	isInfoComplete: false,

	sendMessage: async (message: string) => {
		const trimmed = message.trim();
		if (!trimmed) return;

		const userMessage: ChatMessage = {
			id: `u-${Date.now()}`,
			role: 'user',
			content: trimmed,
			createdAt: new Date().toISOString(),
		};

		set((state) => ({
			isSending: true,
			messages: [...state.messages, userMessage],
		}));

		try {
			const response = await _axios.post<SendMessageResponse>('/v1/chat/message', {
				message: trimmed,
			});

			const data = response.data?.Data;
			if (!data?.reply) return;

			const botMessage: ChatMessage = {
				id: `a-${Date.now()}`,
				role: 'assistant',
				content: data.reply,
				createdAt: new Date().toISOString(),
			};

			set((state) => ({
				messages: [...state.messages, botMessage],
				extractedInfo: data.ExtractedInfo ?? state.extractedInfo,
				isInfoComplete: data.isInfoComplete ?? state.isInfoComplete,
			}));
		} catch (error) {
			console.error('Error sending chat message:', error);

			const fallbackMessage: ChatMessage = {
				id: `e-${Date.now()}`,
				role: 'assistant',
				content: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.',
				createdAt: new Date().toISOString(),
			};

			set((state) => ({
				messages: [...state.messages, fallbackMessage],
			}));
		} finally {
			set({ isSending: false });
		}
	},

	clearChat: () =>
		set({
			messages: [],
			extractedInfo: {},
			isInfoComplete: false,
		}),
}));

