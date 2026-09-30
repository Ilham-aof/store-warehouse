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
    const name = formData.get(`products[${index}][name]`);
    const type = formData.get(`products[${index}][type]`);
    const brand = formData.get(`products[${index}][brand]`);
    const quantity = formData.get(`products[${index}][quantity]`);
    const price = formData.get(`products[${index}][price]`);

    const productErrors = {};

    if (!name?.trim()) {
      productErrors.name = "Nama produk wajib diisi";
    }

    if (!type?.trim()) {
      productErrors.type = "Tipe produk wajib diisi";
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
      name: name?.trim(),
      type: type?.trim(),
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
    console.error("Add product error:", error);

    return {
      success: false,
      errors: {
        general: "Gagal menambahkan produk",
      },
    };
  }

  revalidatePath("/");
  redirect(`/?outletId=${outletId}`);
}
