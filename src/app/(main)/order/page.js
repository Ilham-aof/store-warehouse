import { getOutlet } from "@/app/action/outlet/getOutlet";
import { ReceiptList } from "@/component/receipt-page/receiptList";
import { getDataServiceReceipt } from "@/app/action//serviceReceipt/getServiceReceipt";

export default async function page({ searchParams }) {
  const params = await searchParams;
  const outlets = await getOutlet();

  const outletId = params.outletId ?? outlets[0]?.id ?? null;

  const search = params.search ?? "";
  const pageNumber = Math.max(1, Number(params.page) || 1);
  const pageSize = 20;
  const receiptList = await getDataServiceReceipt(
    outletId,
    search,
    pageNumber,
    pageSize,
  );

  return (
    <main className="bg-white rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 p-4 w-full space-y-5">
      <ReceiptList
        outlets={outlets}
        receipts={receiptList.receipts}
        selectedOutletId={outletId}
        totalItems={receiptList.totalItems}
        totalPages={receiptList.totalPages}
      />
    </main>
  );
}
