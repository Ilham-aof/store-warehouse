"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addOutletAction(prevState, formData) {
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

    const name = formData.get("outletName")?.trim();

    if (!name) {
      return {
        success: false,
        error: "Nama outlet wajib diisi.",
      };
    }

    const existingOutlet = await prisma.outlet.findUnique({
      where: {
        name,
      },
    });

    if (existingOutlet) {
      return {
        success: false,
        error: "Nama outlet sudah digunakan.",
      };
    }

    await prisma.outlet.create({
      data: {
        name,
      },
    });
  } catch (error) {
    console.error("Add outlet error:", error);

    return {
      success: false,
      error: "Gagal menambahkan outlet.",
    };
  }
  revalidatePath("/admin");
  redirect("/admin");
}
