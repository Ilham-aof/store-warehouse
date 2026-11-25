import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/component/change-password-page/changePasswordForm";

export default async function Page({ searchParams }) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<div>Memuat halaman...</div>}>
      <ChangePasswordForm />
    </Suspense>
  );
}
