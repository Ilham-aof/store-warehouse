"use server";
import { getCurrentUser } from "@/app/action/user/getCurrentUser";
import { RegisterForm } from "@/component/register-page/registerForm";
import { redirect } from "next/navigation";

export default async function page() {
  const staff = await getCurrentUser();
  if (!staff || staff.role !== "Admin") {
    redirect("/");
  }

  return (
    <main className="space-y-5">
      <RegisterForm />
    </main>
  );
}
