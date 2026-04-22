import { Drama } from "lucide-react";

export default function LayoutShowtimes() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Drama />
                Dashboard: Quản lí suất chiếu
            </h1>

            {/* <DataTable /> */}
        </div>
    )
}
