"use server";
import { prisma } from "@/lib/prisma";
import { sendResetPassword } from "@/lib/resend";
import crypto from "crypto";
import { createHash } from "node:crypto";

export async function resetPasswordAction(prevState, formData) {
  const emailValue = formData.get("email");
  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";

  if (!email) {
    return {
      success: false,
      error: "Email wajib diisi menggunakan @gmail.com.",
    };
  } else if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
    return {
      success: false,
      error: "Email harus menggunakan format nama@gmail.com.",
    };
  }

  try {
    const searchUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!searchUser) {
      return {
        success: true,
        error: null,
      };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(resetToken).digest("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: searchUser.id,
      },
    });

    await prisma.passwordResetToken.create({
      data: {
        userId: searchUser.id,
        token: hashedToken,
        expiresAt,
      },
    });

    const resetUrl = `${process.env.APP_URL}/change-password?token=${resetToken}`;

    const emailResult = await sendResetPassword(
      email,
      resetUrl,
      searchUser.name,
    );

    if (!emailResult.success) {
      await prisma.passwordResetToken.deleteMany({
        where: {
          token: hashedToken,
        },
      });

      return {
        success: false,
        error: "Gagal mengirim email reset password.",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: "Terjadi kesalahan pada server. Silakan coba lagi.",
    };
  }
  return {
    success: true,
    error: null,
  };
}
