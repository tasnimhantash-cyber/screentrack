import React, { useState } from "react";
import Rating from "react-rating";

function StarRating({ rating, onRate }) {
  const [hoverRating, setHoverRating] = useState(null);

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
      <Rating
        initialRating={hoverRating || rating}
        fractions={4} // allows 0.25 increments
        onChange={(value) => onRate(value)}
        onHover={(value) => setHoverRating(value)} // updates when hovering
        onMouseLeave={() => setHoverRating(null)} // resets when leaving
        emptySymbol={
          <span
            style={{
              fontSize: "24px",
              color: "#ccc",
              cursor: "pointer",
              transition: "transform 0.15s ease, color 0.2s ease",
            }}
            className="star-empty"
          >
            ☆
          </span>
        }
        fullSymbol={
          <span
            style={{
              fontSize: "24px",
              color: "#FFD700",
              cursor: "pointer",
              transition: "transform 0.15s ease, color 0.2s ease",
            }}
            className="star-full"
          >
            ★
          </span>
        }
      />

      {/* 👇 Numeric live rating preview */}
      {(hoverRating || rating) > 0 && (
        <span style={{ fontSize: "14px", color: "#555", minWidth: "50px" }}>
          {(hoverRating || rating).toFixed(2)} / 5
        </span>
      )}
    </div>
  );
}

export default StarRating;





