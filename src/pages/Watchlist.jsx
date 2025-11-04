import React, { useEffect, useState } from "react";
import "./Watchlist.css";
import { Link } from "react-router-dom";
import {
  getAllShows,
  deleteShow,
  updateShowRating,
  updateShowStatus,
} from "../services/firestore";
import StarRating from "../components/StarRating";
import AutoResizeTextarea from "../components/AutoResizeTextarea";
import ShowCard from "../components/ShowCard";




console.log("⭐ StarRating import check:", StarRating);
console.log("📝 AutoResizeTextarea import check:", AutoResizeTextarea);


/* ================= MAIN WATCHLIST ================= */
function Watchlist() {
  const [watchlistItems, setWatchlistItems] = useState([]);

  // 🔹 Fetch all shows
  const fetchWatchlist = async () => {
    const items = await getAllShows();
    setWatchlistItems(items);
  };

  // 🔹 Remove a show
  const removeFromWatchlist = async (id) => {
    await deleteShow(id);
    fetchWatchlist();
  };

  // ⭐ Rating handler
  const handleRateShow = async (showId, newRating) => {
    try {
      await updateShowRating(showId, newRating);
      setWatchlistItems((prev) =>
        prev.map((item) =>
          item.id === showId ? { ...item, rating: newRating } : item
        )
      );
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  // 🎬 Status handler
  const handleStatusChange = async (showId, newStatus) => {
    try {
      await updateShowStatus(showId, newStatus);
      setWatchlistItems((prev) =>
        prev.map((item) =>
          item.id === showId ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

const handleDeleteShow = async (id) => {
  try {
    await deleteShow(id);
    fetchWatchlist(); // refresh list instantly
  } catch (err) {
    console.error("Error deleting show:", err);
  }
};



  // 🧩 Grouped categories
  const watching = watchlistItems.filter((i) => i.status === "watching");
  const planned = watchlistItems.filter((i) => i.status === "planned");
  const completed = watchlistItems.filter((i) => i.status === "completed");

return (
  <div className="watchlist-container">
    <h2>📺 My Watchlist</h2>

    {/* 👀 Currently Watching row */}
    {watching.length > 0 && (
      <div className="watchlist-row">
        <h3 className="row-title">👀 Currently Watching</h3>
        <div className="row-cards">
          {watching.map((show) => (
            <ShowCard
              key={show.id}
              show={show}
              onRate={handleRateShow}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteShow}
            />
          ))}
        </div>
      </div>
    )}

    {/* 🕒 Plan to Watch row */}
    {planned.length > 0 && (
      <div className="watchlist-row">
        <h3 className="row-title">🕒 Plan to Watch</h3>
        <div className="row-cards">
          {planned.map((show) => (
            <ShowCard
              key={show.id}
              show={show}
              onRate={handleRateShow}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteShow}
            />
          ))}
        </div>
      </div>
    )}

    {/* ✅ Completed row */}
    {completed.length > 0 && (
      <div className="watchlist-row">
        <h3 className="row-title">✅ Completed</h3>
        <div className="row-cards">
          {completed.map((show) => (
            <ShowCard
              key={show.id}
              show={show}
              onRate={handleRateShow}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteShow}
            />
          ))}
        </div>
      </div>
    )}
  </div> // closes main container
); // closes return
} // closes component function

export default Watchlist;
