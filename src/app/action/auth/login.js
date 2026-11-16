"use server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function loginAction(prevState, formData) {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";

  const errors = {};

  if (!email) {
    errors.email = "Email wajib diisi menggunakan @gmail.com";
  } else if (email.length > 100) {
    errors.email = "Email terlalu panjang";
  } else if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
    errors.email = "Email harus menggunakan format nama@gmail.com";
  }

  if (!password) {
    errors.password = "Password wajib diisi";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!findUser || !(await bcrypt.compare(password, findUser.password))) {
      return {
        success: false,
        errors: {
          general: "E-mail atau password salah",
        },
      };
    }

    const cookieStore = await cookies();
    const currentSessionId = cookieStore.get("session")?.value;

    const existingSession = currentSessionId
      ? await prisma.session.findUnique({
          where: {
            id: currentSessionId,
          },
        })
      : null;

    if (
      existingSession &&
      existingSession.userId === findUser.id &&
      existingSession.expiresAt > new Date()
    ) {
      return {
        success: true,
        error: {},
      };
    }

    const session = await prisma.session.create({
      data: {
        userId: findUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    cookieStore.set("session", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return {
      success: true,
      error: {},
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        general: "Terjadi kesalahan pada server. Silakan coba lagi",
      },
    };
  }
}
