import { getOutlet } from "@/app/action/outlet/getOutlet";
import { getProductHistory } from "@/app/action/product/getProductHistory";
import { ProductHistoryList } from "@/component/history-page/productHistoryList";

export default async function page({ searchParams }) {
  const params = await searchParams;
  const outlets = await getOutlet();

  const outletId = params.outletId ?? outlets[0]?.id ?? null;

  const timeFilter = ["all", "today", "week", "month"].includes(
    params.timeFilter,
  )
    ? params.timeFilter
    : "all";
  const pageNumber = Math.max(1, Number(params.page) || 1);
  const pageSize = 20;
  const historyList = await getProductHistory(
    outletId,
    timeFilter,
    pageNumber,
    pageSize,
  );

  return (
    <main className="bg-white rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 p-4 w-full space-y-5">
      <ProductHistoryList
        outlets={outlets}
        history={historyList.history}
        selectedOutletId={outletId}
        timeFilter={timeFilter}
        currentPage={historyList.currentPage}
        totalPages={historyList.totalPages}
        totalItems={historyList.totalItems}
      />
    </main>
  );
}
