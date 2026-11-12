"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function bulkStockOutAction(prevState, formData) {
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

  const outletId = formData.get("outletId");
  const mutationType = formData.get("mutationType");
  const targetOutlet = formData.get("targetOutlet");
  const redirectTo = formData.get("redirectTo");
  const rawItems = formData.get("items");

  if (!outletId) {
    return {
      success: false,
      error: "Cabang tidak ditemukan",
    };
  }

  if (!rawItems) {
    return {
      success: false,
      error: "Daftar produk masih kosong",
    };
  }

  let items;

  try {
    items = JSON.parse(rawItems);
  } catch {
    return {
      success: false,
      error: "Format daftar produk tidak valid",
    };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return {
      success: false,
      error: "Daftar produk masih kosong",
    };
  }

  const seenProductIds = new Set();

  for (const item of items) {
    if (typeof item.productId !== "string" || !item.productId.trim()) {
      return {
        success: false,
        error: "Terdapat produk yang tidak valid",
      };
    }

    if (seenProductIds.has(item.productId)) {
      return {
        success: false,
        error: "Terdapat produk duplikat dalam daftar",
      };
    }

    seenProductIds.add(item.productId);

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return {
        success: false,
        error: "Jumlah setiap produk harus berupa bilangan bulat lebih dari 0",
      };
    }
  }

  if (mutationType === "TRANSFER") {
    if (!targetOutlet) {
      return {
        success: false,
        error: "Cabang asal wajib dipilih untuk transfer",
      };
    }

    if (outletId === targetOutlet) {
      return {
        success: false,
        error: "Cabang asal tidak boleh sama dengan cabang penerima",
      };
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          id: { in: items.map((item) => item.productId) },
          outletId,
        },
        select: {
          id: true,
          quantity: true,
        },
      });

      if (products.length !== items.length) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      for (const item of items) {
        const product = products.find(
          (product) => product.id === item.productId,
        );

        if (product.quantity < item.quantity) {
          throw new Error("INSUFFICIENT_STOCK");
        }
      }

      if (mutationType === "TRANSFER") {
        const sourceOutlet = await tx.outlet.findUnique({
          where: { id: targetOutlet },
          select: { id: true },
        });

        if (!sourceOutlet) {
          throw new Error("SOURCE_OUTLET_NOT_FOUND");
        }
      }

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
            type: mutationType,
            sendTo: mutationType === "TRANSFER" ? targetOutlet : null,
          },
        });
      }
    });
  } catch (error) {
    console.log("error : ", error);
    if (error.message === "PRODUCT_NOT_FOUND") {
      return {
        success: false,
        error: "Ada produk yang tidak ditemukan di outlet terpilih",
      };
    }

    if (error.message === "INSUFFICIENT_STOCK") {
      return {
        success: false,
        error: "Stok produk tidak mencukupi",
      };
    }

    if (error.message === "SOURCE_OUTLET_NOT_FOUND") {
      return {
        success: false,
        error: "Outlet asal tidak ditemukan",
      };
    }

    return {
      success: false,
      error: "Gagal mengambil stok produk",
    };
  }

  const destination =
    redirectTo === "/take-product-stock"
      ? `/take-product-stock?outletId=${outletId}`
      : `/?outletId=${outletId}`;

  revalidatePath(destination);
  return {
    success: true,
    error: null,
  };
}
