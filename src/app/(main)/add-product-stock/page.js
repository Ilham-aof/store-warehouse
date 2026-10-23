import { getOutlet } from "@/app/action/outlet/getOutlet";
import { AddProductStockForm } from "@/component/add-product-stock-page/addProductStockForm";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const outlets = await getOutlet();
  const selectedOutletId = params.outletId ?? outlets[0]?.id ?? null;
  return (
    <main className="w-full">
      <AddProductStockForm
        outlets={outlets}
        selectedOutletId={selectedOutletId}
      />
    </main>
  );
}
