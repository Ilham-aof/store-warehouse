import { getOutlet } from "@/app/action/outlet/getOutlet";
import { CashierForm } from "@/component/cashier-page/cashierForm";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const outlets = await getOutlet();
  const selectedOutletId = params.outletId ?? outlets[0]?.id ?? null;
  return (
    <main className="w-full">
      <CashierForm outlets={outlets} selectedOutletId={selectedOutletId} />
    </main>
  );
}
