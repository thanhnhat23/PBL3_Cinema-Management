'use client'

import { Accordion, AccordionItem } from "@heroui/react";
import { Ticket, User, Gift } from "lucide-react";

export default function FAQ() {
    const faqData = [
        {
            category: "Tài khoản & Đăng ký",
            icon: <User className="text-amber-500" size={20} />,
            questions: [
                {
                    q: "Làm thế nào để đăng ký tài khoản MilkyWayyy?",
                    a: "Bạn chỉ cần nhấn vào nút Đăng nhập trên thanh công cụ, sau đó chọn 'Đăng ký ngay'. Điền đầy đủ thông tin cá nhân và xác nhận qua email để bắt đầu trải nghiệm dịch vụ."
                },
                {
                    q: "Tôi quên mật khẩu thì phải làm sao?",
                    a: "Tại Form đăng nhập, hãy chọn 'Quên mật khẩu'. Hệ thống sẽ yêu cầu bạn nhập Email và gửi một mã OTP xác nhận để bạn có thể thiết lập lại mật khẩu mới."
                },
                {
                    q: "Thông tin cá nhân của tôi có được bảo mật không?",
                    a: "Hoàn toàn bảo mật. MilkyWayyy áp dụng các tiêu chuẩn mã hóa dữ liệu cao nhất và cam kết không chia sẻ thông tin của bạn cho bất kỳ bên thứ ba nào khi chưa có sự đồng ý."
                }
            ]
        },
        {
            category: "Đặt vé & Thanh toán",
            icon: <Ticket className="text-amber-500" size={20} />,
            questions: [
                {
                    q: "Tôi có thể đặt tối đa bao nhiêu vé trong một lần giao dịch?",
                    a: "Để đảm bảo tính công bằng và tránh tình trạng đầu cơ, mỗi tài khoản được đặt tối đa 8 vé cho mỗi suất chiếu."
                },
                {
                    q: "Hệ thống hỗ trợ những phương thức thanh toán nào?",
                    a: "Chúng tôi hỗ trợ thanh toán qua các cổng phổ biến như: Ví MoMo, VNPay, thẻ ATM nội địa và các loại thẻ quốc tế (Visa, Mastercard)."
                },
                {
                    q: "Làm sao để tôi biết mình đã đặt vé thành công?",
                    a: "Sau khi thanh toán, hệ thống sẽ hiển thị mã vé QR ngay trên màn hình và đồng thời gửi thông tin chi tiết vào Email của bạn. Bạn cũng có thể kiểm tra lại trong mục 'Lịch sử đặt vé' trong Profile."
                }
            ]
        },
        {
            category: "Quy định rạp & Ưu đãi",
            icon: <Gift className="text-amber-500" size={20} />,
            questions: [
                {
                    q: "Tôi có được mang thức ăn từ ngoài vào rạp không?",
                    a: "Theo quy định chung, khách hàng vui lòng không mang thức ăn và nước uống từ bên ngoài vào rạp để đảm bảo vệ sinh và không gian chung."
                },
                {
                    q: "Làm thế nào để áp dụng mã giảm giá?",
                    a: "Tại bước thanh toán, bạn sẽ thấy ô 'Nhập mã giảm giá'. Hãy điền mã của bạn vào đó và nhấn áp dụng, hệ thống sẽ tự động trừ tiền trước khi bạn tiến hành thanh toán."
                },
                {
                    q: "Tôi cần đến rạp trước bao lâu để nhận vé?",
                    a: "Chúng tôi khuyến khích bạn nên đến rạp trước ít nhất 15-20 phút để thực hiện các thủ tục soát vé và mua bắp nước, đảm bảo không bỏ lỡ phần đầu của phim."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        Support Center
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-tight">
                        Câu Hỏi <span className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">Thường Gặp</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
                        Bạn có thắc mắc? Chúng tôi có câu trả lời. Tìm kiếm nhanh các giải đáp cho các vấn đề phổ biến nhất tại MilkyWayyy.
                    </p>
                </div>

                {/* FAQ Groups */}
                <div className="space-y-10 pt-8">
                    {faqData.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-6">
                            <div className="flex items-center gap-3 px-4 py-2 border-l-4 border-amber-500 bg-amber-500/5">
                                {group.icon}
                                <h2 className="text-lg font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                                    {group.category}
                                </h2>
                            </div>

                            <Accordion 
                                variant="splitted"
                                className="px-0"
                                itemClasses={{
                                    base: "bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-sm mb-4 last:mb-0 shadow-sm",
                                    title: "text-sm md:text-base font-bold text-zinc-800 dark:text-zinc-200",
                                    content: "text-zinc-500 dark:text-zinc-400 text-sm md:text-base pb-6 font-medium leading-relaxed",
                                    indicator: "text-amber-500"
                                }}
                            >
                                {group.questions.map((item, itemIndex) => (
                                    <AccordionItem 
                                        key={itemIndex} 
                                        aria-label={item.q} 
                                        title={item.q}
                                    >
                                        {item.a}
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>

                {/* Contact Support CTA */}
                <div className="mt-20 p-10 bg-zinc-900 dark:bg-white rounded-sm text-white dark:text-zinc-900 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-2xl font-black uppercase italic">Vẫn chưa tìm thấy câu trả lời?</h3>
                        <p className="text-zinc-400 dark:text-zinc-500 font-medium">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7.</p>
                    </div>
                    <a 
                        href="mailto:luongthanhnhat567@gmail.com" 
                        className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-sm rounded-lg transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(245,158,11,0.3)]"
                    >
                        Liên Hệ Ngay
                    </a>
                </div>
            </div>
        </div>
    );
}
