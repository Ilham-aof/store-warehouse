import { getOutlet } from "@/app/action/outlet/getOutlet";
import { getTotalSaleReceipt } from "@/app/action/saleReceipt/getTotalSaleReceipt";
import { getTotalServiceReceipt } from "@/app/action/serviceReceipt/getTotalFinishReceipt";
import { getStockInProduct } from "@/app/action/product/getStockInProduct";
import { getStockOutProduct } from "@/app/action/product/getStockOutProduct";

import { TransactionChart } from "@/component/transaction-chart-page/transactionChart";

export default async function page({ searchParams }) {
  const params = await searchParams;
  const outlets = await getOutlet();

  const outletId = params.outletId ?? outlets[0]?.id ?? null;

  const timeFilter = ["7days", "thisMonth", "thisYear"].includes(
    params.timeFilter,
  )
    ? params.timeFilter
    : "7days";

  const serviceReceipt = await getTotalServiceReceipt(outletId, timeFilter);

  const saleReceipt = await getTotalSaleReceipt(outletId, timeFilter);

  const stockIns = await getStockInProduct(outletId, timeFilter);
  const stockOuts = await getStockOutProduct(outletId, timeFilter);

  return (
    <main className="bg-white rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 p-4 w-full space-y-5">
      <TransactionChart
        outlets={outlets}
        selectedOutletId={outletId}
        timeFilter={timeFilter}
        serviceReceipt={serviceReceipt}
        saleReceipt={saleReceipt}
        stockIns={stockIns}
        stockOuts={stockOuts}
      />
    </main>
  );
}
