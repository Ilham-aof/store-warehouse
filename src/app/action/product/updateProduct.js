"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

function formatName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\b\p{L}/gu, (char) => char.toUpperCase());
}

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
  const outletId = formData.get("outletId");
  const productNameValue = formData.get("productName");
  const productName =
    typeof productNameValue === "string" ? formatName(productNameValue) : "";
  const productCategoryValue = formData.get("productCategory");
  const productCategory =
    typeof productCategoryValue === "string"
      ? formatName(productCategoryValue)
      : "";
  const productBrandValue = formData.get("productBrand");
  const productBrand =
    typeof productBrandValue === "string" ? formatName(productBrandValue) : "";
  const productPrice = formData.get("productPrice");

  if (!productId) {
    return {
      success: false,
      error: "Produk tidak ditemukan.",
    };
  }

  if (!outletId) {
    return {
      success: false,
      error: "Cabang tidak ditemukan.",
    };
  }
  if (!productName?.trim()) {
    return {
      success: false,
      errors: {
        name: "Nama wajib diisi.",
      },
    };
  }

  if (!productCategory?.trim()) {
    return {
      success: false,
      errors: {
        category: "Kategori wajib diisi.",
      },
    };
  }

  if (!productBrand?.trim()) {
    return {
      success: false,
      errors: {
        brand: "Brand wajib diisi.",
      },
    };
  }

  if (!productPrice) {
    return {
      success: false,
      errors: {
        price: "Harga wajib diisi.",
      },
    };
  }

  try {
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: productName.trim(),
        category: productCategory.trim(),
        brand: productBrand.trim(),
        price: Number(productPrice),
      },
    });
  } catch (error) {
    return {
      success: false,
      error: "Terjadi kesalahan pada server. Coba lagi nanti.",
    };
  }

  revalidatePath("/");
  return {
    success: true,
    error: null,
  };
}
