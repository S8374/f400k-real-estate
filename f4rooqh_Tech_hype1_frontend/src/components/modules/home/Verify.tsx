import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock } from "lucide-react";
import Image from "next/image";
import { PiSealCheckLight } from "react-icons/pi";

export default function VerifyHero() {
    const steps = [
        {
            icon: ShieldCheck,
            title: "Verified",
            description: "Every property undergoes rigorous Title Deed verification to ensure absolute authenticity and legal compliance.",
        },
        {
            icon: PiSealCheckLight,
            title: "Sealed",
            description: "Smart contracts seal your transaction with an immutable log, providing uncompromised transparency.",
        },
        {
            icon: Lock,
            title: "Secured",
            description: "Bank-grade encryption and REGA standards secure your financial future in the Saudi real estate market.",
        },
    ];

    return (
        <section className="relative ">
            {/* Hero Image Section */}
            <div className="relative w-full min-h-[500px] md:min-h-[700px] flex flex-col items-center justify-center py-20 pb-32">
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src="/saudi-skyline-hero.png"
                        alt="Saudi Arabian Futuristic Skyline"
                        fill
                        className="object-cover object-[center_20%]"
                        priority
                    />
                    {/* Premium dark gradient overlays for perfect text contrast and blending into the page */}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto mt-10">
                    {/* Sleek Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-2xl">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs md:text-sm font-semibold text-white tracking-widest uppercase">REGA Certified Platform</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
                        Verified. Sealed. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Secured.</span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 font-medium mb-10 max-w-3xl leading-relaxed drop-shadow">
                        The Digital Standard of Saudi Real Estate. Experience seamless, immutable, and fully verified property transactions.
                    </p>

                    <Button
                        size="lg"
                        className="px-8 py-6 md:px-10 md:py-7 text-base md:text-lg font-bold rounded bg-emerald-500 hover:bg-emerald-400 text-white transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_45px_rgba(16,185,129,0.4)] border-none group"
                    >
                        Explore Verified Properties
                    </Button>
                </div>
            </div>

            {/* Overlapping Features Section */}
            <div className="relative z-20 -mt-24 mb-12 md:mb-20 px-4">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="bg-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded p-8 hover:bg-neutral-800/80 transition-all duration-500 group hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(16,185,129,0.15)] flex flex-col items-center text-center cursor-default relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500 border border-emerald-500/20">
                                    <step.icon className="w-10 h-10 text-emerald-400" strokeWidth={1.5} />
                                </div>
                                <h3 className="relative text-2xl font-bold text-white mb-4 tracking-wide group-hover:text-emerald-400 transition-colors duration-300">{step.title}</h3>
                                <p className="relative text-zinc-400 text-sm md:text-base leading-relaxed font-medium">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        </section>
    );
}