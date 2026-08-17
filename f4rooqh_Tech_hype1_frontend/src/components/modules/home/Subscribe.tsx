"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2 } from "lucide-react";
import Container from "@/components/shared/Container";
import { toast } from "sonner";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/v1/subscriber/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Successfully subscribed to the newsletter!");
        setEmail(""); // Clear the input
      } else {
        if (response.status === 409) {
          toast.info(data.message || "You are already subscribed.");
        } else {
          toast.error(data.message || "Failed to subscribe. Please try again.");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="pb-16 mt-8 md:pb-20 ">
      <Container>
        <div className=" mx-auto">
          {/* Main Card */}
          <div className="bg-linear-to-b from-emerald-800 to-green-500 rounded shadow-2xl p-10 md:p-16 text-center overflow-hidden">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight mb-4">
              Subscribe to get the latest news and updates
            </h2>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-stone-200 mb-10 md:mb-12">
              Get latest property updates directly to your email
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              {/* Email Input */}
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/80" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-14 pl-12 pr-6 bg-transparent border border-white text-white placeholder:text-white/70 
                             text-lg rounded focus-visible:ring-2 focus-visible:ring-white/50 
                             focus-visible:border-white transition-all"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Subscribe Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="h-14 px-8 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-lg rounded 
                           shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}