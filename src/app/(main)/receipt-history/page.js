import { getOutlet } from "@/app/action/outlet/getOutlet";
import { ReceiptHistoryList } from "@/component/receipt-history-page/receiptHistoryList";
import { getFinishReceipt } from "@/app/action/serviceReceipt/getFinishReceipt";

export default async function page({ searchParams }) {
  const params = await searchParams;
  const outlets = await getOutlet();

  const selectedOutletId = params.outletId ?? outlets[0]?.id ?? null;
  const receipts = await getFinishReceipt(selectedOutletId);

  return (
    <main className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 w-full space-y-5">
      <ReceiptHistoryList
        outlets={outlets}
        receipts={receipts}
        selectedOutletId={selectedOutletId}
      />
    </main>
  );
}
