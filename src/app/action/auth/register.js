"use server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function formatName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\b\p{L}/gu, (char) => char.toUpperCase());
}

export async function registerAction(prevState, formData) {
  const nameValue = formData.get("name");
  const emailValue = formData.get("email");
  const phoneValue = formData.get("phone");
  const passwordValue = formData.get("password");

  const cleanName = typeof nameValue === "string" ? formatName(nameValue) : "";
  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const phone = typeof phoneValue === "string" ? phoneValue.trim() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";

  const errors = {};

  if (!cleanName) {
    errors.name = "Nama wajib diisi";
  } else if (cleanName.length > 50) {
    errors.name = "Nama terlalu panjang";
  }

  if (!email) {
    errors.email = "Email wajib diisi menggunakan @gmail.com";
  } else if (email.length > 100) {
    errors.email = "Email terlalu panjang";
  } else if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
    errors.email = "Email harus menggunakan format nama@gmail.com";
  }

  if (!phone) {
    errors.phone = "Nomor HP wajib diisi";
  } else if (!/^08\d{8,11}$/.test(phone)) {
    errors.phone = "Nomor HP tidak valid";
  }

  if (!password) {
    errors.password = "Password wajib diisi";
  } else if (password.length > 30) {
    errors.password = "Password terlalu panjang";
  } else if (
    password.length < 8 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    errors.password = "Password tidak memenuhi kriteria";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        errors: {
          email: "E-mail sudah terdaftar",
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name: cleanName,
        email,
        phone,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      error: {},
    };
  } catch (error) {
    if (error?.code === "P2002") {
      return {
        success: false,
        errors: {
          email: "Email sudah terdaftar",
        },
      };
    }

    return {
      success: false,
      errors: {
        general: "Terjadi kesalahan pada server. Silakan coba lagi",
      },
    };
  }
}
