import Image from "next/image";
import Link from "next/link";
import type { Occasion } from "@/lib/types";
import RevealOnScroll from "./RevealOnScroll";

export default function OccasionGrid({ occasions }: { occasions: Occasion[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {occasions.map((o, i) => (
        <RevealOnScroll key={o.id} delay={Math.min(i * 0.05, 0.4)}>
          <Link
            href={`/occasions/${o.slug}`}
            className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
          >
            <Image
              src={o.image}
              alt={o.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              className="absolute inset-0 opacity-60 transition-opacity group-hover:opacity-75"
              style={{
                background: `linear-gradient(to top, ${o.fromColor}ee, transparent 60%)`,
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="font-display text-sm sm:text-base font-semibold text-white drop-shadow">
                {o.name}
              </p>
            </div>
          </Link>
        </RevealOnScroll>
      ))}
    </div>
  );
}
