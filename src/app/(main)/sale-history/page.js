import { getOutlet } from "@/app/action/outlet/getOutlet";
import { SaleHistoryList } from "@/component/sale-history-page/saleHistoryList";
import { getDataSaleReceipt } from "@/app/action/saleReceipt/getSaleReceipt";

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

  const pageNumber = Math.max(1, Number(params.page) || 1);
  const pageSize = 20;

  const customStartDate = params.startDate ?? null;
  const customEndDate = params.endDate ?? null;

  const saleReceiptList = await getDataSaleReceipt(
    outletId,
    search,
    timeFilter,
    pageNumber,
    pageSize,
    customStartDate,
    customEndDate,
  );

  return (
    <main className="bg-white rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 p-4 w-full space-y-5">
      <SaleHistoryList
        outlets={outlets}
        receipts={saleReceiptList.receipts}
        selectedOutletId={outletId}
        timeFilter={timeFilter}
        currentPage={saleReceiptList.currentPage}
        totalPages={saleReceiptList.totalPages}
        totalItems={saleReceiptList.totalItems}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
      />
    </main>
  );
}
