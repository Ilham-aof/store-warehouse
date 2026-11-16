import { Suspense } from "react";
import { ChangePasswordForm } from "@/component/change-password-page/changePasswordForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Memuat halaman...</div>}>
      <ChangePasswordForm />
    </Suspense>
  );
}
