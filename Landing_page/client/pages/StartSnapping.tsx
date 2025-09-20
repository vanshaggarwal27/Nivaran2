import React from "react";
import { StoreBadges } from "@/components/common/StoreBadges";

export default function StartSnapping() {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="rounded-3xl border border-gray-200 bg-brand-cta px-6 py-14 md:px-16 text-center shadow-sm">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            DO YOUR BIT, ON THE GO
          </h1>
          <p className="mt-3 text-gray-700 max-w-xl mx-auto">
            Get the app and start reporting issues around you.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <StoreBadges />
          </div>
        </div>
      </div>
    </section>
  );
}
