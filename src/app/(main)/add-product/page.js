import { getOutlet } from "@/app/action/outlet/getOutlet";
import { AddProductForm } from "@/component/add-product-page/addProductForm";

export default async function Page() {
  const outlets = await getOutlet();

  return (
    <main className="w-full">
      <AddProductForm outlets={outlets} />
    </main>
  );
}
