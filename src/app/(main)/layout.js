import { getCurrentUser } from "@/app/action/getCurrentUser";
import { Navbar } from "@/component/navbar";

export default async function layout({ children }) {
  const user = await getCurrentUser();

  return (
    <main>
      <Navbar role={user?.role} />
      <div className="flex gap-4 p-4">{children}</div>
    </main>
  );
}
