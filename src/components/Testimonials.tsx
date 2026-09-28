import RevealOnScroll from "./RevealOnScroll";
import StarRating from "./StarRating";

const TESTIMONIALS = [
  {
    name: "Ananya R.",
    text: "Ordered a birthday hamper for my sister last minute and it arrived beautifully packed, right on time. The quality exceeded what I expected from the photos!",
  },
  {
    name: "Rohit K.",
    text: "Used Presently for our office Diwali gifting this year — 40 hampers, zero hassle. The admin team even helped customize the message cards.",
  },
  {
    name: "Meera S.",
    text: "The personalized photo frame for our anniversary was stunning. My husband still has it on his desk. Will definitely be ordering again.",
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <RevealOnScroll>
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-rose-600">
          Loved by gifters
        </p>
        <h2 className="mt-2 text-center font-display text-3xl font-semibold text-ink-900">
          Stories from happy customers
        </h2>
      </RevealOnScroll>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <RevealOnScroll key={t.name} delay={i * 0.1}>
            <div className="h-full rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
              <StarRating rating={5} size={14} />
              <p className="mt-3 text-sm leading-relaxed text-ink-900/70">&ldquo;{t.text}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-ink-900">{t.name}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
