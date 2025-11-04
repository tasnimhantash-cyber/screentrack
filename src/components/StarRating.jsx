import React, { useState } from "react";

function StarRating({ rating = 0, onRate }) {
  const [hoverValue, setHoverValue] = useState(null);
  const [tempRating, setTempRating] = useState(rating);

  const handleMouseMove = (e, star) => {
    const { left, width } = e.target.getBoundingClientRect();
    const percent = Math.min(Math.max((e.clientX - left) / width, 0), 1);
    const quarterStep = Math.round(percent * 4) / 4; // quarters
    setHoverValue(star - 1 + quarterStep);
  };

  const handleMouseLeave = () => setHoverValue(null);

  const handleClick = (e, star) => {
    const { left, width } = e.target.getBoundingClientRect();
    const percent = Math.min(Math.max((e.clientX - left) / width, 0), 1);
    const quarterStep = Math.round(percent * 4) / 4;
    const newRating = star - 1 + quarterStep;
    setTempRating(newRating);
    onRate(newRating);
  };

  const displayRating = hoverValue ?? tempRating;

  return (
    <div style={{ display: "flex", gap: "5px", cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const full = star <= Math.floor(displayRating);
        const fraction =
          star - 1 < displayRating && displayRating < star
            ? displayRating - (star - 1)
            : 0;

        return (
          <div
            key={star}
            onMouseMove={(e) => handleMouseMove(e, star)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleClick(e, star)}
            style={{
              position: "relative",
              fontSize: "28px",
              transition: "transform 0.15s ease",
              transform:
                hoverValue && Math.ceil(hoverValue) === star
                  ? "scale(1.2)"
                  : "scale(1)",
            }}
          >
            {/* empty star */}
            <span style={{ color: "#ccc" }}>★</span>

            {/* filled star portion */}
            <span
              style={{
                color: "#FFD700",
                position: "absolute",
                top: 0,
                left: 0,
                width: `${fraction * 100 || (full ? 100 : 0)}%`,
                overflow: "hidden",
                boxShadow:
                  full
                    ? "0 0 8px rgba(255, 215, 0, 0.6)"
                    : fraction > 0
                    ? "0 0 6px rgba(255, 215, 0, 0.3)"
                    : "none",
              }}
            >
              ★
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default StarRating; 

