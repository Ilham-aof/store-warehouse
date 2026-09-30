"use client";
import React from "react";
import {
  TextField,
  Input,
  Description,
  FieldError,
  Button,
  ErrorMessage,
} from "@heroui/react";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/action/auth/login";

export default function page() {
  const [state, action, isPending] = useActionState(loginAction, {
    success: false,
    errors: {},
  });

  return (
    <main className="flex flex-col justify-center items-center rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 w-xl h-fit space-y-5">
      <h1 className="text-3xl font-bold">Login</h1>

      <form
        action={action}
        className="flex flex-col justify-center items-center"
      >
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
            {state.errors?.email ? (
              <ErrorMessage>{state.errors.email}</ErrorMessage>
            ) : (
              <FieldError />
            )}
          </div>
        </TextField>

        <TextField
          name="password"
          aria-label="Password"
          type="password"
          className="w-80"
          validate={(value) => {
            if (!value) {
              return "Password wajib diisi";
            }
          }}
        >
          <Input placeholder="Password" className="hover:bg-gray-200" />
          <div className="min-h-6">
            {state.errors?.password ? (
              <ErrorMessage>{state.errors.password}</ErrorMessage>
            ) : (
              <FieldError />
            )}
          </div>
        </TextField>

        <div className="min-h-6">
          {state.errors?.general && (
            <ErrorMessage>{state.errors.general}</ErrorMessage>
          )}
        </div>

        <Button type="submit" className="w-80" isDisabled={isPending}>
          {isPending ? "Memproses..." : "Login"}
        </Button>
      </form>
      <p>
        Tidak punya akun ?{" "}
        <Link href="/register" className="text-blue-500 hover:underline">
          Daftar disini
        </Link>
      </p>
    </main>
  );
}
