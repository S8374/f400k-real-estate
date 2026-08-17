import { AuthLayout } from "@/components/auth/AuthLayout";
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

export default function VerifyOtpPage() {
  return (
    <AuthLayout>
      <VerifyOtpForm />
    </AuthLayout>
  );
}
