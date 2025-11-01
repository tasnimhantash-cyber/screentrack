import React, { useState, useEffect } from "react";
import { getAllShows, addShowToWatchlist } from "../services/firestore";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [successStates, setSuccessStates] = useState({});
  const [existingShows, setExistingShows] = useState([]);

  // 🧩 fetch existing shows to check for duplicates
  useEffect(() => {
    const fetchExisting = async () => {
      const shows = await getAllShows();
      setExistingShows(shows);
    };
    fetchExisting();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, status) => {
    setSelectedStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const handleAddToWatchlist = async (item) => {
    const status = selectedStatuses[item.id];
    if (!status) return;

    try {
      await addShowToWatchlist({
        title: item.title || item.name,
        type: item.media_type,
        tmdbId: item.id,
        poster: item.poster_path,
        status,
        addedAt: new Date().toISOString(),
      });

      setSuccessStates((prev) => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setSelectedStatuses((prev) => ({ ...prev, [item.id]: "" }));
        setSuccessStates((prev) => ({ ...prev, [item.id]: false }));
      }, 1500);
    } catch (err) {
      console.error("Error adding to watchlist:", err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>🔍 Search Movies & TV Shows</h2>

      {/* 🔎 SEARCH BOX */}
      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for something..."
          style={{
            width: "70%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "8px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 12px",
            background: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {/* LOADING + RESULTS */}
      {loading && <p>Loading...</p>}

      {!loading && results.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "20px",
          }}
        >
          {results.map((item) => {
            const alreadyExists = existingShows.some(
              (s) => s.tmdbId === item.id
            );

            return (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "10px",
                  background: "#fff",
                  textAlign: "center",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                {item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                    alt={item.title || item.name}
                    style={{
                      borderRadius: "8px",
                      width: "100%",
                      marginBottom: "8px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "300px",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                    }}
                  >
                    No Image
                  </div>
                )}

                <h4 style={{ fontSize: "15px", margin: "5px 0" }}>
                  {item.title || item.name}
                </h4>
                <p style={{ fontSize: "13px", color: "#555" }}>
                  {item.media_type === "tv" ? "📺 TV Show" : "🎬 Movie"}
                </p>

                <select
                  value={selectedStatuses[item.id] || ""}
                  onChange={(e) =>
                    handleStatusChange(item.id, e.target.value)
                  }
                  style={{
                    padding: "6px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    width: "100%",
                    marginBottom: "8px",
                  }}
                >
                  <option value="">Select category...</option>
                  <option value="watching">🎥 Currently Watching</option>
                  <option value="planned">🕒 Plan to Watch</option>
                  <option value="completed">✅ Completed</option>
                </select>

                <button
                  onClick={() => handleAddToWatchlist(item)}
                  disabled={alreadyExists}
                  style={{
                    background: alreadyExists
                      ? "#ccc"
                      : successStates[item.id]
                      ? "#28a745"
                      : "#007BFF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    cursor: alreadyExists ? "not-allowed" : "pointer",
                    width: "100%",
                  }}
                >
                  {alreadyExists
                    ? "✅ Already Added"
                    : successStates[item.id]
                    ? "✅ Added!"
                    : "+ Add to Watchlist"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
