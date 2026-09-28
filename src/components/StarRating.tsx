import { Star } from "lucide-react";

export default function StarRating({
  rating,
  reviews,
  size = 14,
}: {
  rating: number;
  reviews?: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={
              i <= Math.round(rating)
                ? "fill-gold-500 text-gold-500"
                : "fill-transparent text-ink-900/20"
            }
          />
        ))}
      </div>
      <span className="text-xs text-ink-900/50">
        {rating.toFixed(1)}
        {typeof reviews === "number" && ` (${reviews})`}
      </span>
    </div>
  );
}
