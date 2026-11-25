"use client";

import {
  TextField,
  Input,
  Label,
  FieldError,
  ErrorMessage,
  Button,
  toast,
} from "@heroui/react";
import { useState, useActionState } from "react";
import { registerAction } from "@/app/action/auth/register";
import { useRouter } from "next/navigation";

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

export function RegisterForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const strength = getPasswordStrength(password);

  const [state, action, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await registerAction(prevState, formData);

      if (result.success) {
        toast.success("Staf baru berhasil ditambahkan");
        router.push("/admin");
      } else if (result.errors.general) {
        toast.danger("Gagal menambahkan staf", {
          description: result.errors.general,
        });
      } else {
        toast.danger("Periksa kembali data yang kamu masukkan");
      }

      return result;
    },
    {
      success: false,
      errors: {},
    },
  );

  return (
    <main className="bg-white flex flex-col justify-center items-center rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 py-8 w-full h-fit space-y-5">
      <h1 className="text-3xl font-bold">Register</h1>
      <form
        action={action}
        className="flex flex-col justify-center items-center space-y-1"
      >
        <TextField
          name="name"
          aria-label="Nama"
          variant="secondary"
          type="text"
          className="w-80"
          validate={(value) => {
            if (!value) {
              return "Nama wajib diisi.";
            }
          }}
        >
          <Label>Nama</Label>
          <Input
            placeholder="Nama"
            className="hover:bg-gray-200 focus:ring-slate-800"
          />
          <div className="min-h-6">
            {state.errors?.name ? (
              <ErrorMessage>{state.errors.name}</ErrorMessage>
            ) : (
              <FieldError />
            )}
          </div>
        </TextField>

        <TextField
          name="email"
          aria-label="Email"
          variant="secondary"
          type="email"
          className="w-80"
          validate={(value) => {
            if (!value) {
              return "E-mail wajib diisi.";
            }
            if (!value.endsWith("@gmail.com")) {
              return "E-mail wajib menggunakan @gmail.com";
            }
          }}
        >
          <Label>E-mail</Label>
          <Input
            placeholder="E-mail"
            className="hover:bg-gray-200 focus:ring-slate-800"
          />
          <div className="min-h-6">
            {state.errors?.email ? (
              <ErrorMessage>{state.errors.email}</ErrorMessage>
            ) : (
              <FieldError />
            )}
          </div>
        </TextField>

        <TextField
          name="phone"
          aria-label="Phone"
          variant="secondary"
          type="tel"
          className="w-80"
          value={phone}
          onChange={(value) => {
            setPhone(value.replace(/\D/g, ""));
          }}
          validate={(value) => {
            if (!value) {
              return "Nomor HP wajib diisi.";
            }
            if (!/^08\d{8,11}$/.test(value)) {
              return "Nomor HP tidak valid.";
            }
          }}
        >
          <Label>No. HP/WA</Label>
          <Input
            placeholder="Nomor HP"
            inputMode="numeric"
            className="hover:bg-gray-200 focus:ring-slate-800"
          />
          <div className="min-h-6">
            {state.errors?.phone ? (
              <ErrorMessage>{state.errors.phone}</ErrorMessage>
            ) : (
              <FieldError />
            )}
          </div>
        </TextField>

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
              return "Password wajib diisi.";
            }
          }}
        >
          <Label>Password</Label>
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

        <div className="min-h-6">
          {state.errors?.general && (
            <ErrorMessage>{state.errors.general}</ErrorMessage>
          )}
        </div>

        <Button
          type="submit"
          className="w-80 mt-2 bg-slate-800 text-yellow-100 hover:bg-slate-600"
          isDisabled={isPending}
        >
          {isPending ? "Mendaftar..." : "Daftar"}
        </Button>
      </form>
    </main>
  );
}
