import { getOutlet } from "@/app/action/outlet/getOutlet";
import { ReceiptHistoryList } from "@/component/receipt-history-page/receiptHistoryList";
import { getFinishReceipt } from "@/app/action/serviceReceipt/getFinishReceipt";

export default async function page({ searchParams }) {
  const params = await searchParams;
  const outlets = await getOutlet();

  const outletId = params.outletId ?? outlets[0]?.id ?? null;
  const search = params.search ?? "";
  const timeFilter = ["all", "today", "week", "month"].includes(
    params.timeFilter,
  )
    ? params.timeFilter
    : "all";

  const warrantyFilter = ["all", "active", "expired", "noWarranty"].includes(
    params.warrantyFilter,
  )
    ? params.warrantyFilter
    : "all";
  const pageNumber = Math.max(1, Number(params.page) || 1);
  const pageSize = 20;

  const finishReceiptList = await getFinishReceipt(
    outletId,
    search,
    timeFilter,
    warrantyFilter,
    pageNumber,
    pageSize,
  );

  return (
    <main className="bg-white rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 w-full space-y-5">
      <ReceiptHistoryList
        outlets={outlets}
        receipts={finishReceiptList.receipts}
        selectedOutletId={outletId}
        timeFilter={timeFilter}
        warrantyFilter={warrantyFilter}
        currentPage={finishReceiptList.currentPage}
        totalPages={finishReceiptList.totalPages}
        totalItems={finishReceiptList.totalItems}
      />
    </main>
  );
}
