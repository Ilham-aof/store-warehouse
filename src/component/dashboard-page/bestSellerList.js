import { Card } from "@heroui/react";
import { Package, TrendingUp } from "lucide-react";

export function BestSellerList({ bestSellers }) {
  return (
    <Card className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 p-4 w-full">
      <Card.Header>
        <div className="flex items-center gap-3">
          <TrendingUp size={30} />

          <div>
            <Card.Title className="text-xl font-bold">
              Produk Terlaris
            </Card.Title>
            <Card.Description>Penjualan 30 hari terakhir</Card.Description>
          </div>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="space-y-2">
          {bestSellers.length > 0 ? (
            bestSellers.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-100"
              >
                <div className="flex w-8 justify-center">
                  <span className="font-bold">{index + 1}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{product.name}</p>

                  <div className="flex items-center gap-1 text-sm text-muted">
                    <Package size={15} />
                    <span>Stok: {product.quantity}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold">{product.soldQuantity}</p>

                  <p className="text-xs text-muted">Terjual</p>
                </div>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-muted">
              Belum ada data penjualan.
            </p>
          )}
        </div>
      </Card.Content>
    </Card>
  );
}
