"use client";
import { Modal, Separator } from "@heroui/react";
import { Box } from "lucide-react";

export function ListProductModal({ isOpen, receipt, onClose }) {
  return (
    <>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            onClose();
          }
        }}
      >
        <Modal.Container size="lg">
          <Modal.Dialog className="space-y-3">
            <Modal.Header>
              <Modal.Heading>
                <div className="flex space-x-3 items-center">
                  <Box size={30} />
                  <h1 className="text-2xl font-bold">Daftar Produk</h1>
                </div>
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="space-y-3 text-black">
              {receipt && (
                <>
                  {receipt.saleItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1fr_auto_0.5fr]"
                    >
                      <span>{item.productName}</span>
                      <span>{item.productQuantity} pcs</span>
                      <span className="text-right">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(item.subtotal)}
                      </span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(receipt.totalAmount)}
                    </span>
                  </div>
                </>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
