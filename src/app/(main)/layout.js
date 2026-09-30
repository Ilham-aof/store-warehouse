import { getCurrentUser } from "@/app/action/user/getCurrentUser";
import { Navbar } from "@/component/navbar";

export default async function layout({ children }) {
  const user = await getCurrentUser();

  return (
    <main className="flex">
      <Navbar user={user} />
      <div className="flex-1 p-4">{children}</div>
    </main>
  );
}
