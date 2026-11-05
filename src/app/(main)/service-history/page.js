import { getOutlet } from "@/app/action/outlet/getOutlet";
import { ServiceHistoryList } from "@/component/service-history-page/serviceHistoryList";
import { getFinishReceipt } from "@/app/action/serviceReceipt/getFinishReceipt";

export default async function page({ searchParams }) {
  const params = await searchParams;
  const outlets = await getOutlet();

  const outletId = params.outletId ?? outlets[0]?.id ?? null;
  const search = params.search ?? "";
  const timeFilter = ["all", "today", "week", "month", "custom"].includes(
    params.timeFilter,
  )
    ? params.timeFilter
    : "all";

  const customStartDate = params.startDate ?? null;
  const customEndDate = params.endDate ?? null;

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
    customStartDate,
    customEndDate,
  );

  return (
    <main className="bg-white rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 p-4 w-full space-y-5">
      <ServiceHistoryList
        outlets={outlets}
        receipts={finishReceiptList.receipts}
        selectedOutletId={outletId}
        timeFilter={timeFilter}
        warrantyFilter={warrantyFilter}
        currentPage={finishReceiptList.currentPage}
        totalPages={finishReceiptList.totalPages}
        totalItems={finishReceiptList.totalItems}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
      />
    </main>
  );
}
