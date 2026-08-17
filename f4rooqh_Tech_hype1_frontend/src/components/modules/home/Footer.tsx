// components/Footer.tsx

import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Twitter, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white px-8 lg:px-10">
      <Container>
        <div className="py-16 md:py-20 lg:py-8 border-b border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Logo & Description + Contact Button */}
            <div className="space-y-6">
              <div className="flex flex-col gap-5 items-center md:items-start text-center md:text-left">
              <Link href="/">
                <Image
                  alt="sakk logo"
                  src="/logo/logo.png"
                  width={320}
                  height={160}
                  className="w-56 md:w-72 xl:w-80 h-auto drop-shadow-[0_0_15px_rgba(0,255,135,0.1)] transition-transform duration-300 hover:scale-105"
                />
              </Link>
              </div>

             
            </div>

            {/* Investment Links */}
            <div className="space-y-6">
              <h4 className="text-base font-normal text-white">Investment</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-zinc-500 hover:text-white transition"
                  >
                    Golden Visa Properties
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-zinc-500 hover:text-white transition"
                  >
                    High Yield Investments
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-zinc-500 hover:text-white transition"
                  >
                    Giga-Projects
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-6">
              <h4 className="text-base font-normal text-white">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-zinc-500 hover:text-white transition"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-zinc-500 hover:text-white transition"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-condition"
                    className="text-sm text-zinc-500 hover:text-white transition"
                  >
                    Terms & Condition
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support & Social Links */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-normal text-white mb-6">
                  Support
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/#faq"
                      className="text-sm text-zinc-500 hover:text-white transition"
                    >
                      FAQs
                    </a>
                  </li>
                  
                </ul>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-stone-900 rounded border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
                >
                  <Linkedin className="w-5 h-5 text-zinc-500" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-stone-900 rounded border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
                >
                  <Twitter className="w-5 h-5 text-zinc-500" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-stone-900 rounded border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
                >
                  <Instagram className="w-5 h-5 text-zinc-500" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Trusted By + Copyright */}
        <div className="py-4 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-sm text-zinc-500 mb-4 md:mb-0">Trusted By</p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="h-9 px-4 bg-stone-900 rounded border border-white/10 flex items-center gap-2">
                  <Image
                    className="mt-1.5"
                    src={"/verified-badge.svg"}
                    alt="rega"
                    height={25}
                    width={25}
                  />
                  <span className="text-sm text-gray-400">REGA</span>
                </div>
                {/* <Image
                                src={"/verified-badge.svg"}
                                alt="verified-badge"
                                height={60}
                                width={60}
                              /> */}
                <div className="h-9 px-4 bg-stone-900 rounded border border-white/10 flex items-center gap-2">
                  <Image
                    src={"/justice.svg"}
                    alt="justice"
                    height={20}
                    width={20}
                  />
                  <span className="text-sm text-gray-400">
                    Ministry of Justice
                  </span>
                </div>
                <div className="h-9 px-4 bg-stone-900 rounded border border-white/10 flex items-center gap-2">
                  <Image
                    src={"/vision.svg"}
                    alt="vision"
                    height={20}
                    width={20}
                  />
                  <span className="text-sm text-gray-400">Vision 2030</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-500 text-center md:text-right">
              © {new Date().getFullYear()} REGA Investment. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
