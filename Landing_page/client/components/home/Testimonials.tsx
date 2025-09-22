import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const testimonials = [
  {
    name: "Rohit",
    quote: "I've found it super, super efficient.",
    designation: "Citizen",
    src: "https://cdn.builder.io/api/v1/image/assets%2Fbe8b85e214da4701834e57936a69c599%2Fd20094a8bc104749b600f70d4bcf0861?format=webp&width=800",
  },
  {
    name: "Ananya",
    quote: "Magically, things just get sorted - it's amazing!",
    designation: "Student",
    src: "https://cdn.builder.io/api/v1/image/assets%2Fbe8b85e214da4701834e57936a69c599%2F3b93c01c44a54ba2a88d05c1a241b476?format=webp&width=800",
  },
  {
    name: "Vikram",
    quote: "A really good way to get straight to the department.",
    designation: "Shop Owner",
    src: "https://cdn.builder.io/api/v1/image/assets%2Fbe8b85e214da4701834e57936a69c599%2F059fc81c71d34bd9ae6adc0c2bbc9631?format=webp&width=800",
  },
  {
    name: "Isha",
    quote: "It's so easy to use, anybody with a smartphone can do it.",
    designation: "Volunteer",
    src: "https://cdn.builder.io/api/v1/image/assets%2Fbe8b85e214da4701834e57936a69c599%2Fc0b07db9a7f74107b76a179ebf4e0f2f?format=webp&width=800",
  },
  {
    name: "Aarav",
    quote: "The whole idea is really good.",
    designation: "Resident",
    src: "https://cdn.builder.io/api/v1/image/assets%2Fbe8b85e214da4701834e57936a69c599%2F023d9be4729c498fa739a3ee73076d66?format=webp&width=800",
  },
];

import CircularTestimonials from "./CircularTestimonials";

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              What they're saying
            </h2>
            <p className="mt-2 text-gray-600">Real feedback from users.</p>
          </div>
        </div>

        <div className="mt-8">
          <CircularTestimonials
            testimonials={testimonials}
            autoplay={true}
            colors={{ arrowHoverBackground: "#10b981" }}
          />
        </div>
      </div>
    </section>
  );
}
