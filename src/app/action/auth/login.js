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
      console.log("EMAIL tidak ditemukan!");
      return {
        success: false,
        errors: {
          general: "E-mail atau password salah",
        },
      };
    }

    const session = await prisma.session.create({
      data: {
        userId: findUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const cookieStore = await cookies();

    cookieStore.set("session", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  } catch (error) {
    console.error("Login error:", error);

    return {
      success: false,
      errors: {
        general: "Terjadi kesalahan pada server. Silakan coba lagi",
      },
    };
  }
  redirect("/");
}
