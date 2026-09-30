"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteProductAction(prevState, formData) {
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

  if (!productId) {
    return {
      success: false,
      error: "ID produk tidak ditemukan",
    };
  }

  if (!productId) {
    return {
      success: false,
      error: "Cabang tidak ditemukan",
    };
  }

  try {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
  } catch (error) {
    return {
      success: false,
      error: "Gagal menghapus produk",
    };
  }

  revalidatePath("/");
  redirect(`/?outletId=${outletId}`);
}
