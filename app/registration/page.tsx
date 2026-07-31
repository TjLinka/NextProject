// app/registration/page.tsx
import { Suspense } from "react";
import RegistrationContent from "./component/RegistrationContent";

export default function RegistrationPage() {
  return (
    <Suspense fallback={''}>
      <RegistrationContent />
    </Suspense>
  );
}
