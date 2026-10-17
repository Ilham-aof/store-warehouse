import { getDataProduct } from "@/app/action//product/getDataProduct";
import { getBestSeller } from "@/app/action//product/getBestSeller";

import { StockBarang } from "@/component/dashboard-page/stockBarang";
import { getOutlet } from "@/app/action/outlet/getOutlet";

export default async function Home({ searchParams }) {
  const params = await searchParams;

  const outlets = await getOutlet();

  const outletId = params.outletId ?? outlets[0]?.id ?? null;

  const search = params.search ?? "";
  const pageNumber = Math.max(1, Number(params.page) || 1);
  const pageSize = 20;
  const productList = await getDataProduct(
    outletId,
    search,
    pageNumber,
    pageSize,
  );
  const bestSellers = await getBestSeller(outletId);
  return (
    <main className="bg-white rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-300 p-4 w-full space-y-5">
      <StockBarang
        outlets={outlets}
        products={productList.products}
        selectedOutletId={outletId}
        bestSellers={bestSellers}
        totalItems={productList.totalItems}
        totalPages={productList.totalPages}
      />
    </main>
  );
}
