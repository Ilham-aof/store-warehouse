"use client";
import { Link, Separator, Avatar } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { LogoutButton } from "@/component/dashboard-page/logoutButton";
import {
  CircleUserRound,
  Boxes,
  ChartLine,
  RefreshCw,
  Wrench,
  Settings,
  ReceiptText,
  ClipboardClock,
} from "lucide-react";

export function Sidebar({ user }) {
  const searchParams = useSearchParams();
  const outletId = searchParams.get("outletId");

  const productHistoryHref = outletId
    ? `/product-history?outletId=${outletId}`
    : "/product-history";

  const stockHref = outletId ? `/?outletId=${outletId}` : "/";

  const receiptHref = outletId ? `/order?outletId=${outletId}` : "/order";

  const receiptHistoryHref = outletId
    ? `/receipt-history?outletId=${outletId}`
    : "/receipt-history";

  return (
    <aside>
      <nav className="sticky top-0 flex flex-col h-screen w-70  shrink-0 p-4 shadow-[0_0_4px,inset_-1px_0_6px_rgba(0,0,0,0.2)] shadow-gray-300 gap-3 bg-white">
        <div className="flex items-center h-13 w-full px-4">
          <h1>Toko Saya Logo</h1>
        </div>

        <Separator variant="default" />

        <div className="flex flex-col justify-center gap-3">
          <Link
            className="no-underline gap-3 font-bold w-full px-4 py-2 rounded-full hover:bg-slate-700 hover:text-white"
            href={stockHref}
          >
            <Boxes />
            Inventaris
          </Link>
          <Link
            className="no-underline gap-3 font-bold w-full px-4 py-2 rounded-full hover:bg-slate-700 hover:text-white"
            href={productHistoryHref}
          >
            <RefreshCw />
            Mutasi Stok
          </Link>

          <Separator variant="default" />

          <Link
            className="no-underline gap-3 font-bold w-full px-4 py-2 rounded-full hover:bg-slate-700 hover:text-white"
            href={receiptHref}
          >
            <ReceiptText />
            Servis
          </Link>
          <Link
            className="no-underline gap-3 font-bold w-full px-4 py-2 rounded-full hover:bg-slate-700 hover:text-white"
            href={receiptHistoryHref}
          >
            <ClipboardClock />
            Riwayat Servis
          </Link>
          {user?.role === "Admin" && (
            <div className="flex flex-col gap-3">
              <Separator variant="default" />
              <Link
                className="no-underline gap-3 font-bold w-full px-4 py-2 rounded-full hover:bg-slate-700 hover:text-white"
                href="/admin"
              >
                <Settings />
                Pengaturan
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center px-3 py-2 space-x-3 rounded-full shadow-[2px_2px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 w-full h-fit mt-auto">
          <Avatar>
            <CircleUserRound size={40} />
          </Avatar>
          <div>
            <p className="font-bold">{user?.name ?? "None"}</p>
            <p className="text-xs">{user?.role ?? "None"}</p>
          </div>
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </div>
      </nav>
    </aside>
  );
}
