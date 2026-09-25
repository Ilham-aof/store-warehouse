import { getOutlet } from "@/app/action/outlet/getOutlet";
import { getProductHistory } from "@/app/action/product/getProductHistory";
import { ProductHistoryList } from "@/component/history-page/productHistoryList";

export default async function page() {
  const outlets = await getOutlet();
  const history = await getProductHistory();

  return (
    <main className="w-full">
      <ProductHistoryList outlets={outlets} history={history} />
    </main>
  );
}
