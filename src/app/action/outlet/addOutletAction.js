"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

function formatText(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\b\p{L}/gu, (char) => char.toUpperCase());
}

export async function addOutletAction(prevState, formData) {
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
      error: "Kamu tidak memiliki akses.",
    };
  }

  const nameValue = formData.get("outletName")?.trim();
  const code = formData.get("outletCode")?.trim().toUpperCase();
  const address = formData.get("outletAddress")?.trim();
  const phone = formData.get("outletPhone")?.trim();

  const name = typeof nameValue === "string" ? formatText(nameValue) : "";

  if (!name) {
    return {
      success: false,
      errors: {
        name: "Nama cabang wajib diisi.",
      },
    };
  }

  if (!code) {
    return {
      success: false,
      errors: {
        code: "Kode cabang wajib diisi.",
      },
    };
  }
  if (!/^[A-Z0-9]{2,5}$/.test(code)) {
    return {
      success: false,
      errors: {
        code: "Kode cabang harus 2–5 huruf.",
      },
    };
  }

  if (!address) {
    return {
      success: false,
      errors: {
        address: "Alamat cabang wajib diisi.",
      },
    };
  }

  if (!phone) {
    return {
      success: false,
      errors: {
        phone: "Nomor telepon cabang wajib diisi.",
      },
    };
  } else if (!/^08\d{8,11}$/.test(phone)) {
    return {
      success: false,
      errors: {
        phone: "Nomor telepon cabang tidak valid.",
      },
    };
  }
  try {
    const existingOutlet = await prisma.outlet.findUnique({
      where: {
        name,
        code,
      },
    });

    if (existingOutlet) {
      return {
        success: false,
        error: "Nama cabang sudah digunakan.",
      };
    }

    await prisma.outlet.create({
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
      error: "Terjadi kesalahan pada server. Coba lagi nanti.",
    };
  }
  revalidatePath("/admin");
  return {
    success: true,
    error: null,
  };
}
