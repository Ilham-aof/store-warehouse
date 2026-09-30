"use server";
import { OutletList } from "@/component/admin-page/outletList";
import { UserList } from "@/component/admin-page/userList";
import { AddOutlet } from "@/component/admin-page/addOutlet";
import { getOutlet } from "@/app/action/outlet/getOutlet";
import { getUser } from "@/app/action/user/getUser";
import { BuildingComplex, UserRoundGroup } from "lucide-react";

export default async function page() {
  const outlets = await getOutlet();
  const users = await getUser();

  return (
    <main className="space-y-5">
      <section className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 w-fit h-fit space-y-5">
        <div className="flex gap-3 items-center">
          <BuildingComplex size={30} />
          <h1 className="font-bold text-2xl">Daftar Cabang</h1>
        </div>
        <OutletList outlets={outlets} />
        <AddOutlet />
      </section>
      <section className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 w-fit h-fit space-y-5">
        <div className="flex gap-3 items-center">
          <UserRoundGroup size={30} />
          <h1 className="font-bold text-2xl">Daftar Staff</h1>
        </div>
        <UserList users={users} />
      </section>
    </main>
  );
}
