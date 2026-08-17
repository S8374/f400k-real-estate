import ContactUs from "@/components/modules/home/ContactUs";
import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="pt-8 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 mb-8 flex justify-center">
        <Link href="/" className="inline-block relative w-64 h-24 md:w-80 md:h-32 hover:opacity-90 transition-opacity">
          <Image
            alt="SakRuya"
            src="/logo/logo.png"
            fill
            className="object-contain drop-shadow-md object-center"
            priority
          />
        </Link>
      </div>
      <ContactUs />
    </div>
  );
}
