"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function stockOutAction(prevState, formData) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session || session.expiresAt < new Date()) {
    cookieStore.delete("session");
    redirect("/login");
  }

  const productId = formData.get("productId");
  const outletId = formData.get("outletId");
  const quantity = formData.get("productQuantity");
  const mutationType = formData.get("mutationOutType");
  const targetOutlet = formData.get("targetOutlet");

  if (!productId) {
    return {
      success: false,
      error: "Produk tidak ditemukan",
    };
  }

  if (!quantity) {
    return {
      success: false,
      error: "Jumlah stok wajib diisi",
    };
  }

  if (!outletId) {
    return {
      success: false,
      error: "Cabang tidak ditemukan",
    };
  }

  if (mutationType === "TRANSFER") {
    if (!targetOutlet) {
      return {
        error: "Cabang tujuan wajib dipilih untuk transfer.",
      };
    }

    if (outletId === targetOutlet) {
      return {
        error: "Cabang tujuan tidak boleh sama dengan cabang asal.",
      };
    }
  }

  const stockQuantity = Number(quantity);

  if (!Number.isInteger(stockQuantity) || stockQuantity <= 0) {
    return {
      success: false,
      error: "Jumlah stok harus berupa angka lebih dari 0.",
    };
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      quantity: true,
    },
  });

  if (!product) {
    return {
      success: false,
      error: "Produk tidak ditemukan.",
    };
  }

  if (stockQuantity > product.quantity) {
    return {
      success: false,
      error: "Stok tidak mencukupi.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          quantity: {
            decrement: stockQuantity,
          },
        },
      });

      await tx.stockOut.create({
        data: {
          productId,
          userId: session.userId,
          quantity: stockQuantity,
          type: mutationType,
          sendTo: targetOutlet,
        },
      });
    });
  } catch (error) {
    return {
      success: false,
      error: "Gagal mengurangi stok.",
    };
  }

  revalidatePath("/");
  redirect(`/?outletId=${outletId}`);
}
