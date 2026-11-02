"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createSaleReceiptAction(prevState, formData) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.expiresAt < new Date()) {
    cookieStore.delete("session");
    redirect("/login");
  }

  const outlet = formData.get("outletId");
  const redirectTo = formData.get("redirectTo");
  const rawItems = formData.get("items");

  if (!outlet) {
    return {
      success: false,
      error: "Cabang tidak ditemukan.",
    };
  }

  if (!rawItems) {
    return {
      success: false,
      error: "Daftar produk masih kosong.",
    };
  }

  let items;

  try {
    items = JSON.parse(rawItems);
  } catch {
    return {
      success: false,
      error: "Format daftar produk tidak valid.",
    };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return {
      success: false,
      error: "Daftar produk masih kosong.",
    };
  }

  const seenProductIds = new Set();

  for (const item of items) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return {
        success: false,
        error: "Format produk tidak valid.",
      };
    }
    if (seenProductIds.has(item.productId)) {
      return {
        success: false,
        error: "Terdapat produk duplikat dalam daftar.",
      };
    }

    seenProductIds.add(item.productId);

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return {
        success: false,
        error: "Jumlah setiap produk harus berupa bilangan bulat lebih dari 0.",
      };
    }
  }

  const now = new Date();

  const dateString = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .replaceAll("-", "");

  let receiptId;

  try {
    await prisma.$transaction(async (tx) => {
      const outletData = await tx.outlet.findUnique({
        where: { id: outlet },
        select: { id: true, code: true },
      });

      if (!outletData) {
        throw new Error("OUTLET_NOT_FOUND");
      }

      const counter = await tx.saleReceiptCounter.upsert({
        where: {
          outletId_date: {
            outletId: outlet,
            date: dateString,
          },
        },
        create: {
          outletId: outlet,
          date: dateString,
          lastNumber: 1,
        },
        update: {
          lastNumber: { increment: 1 },
        },
      });

      const sequence = String(counter.lastNumber).padStart(4, "0");

      const invoiceNumber = `TRX-${outletData.code}-${dateString}-${sequence}`;

      const products = await tx.product.findMany({
        where: {
          id: {
            in: items.map((item) => item.productId),
          },
          outletId: outlet,
        },
        select: {
          id: true,
          name: true,
          barcode: true,
          price: true,
          quantity: true,
        },
      });

      if (products.length !== items.length) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const productMap = new Map(
        products.map((product) => [product.id, product]),
      );

      let totalAmount = 0;

      for (const item of items) {
        const product = productMap.get(item.productId);

        if (product.quantity < item.quantity) {
          throw new Error("INSUFFICIENT_STOCK");
        }

        totalAmount += product.price * item.quantity;
      }

      const receipt = await tx.saleReceipt.create({
        data: {
          invoiceNumber,
          totalAmount,
          outletId: outlet,
          userId: session.userId,

          saleItems: {
            create: items.map((item) => ({
              productId: productMap.get(item.productId).id,
              productName: productMap.get(item.productId).name,
              productBarcode: productMap.get(item.productId).barcode,
              productPrice: productMap.get(item.productId).price,
              productQuantity: item.quantity,
              subtotal: productMap.get(item.productId).price * item.quantity,
            })),
          },
        },
        select: {
          id: true,
        },
      });

      receiptId = receipt.id;

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });

        await tx.stockOut.create({
          data: {
            productId: item.productId,
            userId: session.userId,
            quantity: item.quantity,
            type: "PENJUALAN",
          },
        });
      }
    });
  } catch (error) {
    if (error.message === "OUTLET_NOT_FOUND") {
      return {
        success: false,
        error: "Cabang tidak ditemukan.",
      };
    }

    if (error.message === "PRODUCT_NOT_FOUND") {
      return {
        success: false,
        error: "Produk tidak ditemukan.",
      };
    }

    if (error.message === "INSUFFICIENT_STOCK") {
      return {
        success: false,
        error: "Stok produk tidak mencukupi.",
      };
    }
    return {
      success: false,
      error: "Gagal menambahkan stok.",
    };
  }

  revalidatePath("/cashier");
  revalidatePath("/");
  redirect(`/saleReceipt/${receiptId}`);
}
