"use server";

import prisma from "@/lib/prisma";

export async function searchProduct(barcode, outletId) {
  const searchBarcode = barcode.trim();

  if (!searchBarcode || !outletId) {
    return {
      success: false,
      product: null,
      message: "Barcode dan outlet wajib diisi.",
    };
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        outletId_barcode: {
          outletId,
          barcode: searchBarcode,
        },
      },
      select: {
        id: true,
        barcode: true,
        name: true,
        category: true,
        brand: true,
        price: true,
        quantity: true,
      },
    });

    if (!product) {
      return {
        success: false,
        product: null,
        message: "Produk dengan barcode tersebut tidak ditemukan.",
      };
    }

    return {
      success: true,
      product,
      message: "",
    };
  } catch (error) {
    console.error("Gagal mencari produk:", error);

    return {
      success: false,
      product: null,
      message: "Terjadi kesalahan saat mencari produk.",
    };
  }
}
