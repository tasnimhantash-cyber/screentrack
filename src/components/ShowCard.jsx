import React from "react";
import StarRating from "./StarRating";
import { Link } from "react-router-dom";

function ShowCard({ show, onRate, onStatusChange, onDelete }) {
  return (
    <div
      className="show-card"
      style={{
        width: "180px",
        background: "#fff",
        borderRadius: "12px",
        padding: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
    >
      {/* 🖱 Clickable link area (poster + title) */}
      <Link
        to={`/watchlist/${show.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          width: "100%",
        }}
      >
        {show.poster && (
          <img
            src={
              show.poster.startsWith("http")
                ? show.poster
                : `https://image.tmdb.org/t/p/w300${show.poster}`
            }
            alt={show.title}
            style={{
              width: "100%",
              borderRadius: "8px",
              marginBottom: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: "transform 0.2s ease",
            }}
          />
        )}
        <h3
          style={{
            fontSize: "16px",
            marginBottom: "6px",
            transition: "color 0.2s ease",
          }}
        >
          {show.title}
        </h3>
      </Link>

      {/* ⭐ Rating */}
      <StarRating
        rating={show.rating || 0}
        onRate={(value) => onRate(show.id, value)}
      />

      {/* 🎞 Status dropdown */}
      <div style={{ marginTop: "8px" }}>
        <select
          value={show.status || "planned"}
          onChange={(e) => onStatusChange(show.id, e.target.value)}
          style={{
            padding: "4px 8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#f9f9f9",
            fontSize: "13px",
          }}
        >
          <option value="watching">🎥 Currently Watching</option>
          <option value="completed">✅ Completed</option>
          <option value="planned">🕒 Plan to Watch</option>
        </select>
      </div>

      {/* 🗑 Remove */}
      <button
        onClick={() => onDelete(show.id)}
        style={{
          background: "transparent",
          border: "none",
          color: "#d9534f",
          fontSize: "18px",
          cursor: "pointer",
          marginTop: "8px",
          opacity: "0.7",
          transition: "opacity 0.2s ease, color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = "1";
          e.target.style.color = "#c9302c";
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = "0.7";
          e.target.style.color = "#d9534f";
        }}
        title="Remove from Watchlist"
      >
        🗑
      </button>
    </div>
  );
}

export default ShowCard;

