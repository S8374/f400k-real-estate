"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Container from "@/components/shared/Container";

export default function FAQ() {
    const faqs = [
        {
            question: "What is Diyar Estate?",
            answer: "Diyar Estate is the premium digital standard for Saudi Real Estate. We provide seamless, transparent, and secure property investments backed by blockchain and REGA certification."
        },
        {
            question: "How do I verify a property?",
            answer: "Every property listed on our platform undergoes a rigorous verification process. You can view the Title Deed Verification and Immutable Transaction Log directly on the property details page."
        },
        {
            question: "Is my investment secure?",
            answer: "Absolutely. We use industry-leading encryption and smart contracts to ensure your transactions are 100% secure, immutable, and fully compliant with Saudi laws."
        },
        {
            question: "Can international investors buy property here?",
            answer: "Yes, subject to local regulations and the specific type of property. Our expert agents will guide you through the legal requirements for international investors."
        },
        {
            question: "How do I contact an agent?",
            answer: "You can reach out to our REGA-certified agents directly through the Contact Us section below, or by clicking 'Inquire' on any specific property listing."
        }
    ];

    return (
        <section id="faq" className="py-8 text-white relative">
            <Container className="relative z-10  mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white tracking-tight drop-shadow-sm">Frequently Asked Questions</h2>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Everything you need to know about investing with Diyar Estate.</p>
                </div>

                <div className="mx-auto">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem 
                                key={index} 
                                value={`item-${index}`} 
                                className="border border-white/5 bg-neutral-900/40 hover:bg-neutral-800/60 transition-all duration-300 backdrop-blur-xl rounded px-6 py-2 shadow-lg data-[state=open]:bg-neutral-800/80 data-[state=open]:border-emerald-500/30 data-[state=open]:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                            >
                                <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-emerald-400 py-4 transition-colors hover:no-underline [&[data-state=open]]:text-emerald-400">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-zinc-400 text-sm md:text-base leading-relaxed pb-4">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </Container>
        </section>
    );
}
