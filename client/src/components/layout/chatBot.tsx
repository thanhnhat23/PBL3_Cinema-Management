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
import { Send, Trash2 } from "lucide-react";

function TypingIndicator() {
    return (
        <div className="w-fit rounded-2xl rounded-tl-md bg-neutral-100 px-3 py-2 text-neutral-600 dark:bg-white/8 dark:text-white/70">
            <div className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-current opacity-50 animate-bounce [animation-delay:-0.2s]" />
                <span className="h-1 w-1 rounded-full bg-current opacity-70 animate-bounce [animation-delay:-0.1s]" />
                <span className="h-1 w-1 rounded-full bg-current opacity-90 animate-bounce" />
            </div>
        </div>
    );
}

export default function ChatBot() {
    const [message, setMessage] = useState("");
    const { messages, isSending, sendMessage } = useChatBotStore();
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        listRef.current?.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const handleSend = async () => {
        const trimmed = message.trim();
        if (!trimmed || isSending) return;

        setMessage("");
        await sendMessage(trimmed);
    };

    return (
        <div className="fixed bottom-12 right-12 z-50">
            <Popover>
                    <Tooltip side="bottom" align="center" sideOffset={8}>
                        <TooltipTrigger>
                            <PopoverTrigger asChild>
                                <button className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white shadow-lg hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                    <Bot size={24} animateOnHover/>
                                </button>
                            </PopoverTrigger>
                        </TooltipTrigger>

                        <TooltipContent>
                            <p>Trợ lí Milkywayyy</p>
                        </TooltipContent>
                    </Tooltip>

                <PopoverContent
                    side="top"
                    align="end"
                    sideOffset={12}
                    className="h-140 w-100 border border-neutral-200 bg-white p-0 text-neutral-900 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                >
                    <div className="flex flex-col h-1/8 items-start justify-center border-b border-neutral-200 px-4 py-3 dark:border-white/10">
                        <p className="flex gap-2 text-sm font-semibold items-center">
                            <Bot size={16} />
                            Milky Wayyy đây!
                        </p>

                        <p className="text-[11px] text-neutral-500 dark:text-white/55">Trợ lí hỗ trợ rạp chiếu phim</p>
                    </div>

                    <div
                        ref={listRef}
                        className="flex h-6/8 flex-col gap-4 overflow-y-auto px-3 py-3 text-sm"
                    >
                        {messages.length === 0 ? (
                            <div className="rounded-2xl rounded-tl-xs bg-neutral-100 px-3 py-2 text-neutral-700 dark:bg-white/8 dark:text-white/70 border-1 border-neutral-300 dark:border-white/20">
                                Xin chào, tôi có thể giúp bạn tìm phim, xem lịch chiếu hoặc hỗ trợ đặt vé.
                            </div>
                        ) : (
                            messages.map((item) => (
                                <div
                                    key={item.id}
                                    className={`max-w-[85%] rounded-2xl px-3 py-2 leading-relaxed border-1 ${
                                        item.role === 'user'
                                            ? 'ml-auto rounded-tr-xs bg-primary text-primary-foreground'
                                            : 'rounded-tl-xs bg-neutral-100 text-neutral-800 dark:bg-white/8 dark:text-white/90'
                                    }`}
                                >
                                    {item.role === 'assistant' ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ children }) => (
                                                    <p className="mb-2 last:mb-0">{children}</p>
                                                ),
                                                ul: ({ children }) => (
                                                    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
                                                ),
                                                ol: ({ children }) => (
                                                    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
                                                ),
                                                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                                strong: ({ children }) => (
                                                    <strong className="font-semibold text-neutral-900 dark:text-white">{children}</strong>
                                                ),
                                                em: ({ children }) => <em className="italic text-inherit">{children}</em>,
                                                a: ({ children, href }) => (
                                                    <a
                                                        href={href}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-700 underline decoration-blue-500/50 underline-offset-2 hover:text-blue-800 dark:text-sky-300 dark:decoration-sky-300/60 dark:hover:text-sky-200"
                                                    >
                                                        {children}
                                                    </a>
                                                ),
                                                code: ({ children }) => (
                                                    <code className="rounded-md bg-black/5 px-1.5 py-0.5 font-mono text-[0.85em] text-neutral-800 dark:bg-white/10 dark:text-white">
                                                        {children}
                                                    </code>
                                                ),
                                                blockquote: ({ children }) => (
                                                    <blockquote className="border-l-2 border-neutral-300 pl-3 text-neutral-600 dark:border-white/20 dark:text-white/75">
                                                        {children}
                                                    </blockquote>
                                                ),
                                                br: () => <br />,
                                            }}
                                        >
                                            {item.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <span>{item.content}</span>
                                    )}
                                </div>
                            ))
                        )}

                        {isSending ? (
                            <TypingIndicator />
                        ) : null}
                    </div>

                    <div className="min-h-1/8 border-t border-neutral-200 p-3 dark:border-white/10">
                        <div className="flex items-end gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                            <textarea
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' && !event.shiftKey) {
                                        event.preventDefault();
                                        void handleSend();
                                    }
                                }}
                                rows={1}
                                placeholder="Nhập tin nhắn..."
                                className="h-5 max-h-28 flex-1 resize-none border-0 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white dark:placeholder:text-white/35"
                            />

                            <button
                                type="button"
                                onClick={() => void handleSend()}
                                disabled={!message.trim() || isSending}
                                className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition enabled:hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Gửi tin nhắn"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}