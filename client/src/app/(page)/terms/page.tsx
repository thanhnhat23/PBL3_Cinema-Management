'use client'

import { BookOpen, CreditCard, AlertCircle, Scale, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function TermsOfUse() {
    const sections = [
        {
            icon: <BookOpen className="text-amber-500" size={24} />,
            title: "1. Chấp thuận các điều khoản",
            content: "Bằng cách truy cập và sử dụng website MilkyWayyy, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu tại đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng dịch vụ của chúng tôi ngay lập tức."
        },
        {
            icon: <CheckCircle2 className="text-amber-500" size={24} />,
            title: "2. Quy định đặt vé và sử dụng dịch vụ",
            content: "Khách hàng phải cung cấp thông tin cá nhân chính xác khi đăng ký thành viên. Vé đã mua qua hệ thống MilkyWayyy sẽ được xác nhận qua email. Khách hàng vui lòng xuất trình mã vé tại quầy hoặc máy soát vé để được vào phòng chiếu."
        },
        {
            icon: <CreditCard className="text-amber-500" size={24} />,
            title: "3. Chính sách thanh toán và hoàn tiền",
            content: "Tất cả các giao dịch thanh toán trên website đều được thực hiện thông qua các cổng thanh toán uy tín. Vé đã mua thành công KHÔNG ĐƯỢC hoàn tiền hoặc đổi trả, trừ trường hợp suất chiếu bị hủy từ phía MilkyWayyy."
        },
        {
            icon: <ShieldAlert className="text-amber-500" size={24} />,
            title: "4. Trách nhiệm của người dùng",
            content: "Người dùng không được phép sử dụng bất kỳ công cụ, phần mềm nào để can thiệp vào hệ thống hoặc làm thay đổi cấu trúc dữ liệu. Nghiêm cấm mọi hành vi phát tán thông tin độc hại, trái với thuần phong mỹ tục hoặc vi phạm pháp luật Việt Nam."
        },
        {
            icon: <AlertCircle className="text-amber-500" size={24} />,
            title: "5. Quyền sở hữu trí tuệ",
            content: "Tất cả nội dung trên website bao gồm thiết kế, logo, văn bản, hình ảnh đều thuộc sở hữu của MilkyWayyy. Mọi hành vi sao chép, trích dẫn mà không có sự đồng ý bằng văn bản của chúng tôi đều được coi là vi phạm."
        },
        {
            icon: <Scale className="text-amber-500" size={24} />,
            title: "6. Giải quyết tranh chấp",
            content: "Mọi tranh chấp phát sinh từ việc sử dụng dịch vụ sẽ được ưu tiên giải quyết thông qua thương lượng. Nếu không đạt được thỏa thuận, vụ việc sẽ được đưa ra cơ quan có thẩm quyền để giải quyết theo quy định của pháp luật."
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        Usage Agreement
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-tight">
                        Điều Khoản <span className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">Sử Dụng</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
                        Chào mừng bạn đến với MilkyWayyy. Vui lòng đọc kỹ các điều khoản dưới đây để đảm bảo quyền lợi tốt nhất khi trải nghiệm dịch vụ của chúng tôi.
                    </p>
                </div>

                {/* Content Cards */}
                <div className="grid gap-6 pt-8">
                    {sections.map((section, index) => (
                        <div 
                            key={index}
                            className="relative group p-8 bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200 dark:border-white/5 rounded-sm overflow-hidden hover:border-amber-500/50 transition-all duration-300"
                        >
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 -rotate-45 translate-x-8 -translate-y-8 group-hover:bg-amber-500/10 transition-colors" />
                            
                            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                <div className="shrink-0 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl h-fit border border-zinc-100 dark:border-white/5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                    {section.icon}
                                </div>
                                <div className="space-y-3 text-left">
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
                                        {section.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final Disclaimer */}
                <div className="mt-16 p-8 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-sm text-center space-y-4">
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                        Bằng việc tiếp tục sử dụng website, bạn xác nhận rằng đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản này. MilkyWayyy có quyền cập nhật các điều khoản này bất kỳ lúc nào mà không cần báo trước.
                    </p>
                    <div className="text-amber-500 font-black text-xs tracking-widest uppercase italic">
                        © 2026 MilkyWayyy Cinema - All Rights Reserved
                    </div>
                </div>
            </div>
        </div>
    );
}
