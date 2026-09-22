"use client";
import React from "react";
import {
  TextField,
  Input,
  Description,
  FieldError,
  ErrorMessage,
  Button,
} from "@heroui/react";
import Link from "next/link";
import { useState, useActionState } from "react";
import { registerAction } from "@/app/action/auth/register";

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

export default function page() {
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const strength = getPasswordStrength(password);
  const isStrongEnough = strength.score === 4;

  const [state, action, isPending] = useActionState(registerAction, {
    success: false,
    errors: {},
  });

  return (
    <main className="flex flex-col justify-center items-center w-xl p-4 space-y-3 border-2 border-amber-600 rounded-2xl">
      <h1 className="text-3xl font-bold">Register</h1>
      <form
        action={action}
        className="flex flex-col justify-center items-center"
      >
        <TextField
          name="name"
          aria-label="Nama"
          type="text"
          className="w-80"
          validate={(value) => {
            if (!value) {
              return "Nama wajib diisi";
            }
          }}
        >
          <Input placeholder="Nama" className="hover:bg-gray-200" />
          <Description />
          <div className="min-h-5">
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
          name="phone"
          aria-label="Phone"
          type="tel"
          className="w-80"
          value={phone}
          onChange={(value) => {
            setPhone(value.replace(/\D/g, ""));
          }}
          validate={(value) => {
            if (!value) {
              return "Nomor HP wajib diisi";
            }
            if (!/^08\d{8,11}$/.test(value)) {
              return "Nomor HP tidak valid";
            }
          }}
        >
          <Input
            placeholder="Nomor HP"
            inputMode="numeric"
            className="hover:bg-gray-200"
          />
          <Description />
          <div className="min-h-5">
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
          type="password"
          className="w-80"
          value={password}
          onChange={setPassword}
          validate={(value) => {
            if (!value) {
              return "Password wajib diisi";
            }
          }}
        >
          <Input placeholder="Password" className="hover:bg-gray-200" />
          <p className="text-xs text-neutral-500">
            *Gunakan minimal 8 karakter, termasuk huruf besar, huruf kecil, dan
            angka.
          </p>
          <div className="min-h-7">
            {!password ? (
              <FieldError />
            ) : (
              <ErrorMessage className={strength.text}>
                Password {strength.label}
              </ErrorMessage>
            )}
          </div>
        </TextField>

        <div className="min-h-5">
          {state.errors?.general && (
            <ErrorMessage>{state.errors.general}</ErrorMessage>
          )}
        </div>

        <Button type="submit" className="w-64 mt-2" isDisabled={isPending}>
          {isPending ? "Mendaftar..." : "Daftar"}
        </Button>
      </form>
      <p>
        Sudah punya akun ?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login disini
        </Link>
      </p>
    </main>
  );
}
