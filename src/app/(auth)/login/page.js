import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { LoginForm } from "@/component/login-page/loginForm";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });

    if (session && session.expiresAt > new Date()) {
      redirect("/");
    }
  }

  return (
    <>
      <LoginForm />
    </>
  );
}
