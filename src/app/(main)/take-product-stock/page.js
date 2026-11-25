import { getOutlet } from "@/app/action/outlet/getOutlet";
import { ProductStockForm } from "@/component/add-product-stock-page/productStockForm";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const outlets = await getOutlet();
  const selectedOutletId = params.outletId ?? outlets[0]?.id ?? null;
  return (
    <main className="w-full">
      <ProductStockForm
        outlets={outlets}
        selectedOutletId={selectedOutletId}
        mode="out"
      />
    </main>
  );
}
