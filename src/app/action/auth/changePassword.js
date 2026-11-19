"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { createHash } from "node:crypto";

export async function changePasswordAction(prevState, formData) {
  const tokenValue = formData.get("token");
  const passwordValue = formData.get("password");
  const confirmPasswordValue = formData.get("confirmPassword");

  const token = typeof tokenValue === "string" ? tokenValue.trim() : "";

  const password = typeof passwordValue === "string" ? passwordValue : "";

  const confirmPassword =
    typeof confirmPasswordValue === "string" ? confirmPasswordValue : "";

  if (!token) {
    return {
      success: false,
      error: "Link reset password tidak valid.",
    };
  }

  if (!password || !confirmPassword) {
    return {
      success: false,
      errors: {
        password: "Semua kolom wajib diisi.",
      },
    };
  }

  if (
    password.length < 8 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    return {
      success: false,
      errors: {
        password: "Password tidak memenuhi kriteria.",
      },
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      errors: {
        confirmPassword: "Password tidak cocok.",
      },
    };
  }

  try {
    const hashedToken = createHash("sha256").update(token).digest("hex");

    const searchToken = await prisma.passwordResetToken.findUnique({
      where: {
        token: hashedToken,
      },
    });

    if (!searchToken) {
      return {
        success: false,
        error: "Link reset password tidak valid atau sudah digunakan.",
      };
    }

    if (searchToken.expiresAt <= new Date()) {
      await prisma.passwordResetToken.deleteMany({
        where: {
          id: searchToken.id,
        },
      });

      return {
        success: false,
        error:
          "Link reset password sudah kedaluwarsa. Silakan minta link baru.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const now = new Date();

    const updated = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: searchToken.userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      const consumedToken = await tx.passwordResetToken.deleteMany({
        where: {
          id: searchToken.id,
          token: hashedToken,
          expiresAt: {
            gt: now,
          },
        },
      });

      if (consumedToken.count !== 1) {
        return false;
      }

      await tx.session.deleteMany({
        where: {
          userId: searchToken.userId,
        },
      });

      return true;
    });

    if (!updated) {
      return {
        success: false,
        error: "Link reset password tidak valid atau sudah kedaluwarsa.",
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Update password error:", error);

    return {
      success: false,
      error: "Terjadi kesalahan pada server. Silakan coba lagi.",
    };
  }
}
