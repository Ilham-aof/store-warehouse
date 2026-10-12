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
    const code = formData.get("outletCode")?.trim();
    const address = formData.get("outletAddress")?.trim();
    const phone = formData.get("outletPhone")?.trim();

    if (!outletId) {
      return {
        success: false,
        error: "Cabang tidak ditemukan.",
      };
    }

    if (!name) {
      return {
        success: false,
        error: "Nama cabang wajib diisi.",
      };
    }

    if (!code) {
      return {
        success: false,
        error: "Kode cabang wajib diisi.",
      };
    }

    if (!address) {
      return {
        success: false,
        error: "Alamat cabang wajib diisi.",
      };
    }

    if (!phone) {
      return {
        success: false,
        error: "Nomor telepon cabang wajib diisi",
      };
    } else if (!/^08\d{8,11}$/.test(phone)) {
      return {
        success: false,
        error: "Nomor telepon cabang tidak valid",
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
        error: "Cabang tidak ditemukan.",
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
        error: "Nama cabang sudah digunakan.",
      };
    }

    await prisma.outlet.update({
      where: {
        id: outletId,
      },
      data: {
        name,
        code,
        address,
        phone,
      },
    });
  } catch (error) {
    return {
      success: false,
      error: "Gagal mengubah nama cabang",
    };
  }
  revalidatePath("/admin");
  redirect("/admin");
}
