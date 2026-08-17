import { ShieldCheck } from "lucide-react";

export function KycVerificationHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
        <ShieldCheck className="w-8 h-8 text-[#00B37E]" />
        KYC Verification
      </h1>
      <p className="text-gray-400 text-sm">Validate user identities and secure document uploads across the platform.</p>
    </div>
  );
}
