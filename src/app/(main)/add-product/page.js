import { getOutlet } from "@/app/action/outlet/getOutlet";
import { AddProductForm } from "@/component/add-product-page/addProductForm";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const outlets = await getOutlet();
  const selectedOutletId = params.outletId ?? outlets[0]?.id ?? null;
  return (
    <main className="w-full">
      <AddProductForm outlets={outlets} selectedOutletId={selectedOutletId} />
    </main>
  );
}
