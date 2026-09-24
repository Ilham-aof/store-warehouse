"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProductAction(prevState, formData) {
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
  const productName = formData.get("productName");
  const productType = formData.get("productType");
  const productBrand = formData.get("productBrand");
  const productPrice = formData.get("productPrice");

  if (!productId) {
    return {
      success: false,
      error: "ID produk tidak ditemukan.",
    };
  }

  if (!productName?.trim()) {
    return {
      success: false,
      error: "Nama wajib diisi.",
    };
  }

  if (!productType?.trim()) {
    return {
      success: false,
      error: "Type wajib diisi.",
    };
  }

  if (!productBrand?.trim()) {
    return {
      success: false,
      error: "Brand wajib diisi.",
    };
  }

  if (!productPrice) {
    return {
      success: false,
      error: "Harga wajib diisi.",
    };
  }

  try {
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: productName.trim(),
        type: productType.trim(),
        brand: productBrand.trim(),
        price: Number(productPrice),
      },
    });
  } catch (error) {
    return {
      success: false,
      error: "Gagal memperbarui produk.",
    };
  }

  revalidatePath("/");
  redirect("/");
}
