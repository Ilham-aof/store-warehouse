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

  if (score <= 1)
    return { score, label: "Lemah", text: "p-1 text-xs text-red-500" };
  if (score <= 3)
    return { score, label: "Sedang", text: "p-1 text-xs text-yellow-500" };
  return { score, label: "Kuat", text: "p-1 text-xs text-green-600" };
}

export default function page() {
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const strength = getPasswordStrength(password);
  const isStrongEnough = strength.score === 4;

  const [state, action, pending] = useActionState(registerAction, {
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
          validationErrors={
            state.errors?.name ? [state.errors.name] : undefined
          }
        >
          <Input placeholder="Nama" className="hover:bg-gray-200" />
          <Description />
          <div className="min-h-5">
            {state.errors?.name ? (
              <p className="pl-1 text-xs text-red-500">{state.errors.name}</p>
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
          validationErrors={
            state.errors?.email ? [state.errors.email] : undefined
          }
        >
          <Input placeholder="E-mail" className="hover:bg-gray-200" />
          <Description />
          <div className="min-h-5">
            {state.errors?.email ? (
              <p className="pl-1 text-xs text-red-500">{state.errors.email}</p>
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
          validationErrors={
            state.errors?.phone ? [state.errors.phone] : undefined
          }
        >
          <Input
            placeholder="Nomor HP"
            inputMode="numeric"
            className="hover:bg-gray-200"
          />
          <Description />
          <div className="min-h-5">
            {state.errors?.phone ? (
              <p className="pl-1 text-xs text-red-500">{state.errors.phone}</p>
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
          validationErrors={
            state.errors?.password ? [state.errors.password] : undefined
          }
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
              <p className={strength.text}>Password {strength.label}</p>
            )}
          </div>
        </TextField>

        <div className="min-h-5">
          {state.errors?.general && (
            <p className="text-sm text-red-500">{state.errors.general}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-64 mt-2"
          isDisabled={!isStrongEnough}
        >
          Register
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
