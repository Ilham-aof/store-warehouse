"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateOutletAction(prevState, formData) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  try {
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
        error: "Kamu tidak memiliki akses.",
      };
    }

    const outletId = formData.get("outletId");
    const name = formData.get("outletName")?.trim();

    if (!outletId) {
      return {
        success: false,
        error: "Outlet tidak ditemukan.",
      };
    }

    if (!name) {
      return {
        success: false,
        error: "Nama outlet wajib diisi.",
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
        error: "Outlet tidak ditemukan.",
      };
    }

    const existingOutlet = await prisma.outlet.findFirst({
      where: {
        name,
        NOT: {
          id: outletId,
        },
      },
    });

    if (existingOutlet) {
      return {
        success: false,
        error: "Nama outlet sudah digunakan.",
      };
    }

    await prisma.outlet.update({
      where: {
        id: outletId,
      },
      data: {
        name,
      },
    });
  } catch (error) {
    console.error("Update outlet error:", error);

    return {
      success: false,
      error: "Gagal mengubah nama outlet.",
    };
  }
  revalidatePath("/admin");
  redirect("/admin");
}
