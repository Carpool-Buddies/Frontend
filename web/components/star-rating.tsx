"use client";

import { useState } from "react";

interface Props {
  value?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
}

export function StarRating({ value = 0, onChange, readOnly, size = "md" }: Props) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  const cls = size === "sm" ? "text-base" : "text-2xl";

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="דירוג">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          aria-label={`${star} כוכבים`}
          data-testid={`star-${star}`}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange?.(star)}
          className={`${cls} ${readOnly ? "cursor-default" : "cursor-pointer"} transition-transform ${!readOnly && "hover:scale-110"}`}
        >
          <span className={display >= star ? "text-yellow-400" : "text-slate-600"}>★</span>
        </button>
      ))}
    </div>
  );
}
