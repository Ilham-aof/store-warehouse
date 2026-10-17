import { getCurrentUser } from "@/app/action/user/getCurrentUser";
import { Sidebar } from "@/component/sidebar";

export default async function layout({ children }) {
  const user = await getCurrentUser();

  return (
    <main className="flex bg-slate-50">
      <Sidebar user={user} />
      <div className="flex-1 p-4">{children}</div>
    </main>
  );
}
