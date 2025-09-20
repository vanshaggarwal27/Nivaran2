import React from "react";

const tools = [
  "Ranchi Municipal Corp",
  "JUIDCO",
  "Jharkhand Police",
  "JBVNL",
  "JUSNL",
  "Rural Dev Dept",
  "Adityapur Municipal",
  "Jamshedpur Notified Area",
];

import { Star } from "lucide-react";

function Track() {
  return (
    <div className="flex items-center gap-6 pr-8">
      {tools.map((t, i) => (
        <div
          key={`${t}-${i}`}
          className={`px-5 py-2 rounded-full border border-gray-200 ${i % 2 === 0 ? "bg-white" : "bg-brand-cream"} shadow-sm whitespace-nowrap font-semibold text-gray-900 flex items-center gap-2 transition hover:-translate-y-0.5 hover:shadow-md`}
        >
          <Star className="h-3.5 w-3.5 text-gray-900/60" />
          <span>{t}</span>
        </div>
      ))}
    </div>
  );
}

export function PartnersMarquee() {
  return (
    <section
      id="partners"
      className="py-16 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container">
        <h3 className="text-center text-sm font-semibold tracking-wider text-gray-500">
          The trusted reporting tool for Jharkhand Government
        </h3>
        <div className="mt-8 relative overflow-hidden mask-fade group">
          <div className="flex w-[200%] animate-marquee will-change-transform hover:[animation-play-state:paused]">
            <Track />
            <Track />
          </div>
          <div className="mt-4 flex w-[200%] animate-marquee-reverse will-change-transform hover:[animation-play-state:paused]">
            <Track />
            <Track />
          </div>
        </div>
      </div>
    </section>
  );
}
