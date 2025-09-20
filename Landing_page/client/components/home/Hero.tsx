import React from "react";
import { StoreBadges } from "../common/StoreBadges";
import { Camera, Smartphone, BadgeCheck } from "lucide-react";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[hsl(var(--brand-dark))] text-white"
    >
      <div className="container grid md:grid-cols-2 gap-12 items-center py-20">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Nivaran
          </h1>
          <p className="mt-4 text-lg font-semibold text-white/90 max-w-prose">
            Aapki shikayat, hamara nivaran
          </p>
          <p className="mt-6 text-lg text-white/80 max-w-prose">
            Report issues across Jharkhand to the right authorities — faster,
            simpler, and more effective.
          </p>
          <div className="mt-8">
            <p className="text-sm uppercase tracking-widest text-white/70 mb-3">
              Get the app and start Sorting
            </p>
            <StoreBadges />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-10 -left-10 size-64 rounded-full bg-brand-blue/20 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 size-64 rounded-full bg-brand-orange/20 blur-3xl" />
          <div className="relative mx-auto max-w-lg">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F23e3a26c44c946f88c17ad9d5e4942bc%2F3632e3f8d7b24e3e9ef98c601f2ff6eb?format=webp&width=800"
              alt="See Say Sort illustration"
              className="w-full h-auto mix-blend-lighten"
              style={{
                WebkitMaskImage:
                  "radial-gradient(closest-side, white 92%, transparent)",
                maskImage:
                  "radial-gradient(closest-side, white 92%, transparent)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
