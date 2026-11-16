"use client";

import {
  TextField,
  Input,
  FieldError,
  Button,
  ErrorMessage,
  toast,
} from "@heroui/react";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "@/app/action/auth/resetPassword";

export default function Page() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await resetPasswordAction(prevState, formData);

      if (result.success) {
        toast.success(
          "Permintaan berhasil diproses. Silakan periksa inbox atau folder spam",
        );
        router.refresh();
      } else if (result.error) {
        toast.danger("Gagal mengirimkan E-mail", {
          description: result.error,
        });
      } else {
        toast.danger("Terjadi kesalahan pada server. Coba lagi nanti");
      }

      return result;
    },
    {
      success: false,
      error: null,
    },
  );

  return (
    <main className="flex flex-col justify-center items-center rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 w-xl h-fit space-y-5 bg-white">
      <h1 className="text-3xl font-bold">Reset Password</h1>

      <p className="w-80 text-justify">
        Masukkan alamat email yang Anda gunakan untuk membuat akun agar kami
        dapat mengirimkan petunjuk cara mengatur ulang kata sandi Anda.
      </p>

      <form
        action={formAction}
        className="flex flex-col justify-center items-center space-y-3"
      >
        <TextField
          name="email"
          aria-label="Email"
          type="email"
          className="w-80"
          isRequired
          validate={(value) => {
            if (!value.trim()) {
              return "E-mail wajib diisi";
            }

            if (!value.endsWith("@gmail.com")) {
              return "E-mail wajib menggunakan @gmail.com";
            }
          }}
        >
          <Input placeholder="E-mail" className="hover:bg-gray-200" />

          <div className="min-h-6">
            <FieldError />
          </div>
        </TextField>

        <div className="text-center  min-h-6">
          {typeof state?.error === "string" && (
            <ErrorMessage slot="description">{state.error}</ErrorMessage>
          )}
        </div>

        <Button
          type="submit"
          className="w-80 mt-2 bg-slate-800 text-yellow-100 hover:bg-slate-600"
          isDisabled={isPending}
        >
          {isPending ? "Mengirim..." : "Kirim Link Reset"}
        </Button>
      </form>

      <Button
        variant="secondary"
        className="w-80 text-slate-800"
        onPress={() => router.push("/login")}
      >
        Kembali ke Login
      </Button>
    </main>
  );
}
