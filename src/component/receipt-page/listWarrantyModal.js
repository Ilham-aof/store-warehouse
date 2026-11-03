"use client";
import { Modal, Separator } from "@heroui/react";
import { ShieldCogCorner, Shield } from "lucide-react";

export function ListWarrantyModal({ isOpen, receipt, onClose }) {
  function getWarrantyStatus(warrantyUntil) {
    if (!warrantyUntil) return "Belum Aktif";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiryDate = new Date(warrantyUntil);
    expiryDate.setHours(0, 0, 0, 0);

    return today <= expiryDate ? "Aktif" : "Expired";
  }
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
                  <ShieldCogCorner size={30} />
                  <h1 className="text-2xl font-bold">Daftar Garansi</h1>
                </div>
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="space-y-3 text-black">
              {receipt && (
                <>
                  {receipt.serviceItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex w-8 justify-center">
                        <span className="font-bold">{index + 1}</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-1 text-sm text-muted">
                          <Shield size={15} />
                          <span>Garansi: {item.warrantyDays} Hari</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            getWarrantyStatus(item.warrantyUntil) === "Aktif"
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {item.warrantyDays === 0
                            ? "Tidak Bergaransi"
                            : getWarrantyStatus(item.warrantyUntil)}
                        </p>

                        {item.warrantyUntil && (
                          <p className="text-xs text-muted">
                            s/d{" "}
                            {new Date(item.warrantyUntil).toLocaleDateString(
                              "id-ID",
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
