"use client";
import React from "react";
import {
  TextField,
  Input,
  FieldError,
  Button,
  ErrorMessage,
} from "@heroui/react";
import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  const [cooldown, setCooldown] = useState(0);

  return (
    <main className="flex flex-col justify-center items-center rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 w-xl h-fit space-y-5">
      <h1 className="text-3xl font-bold">Reset Password</h1>
      <p className="w-80 text-justify">
        Masukkan alamat email yang Anda gunakan untuk membuat akun agar kami
        dapat mengirimkan petunjuk cara mengatur ulang kata sandi Anda.
      </p>
      <form className="flex flex-col justify-center items-center">
        <TextField
          name="email"
          aria-label="Email"
          type="email"
          className="w-80"
          validate={(value) => {
            if (!value) {
              return "E-mail wajib diisi";
            }
            if (!value.endsWith("@gmail.com")) {
              return "E-mail wajib menggunakan @gmail.com";
            }
          }}
        >
          <Input placeholder="E-mail" className="hover:bg-gray-200" />
          <div className="min-h-6">
            <ErrorMessage></ErrorMessage>
            <FieldError />
          </div>
        </TextField>

        <div className="min-h-6">
          <ErrorMessage></ErrorMessage>
        </div>

        <Button type="submit" className="w-80">
          Kirim Link Reset
        </Button>
      </form>
      <Button
        variant="secondary"
        className="w-80"
        onClick={() => router.push("/login")}
      >
        Kembali ke Login
      </Button>
    </main>
  );
}
