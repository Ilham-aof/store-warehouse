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
  const [state, action, pending] = useActionState(loginAction, {
    success: false,
    errors: {},
  });

  return (
    <main className="flex flex-col justify-center items-center w-xl p-4 space-y-3 border-2 border-amber-600 rounded-2xl">
      <h1 className="text-3xl font-bold">Login</h1>

      <form
        action={action}
        className="flex flex-col justify-center items-center"
      >
        <TextField
          name="email"
          aria-label="Email"
          type="email"
          className="w-64"
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
          <Description />
          <div className="min-h-5">
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
          className="w-64"
          validate={(value) => {
            if (!value) {
              return "Password wajib diisi";
            }
          }}
        >
          <Input placeholder="Password" className="hover:bg-gray-200" />
          <Description />
          <div className="min-h-5">
            {state.errors?.password ? (
              <ErrorMessage>{state.errors.password}</ErrorMessage>
            ) : (
              <FieldError />
            )}
          </div>
        </TextField>

        <div className="min-h-5">
          {state.errors?.general && (
            <ErrorMessage>{state.errors.general}</ErrorMessage>
          )}
        </div>

        <Button type="submit" className="w-64 mt-2">
          Login
        </Button>
      </form>
      <p>
        Tidak punya akun ?{" "}
        <Link href="/register" className="text-blue-500 hover:underline">
          Register disini
        </Link>
      </p>
    </main>
  );
}
