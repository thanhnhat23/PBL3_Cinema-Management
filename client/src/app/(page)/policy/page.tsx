'use client'

import { ShieldCheck, Eye, Lock, Share2, UserCheck, Bell } from "lucide-react";

export default function PrivacyPolicy() {
    const sections = [
        {
            icon: <ShieldCheck className="text-amber-500" size={24} />,
            title: "1. Mục đích thu thập thông tin",
            content: "Việc thu thập dữ liệu trên website MilkyWayyy bao gồm: Email, số điện thoại, tên đăng nhập, mật khẩu đăng nhập, địa chỉ khách hàng. Đây là các thông tin mà MilkyWayyy cần khách hàng cung cấp bắt buộc khi đăng ký sử dụng dịch vụ và để MilkyWayyy liên hệ xác nhận khi khách hàng đăng ký sử dụng dịch vụ trên website nhằm đảm bảo quyền lợi cho cho người tiêu dùng."
        },
        {
            icon: <Eye className="text-amber-500" size={24} />,
            title: "2. Phạm vi sử dụng thông tin",
            content: "Công ty sử dụng thông tin khách hàng cung cấp để: Cung cấp các dịch vụ đến khách hàng; Gửi các thông báo về các hoạt động trao đổi thông tin giữa khách hàng và MilkyWayyy; Ngăn ngừa các hoạt động phá hủy tài khoản người dùng của khách hàng hoặc các hoạt động giả mạo khách hàng; Liên lạc và giải quyết với khách hàng trong những trường hợp đặc biệt."
        },
        {
            icon: <Lock className="text-amber-500" size={24} />,
            title: "3. Thời gian lưu trữ thông tin",
            content: "Dữ liệu cá nhân của khách hàng sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc tự khách hàng đăng nhập và thực hiện hủy bỏ. Còn lại trong mọi trường hợp thông tin cá nhân khách hàng sẽ được bảo mật trên máy chủ của MilkyWayyy."
        },
        {
            icon: <Share2 className="text-amber-500" size={24} />,
            title: "4. Chia sẻ thông tin với bên thứ ba",
            content: "Chúng tôi cam kết không bán, chia sẻ dẫn đến làm lộ thông tin cá nhân của bạn vì mục đích thương mại. Tuy nhiên, chúng tôi có thể cung cấp thông tin cho các cơ quan chức năng nếu có yêu cầu pháp lý hoặc để bảo vệ quyền lợi chính đáng của MilkyWayyy."
        },
        {
            icon: <UserCheck className="text-amber-500" size={24} />,
            title: "5. Quyền lợi của người dùng",
            content: "Khách hàng có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bằng cách đăng nhập vào tài khoản và chỉnh sửa thông tin cá nhân hoặc yêu cầu MilkyWayyy thực hiện việc này."
        },
        {
            icon: <Bell className="text-amber-500" size={24} />,
            title: "6. Thay đổi chính sách",
            content: "Chính sách này có thể thay đổi để phù hợp với sự phát triển của dịch vụ và quy định pháp luật. Mọi thay đổi sẽ được thông báo công khai trên website của chúng tôi."
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        Privacy & Safety
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-tight">
                        Chính Sách <span className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">Bảo Mật</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
                        Tại MilkyWayyy, quyền riêng tư của bạn là ưu tiên hàng đầu. Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn một cách tuyệt đối.
                    </p>
                </div>

                {/* Content Sections */}
                <div className="grid gap-8 pt-8">
                    {sections.map((section, index) => (
                        <div 
                            key={index}
                            className="group p-8 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-xl hover:border-amber-500/30 transition-all duration-500"
                        >
                            <div className="flex items-start gap-6">
                                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                    {section.icon}
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight group-hover:text-amber-500 transition-colors">
                                        {section.title}
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Quote */}
                <div className="p-8 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center italic text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                    &ldquo;Chúng tôi tin rằng minh bạch là nền tảng của niềm tin. Mọi quy trình xử lý dữ liệu tại MilkyWayyy đều hướng tới sự an toàn cao nhất cho khách hàng.&rdquo;
                </div>
            </div>
        </div>
    );
}
