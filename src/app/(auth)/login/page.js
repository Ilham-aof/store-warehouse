"use client";
import React from "react";
import {
  TextField,
  Input,
  Description,
  FieldError,
  Button,
} from "@heroui/react";
import Link from "next/link";

export default function page() {
  return (
    <main className="flex flex-col justify-center items-center w-xl p-4 space-y-3 border-2 border-amber-600 rounded-2xl">
      <h1 className="text-3xl font-bold">Login</h1>

      <form className="flex flex-col justify-center items-center">
        <TextField type="email" className="w-64" isRequired>
          <Input placeholder="E-mail" />
          <Description />
          <div className="min-h-5">
            <FieldError>E-mail wajib diisi</FieldError>
          </div>
        </TextField>

        <TextField type="password" className="w-64" isRequired>
          <Input placeholder="Password" />
          <Description />
          <div className="min-h-5">
            <FieldError>Password wajib diisi</FieldError>
          </div>
        </TextField>

        <Button type="submit" className="w-64">
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
