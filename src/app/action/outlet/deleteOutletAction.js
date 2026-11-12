"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteOutletAction(prevState, formData) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });

  if (!session || session.expiresAt < new Date()) {
    cookieStore.delete("session");
    redirect("/login");
  }

  if (session.user.role !== "Admin") {
    return {
      success: false,
      error: "Kamu tidak memiliki akses",
    };
  }

  const outletId = formData.get("outletId");

  if (!outletId) {
    return {
      success: false,
      error: "Outlet tidak ditemukan",
    };
  }
  try {
    const outlet = await prisma.outlet.findUnique({
      where: {
        id: outletId,
      },
      include: {
        products: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!outlet) {
      return {
        success: false,
        error: "Outlet tidak ditemukan",
      };
    }

    if (outlet.products.length > 0) {
      return {
        success: false,
        error: "Outlet tidak dapat dihapus karena masih memiliki produk",
      };
    }

    await prisma.outlet.delete({
      where: {
        id: outletId,
      },
    });
  } catch (error) {
    console.error("Delete outlet error:", error);

    return {
      success: false,
      error: "Gagal menghapus outlet",
    };
  }
  revalidatePath("/admin");
  return {
    success: true,
    error: null,
  };
}
