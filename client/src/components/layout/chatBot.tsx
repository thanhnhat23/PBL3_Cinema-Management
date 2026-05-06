import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { useChatBotStore } from "@/stores/useChatBot";
import { Bot } from "../icons/bot";
import { Send, Sparkles } from "lucide-react";

function TypingIndicator() {
    return (
        <div className="w-fit rounded-2xl rounded-bl-md bg-neutral-100 px-4 py-2.5 text-neutral-600 dark:bg-white/5 dark:text-white/50 border-1 border-neutral-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" />
            </div>
        </div>
    );
}

function formatChatTimestamp(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export default function ChatBot() {
    const [message, setMessage] = useState("");
    const { messages, isSending, sendMessage } = useChatBotStore();
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, isSending]);

    const handleSend = async () => {
        const trimmed = message.trim();
        if (!trimmed || isSending) return;
        setMessage("");
        await sendMessage(trimmed);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <Popover>
                <Tooltip side="left" align="center" sideOffset={12}>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <button className="group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-1 border-zinc-200 bg-sidebar text-sidebar-foreground shadow-lg transition-all hover:scale-110 active:scale-95 dark:border-neutral-800">
                                <Bot size={28} animation={isSending ? "thinking" : "blink"} animate={true} />
                                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900">
                                    <Sparkles size={8} fill="currentColor" />
                                </div>
                            </button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-neutral-900 text-white border-1 border-black dark:border-neutral-800">
                        <p className="font-medium">Hỏi Milky Wayyy</p>
                    </TooltipContent>
                </Tooltip>

                <PopoverContent
                    side="top"
                    align="end"
                    sideOffset={16}
                    className="flex h-130 w-95 flex-col overflow-hidden rounded-sm border-1 border-zinc-200 bg-sidebar p-0 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:border-zinc-800"
                >
                    {/* Header */}
                    <div className="relative border-b-1 border-neutral-100 bg-sidebar p-3 text-sidebar-foreground dark:border-white/10">
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white">
                                    <Bot size={22} animation={isSending ? "thinking" : "blink"} animate={true} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold leading-none tracking-tight">Milky Wayyy</h3>
                                    <p className="mt-1 text-[10px] font-medium text-neutral-400 flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Đang trực tuyến
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div
                        ref={listRef}
                        className="flex-1 overflow-y-auto bg-neutral-50/50 p-4 dark:bg-transparent custom-scrollbar space-y-4"
                    >
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
                                <div className="p-4 rounded-full bg-neutral-100 dark:bg-white/5">
                                    <Bot size={40} className="text-neutral-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Xin chào!</p>
                                    <p className="text-xs px-10 leading-relaxed">Tôi là Milky Wayyy. Bạn cần tìm phim, lịch chiếu hay hỗ trợ gì không?</p>
                                </div>
                            </div>
                        ) : (
                            messages.map((item, index) => (
                                <div key={item.id || index} className={`flex flex-col ${item.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-end gap-2 max-w-[85%] group">
                                        {item.role === 'assistant' && (
                                            <div className="h-6 w-6 rounded-lg bg-neutral-200 dark:bg-white/10 flex items-center justify-center shrink-0 mb-1">
                                                <Bot size={14} />
                                            </div>
                                        )}

                                        <div className={`flex flex-col gap-1 ${item.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div
                                                className={`px-4 py-2.5 text-sm shadow-sm transition-all ${item.role === 'user'
                                                        ? 'rounded-2xl rounded-tr-none bg-zinc-900 text-white font-medium dark:bg-white dark:text-zinc-900'
                                                        : 'rounded-2xl rounded-tl-none bg-white text-neutral-800 border-1 border-neutral-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800'
                                                    }`}
                                            >
                                                {item.role === 'assistant' ? (
                                                    <div className="markdown-content">
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm]}
                                                            components={{
                                                                p: ({ children }) => <p className="leading-relaxed mb-2 last:mb-0">{children}</p>,
                                                                ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2">{children}</ul>,
                                                                li: ({ children }) => <li className="text-[13px]">{children}</li>,
                                                                strong: ({ children }) => <strong className="font-bold text-red-500 dark:text-red-400">{children}</strong>,
                                                            }}
                                                        >
                                                            {item.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    <p className="whitespace-pre-wrap">{item.content}</p>
                                                )}
                                            </div>
                                            <span className="text-[9px] text-neutral-400 px-1 uppercase font-bold tracking-tighter">
                                                {formatChatTimestamp(item.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {isSending && <TypingIndicator />}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-sidebar border-t-1 border-neutral-100 dark:border-white/5">
                        <div className="relative flex items-center bg-neutral-100 dark:bg-white/5 rounded-2xl border-1 border-transparent focus-within:border-zinc-500/30 focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all shadow-inner">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        void handleSend();
                                    }
                                }}
                                rows={1}
                                placeholder="Hỏi tôi bất cứ điều gì..."
                                className="w-full bg-transparent px-4 py-3 text-sm outline-none resize-none min-h-[44px] max-h-32 custom-scrollbar"
                            />
                            <div className="flex items-center gap-1 pr-2">
                                <button
                                    onClick={() => void handleSend()}
                                    disabled={!message.trim() || isSending}
                                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white transition-all enabled:hover:bg-black enabled:active:scale-90 disabled:opacity-30 disabled:grayscale dark:bg-white dark:text-zinc-900"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                        <p className="mt-2 text-center text-[9px] text-neutral-400">
                            Milky Wayyy có thể đưa ra thông tin không chính xác.
                        </p>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}