"use client";

import {
  TextField,
  Label,
  Input,
  FieldError,
  Button,
  ErrorMessage,
  toast,
} from "@heroui/react";

import { useActionState, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { changePasswordAction } from "@/app/action/auth/changePassword";

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };

  const rules = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
  ];

  const score = rules.filter(Boolean).length;

  if (score <= 1) return { score, label: "Lemah", text: "text-red-500" };
  if (score <= 3) return { score, label: "Sedang", text: "text-yellow-500" };
  return { score, label: "Kuat", text: "text-green-600" };
}

export function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const strength = getPasswordStrength(password);

  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await changePasswordAction(prevState, formData);

      if (result.success) {
        toast.success("Password berhasil diperbarui");
        router.push("/login");
      } else if (result.error) {
        toast.danger("Gagal mengubah password", {
          description: result.error,
        });
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
      <h1 className="text-3xl font-bold">Ubah Password</h1>

      <form
        action={formAction}
        className="flex flex-col justify-center items-center"
      >
        <input type="" name="token" value={token ?? ""} readOnly />

        <TextField
          name="password"
          aria-label="Password"
          variant="secondary"
          type="password"
          className="w-80"
          value={password}
          onChange={setPassword}
          validate={(value) => {
            if (!value) {
              return "Bagian ini wajib diisi";
            }
          }}
        >
          <Label>Password baru</Label>
          <Input
            placeholder="Password"
            className="hover:bg-gray-200 focus:ring-slate-800"
          />
          <p className="text-xs text-neutral-500">
            *Gunakan minimal 8 karakter, termasuk huruf besar, huruf kecil, dan
            angka.
          </p>
          <div className="min-h-6">
            {!password ? (
              state.errors?.password ? (
                <ErrorMessage>{state.errors.password}</ErrorMessage>
              ) : (
                <FieldError />
              )
            ) : (
              <ErrorMessage className={strength.text}>
                Password {strength.label}
              </ErrorMessage>
            )}
          </div>
        </TextField>

        <TextField
          name="confirmPassword"
          aria-label="Confirm Password"
          variant="secondary"
          type="password"
          className="w-80"
          validate={(value) => {
            if (!value) {
              return "Bagian ini wajib diisi";
            }
          }}
        >
          <Label>Konfirmasi password baru</Label>
          <Input
            placeholder="Masukkan ulang password"
            className="hover:bg-gray-200 focus:ring-slate-800"
          />
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
          {isPending ? "Mengubah..." : "Ubah password"}
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
