import { getOutlet } from "@/app/action/outlet/getOutlet";
import { ReceiptList } from "@/component/receipt-page/receiptList";
import { getDataServiceReceipt } from "@/app/action//serviceReceipt/getServiceReceipt";

export default async function page({ searchParams }) {
  const params = await searchParams;
  const outlets = await getOutlet();

  const selectedOutletId = params.outletId ?? outlets[0]?.id ?? null;
  const receipts = await getDataServiceReceipt(selectedOutletId);

  return (
    <main className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 w-full space-y-5">
      <ReceiptList
        outlets={outlets}
        receipts={receipts}
        selectedOutletId={selectedOutletId}
      />
    </main>
  );
}
