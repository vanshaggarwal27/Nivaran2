import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const testimonials = [
  {
    name: "Aarav",
    quote: "The whole idea is really good.",
  },
  {
    name: "Isha",
    quote: "It's so easy to use, anybody with a smartphone can do it.",
  },
  {
    name: "Rohit",
    quote: "I've found it super, super efficient.",
  },
  {
    name: "Ananya",
    quote: "Magically, things just get sorted - it's amazing!",
  },
  {
    name: "Vikram",
    quote: "A really good way to get straight to the department.",
  },
];

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(id);
  }, [emblaApi]);

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              What they're saying
            </h2>
            <p className="mt-2 text-gray-600">
              Real Nivcrew share their experiences.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={scrollPrev}
              aria-label="Previous"
              className="p-2 rounded-md border border-gray-200 hover:bg-gray-50"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next"
              className="p-2 rounded-md border border-gray-200 hover:bg-gray-50"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div className="mt-8" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((t, i) => (
              <article
                key={i}
                className="min-w-0 shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/3 pr-6"
              >
                <div className="h-full rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-brand-blue/20 text-brand-blue grid place-items-center">
                      <Play className="size-5" />
                    </div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                  </div>
                  <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                    “{t.quote}”
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 md:hidden flex items-center justify-center gap-2">
          <button
            onClick={scrollPrev}
            aria-label="Previous"
            className="p-2 rounded-md border border-gray-200 hover:bg-gray-50"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next"
            className="p-2 rounded-md border border-gray-200 hover:bg-gray-50"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
