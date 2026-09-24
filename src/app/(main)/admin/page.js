"use server";
import { OutletList } from "@/component/admin-page/outletList";
import { AddOutlet } from "@/component/admin-page/addOutlet";
import { getOutlet } from "@/app/action/outlet/getOutlet";

export default async function page() {
  const outlets = await getOutlet();

  return (
    <main className="">
      <div className="space-y-5 border-2 border-amber-500 p-4">
        <h1 className="font-bold text-2xl">Daftar Cabang</h1>
        <OutletList outlets={outlets} />
        <AddOutlet />
      </div>
    </main>
  );
}
