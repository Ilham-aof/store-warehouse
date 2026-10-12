import { getOutlet } from "@/app/action/outlet/getOutlet";
import { ReceiptForm } from "@/component/receipt-page/receiptForm";

export default async function page({ searchParams }) {
  const params = await searchParams;
  const outlets = await getOutlet();
  const selectedOutletId = params.outletId ?? outlets[0]?.id ?? null;

  return (
    <main className="w-full">
      <ReceiptForm outlets={outlets} selectedOutletId={selectedOutletId} />
    </main>
  );
}
