"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addProductAction(prevState, formData) {
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

  const outletId = formData.get("outletId");

  if (!outletId) {
    return {
      success: false,
      errors: {
        general: "Outlet wajib dipilih",
      },
    };
  }

  const outlet = await prisma.outlet.findUnique({
    where: {
      id: outletId,
    },
  });

  if (!outlet) {
    return {
      success: false,
      errors: {
        general: "Outlet tidak ditemukan.",
      },
    };
  }

  const products = [];
  const errors = {};
  let index = 0;

  while (formData.get(`products[${index}][name]`) !== null) {
    const barcode = formData.get(`products[${index}][barcode]`);
    const name = formData.get(`products[${index}][name]`);
    const category = formData.get(`products[${index}][category]`);
    const brand = formData.get(`products[${index}][brand]`);
    const quantity = formData.get(`products[${index}][quantity]`);
    const price = formData.get(`products[${index}][price]`);

    const productErrors = {};

    if (!barcode?.trim()) {
      productErrors.barcode = "Barcode produk wajib diisi";
    }

    if (!name?.trim()) {
      productErrors.name = "Nama produk wajib diisi";
    }

    if (!category?.trim()) {
      productErrors.category = "Kategori produk wajib diisi";
    }

    if (!brand?.trim()) {
      productErrors.brand = "Brand produk wajib diisi";
    }

    if (!quantity) {
      productErrors.quantity = "Jumlah produk wajib diisi";
    }

    if (!price) {
      productErrors.price = "Harga produk wajib diisi";
    }

    if (Object.keys(productErrors).length > 0) {
      errors[index] = productErrors;
    }

    products.push({
      barcode: barcode?.trim(),
      name: name?.trim(),
      category: category?.trim(),
      brand: brand?.trim(),
      quantity: Number(quantity),
      price: Number(price),
    });

    index++;
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  const seenBarcodes = new Set();

  for (let i = 0; i < products.length; i++) {
    const barcode = products[i].barcode;

    if (seenBarcodes.has(barcode)) {
      errors[i] = {
        ...errors[i],
        barcode: "Barcode duplikat dalam form",
      };
    }

    seenBarcodes.add(barcode);
  }

  if (products.length > 0) {
    const existingProducts = await prisma.product.findMany({
      where: {
        outletId,
        barcode: {
          in: [...seenBarcodes],
        },
      },
      select: {
        barcode: true,
      },
    });

    const existingBarcodes = new Set(
      existingProducts.map((product) => product.barcode),
    );

    for (let i = 0; i < products.length; i++) {
      if (existingBarcodes.has(products[i].barcode)) {
        errors[i] = {
          ...errors[i],
          barcode: "Barcode sudah digunakan di outlet ini",
        };
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (const productData of products) {
        const product = await tx.product.create({
          data: {
            ...productData,
            outletId,
          },
        });

        await tx.stockIn.create({
          data: {
            quantity: productData.quantity,
            type: "STOCK_AWAL",
            product: {
              connect: {
                id: product.id,
              },
            },

            user: {
              connect: {
                id: session.userId,
              },
            },
          },
        });
      }
    });
  } catch (error) {
    return {
      success: false,
      errors: {
        general: "Gagal menambahkan produk",
      },
    };
  }

  revalidatePath("/");
  return {
    success: true,
    error: {},
  };
}
