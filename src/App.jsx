import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Watchlist from "./pages/Watchlist";
import ShowNotes from "./pages/ShowNotes";
import Search from "./pages/Search";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <nav
        style={{
          display: "flex",
          gap: "20px",
          padding: "10px 20px",
          background: "#f8f8f8",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Link
          to="/watchlist"
          style={{ textDecoration: "none", color: "#333", fontWeight: "500" }}
        >
          📺 Watchlist
        </Link>
        <Link
          to="/search"
          style={{ textDecoration: "none", color: "#333", fontWeight: "500" }}
        >
          🔍 Search
        </Link>
      </nav>

      <Routes>
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/watchlist/:id" element={<ShowNotes />} />
        <Route path="/search" element={<Search />} />
        <Route path="/" element={<Navigate to="/watchlist" replace />} />
      </Routes>
    </>
  );
}

export default App;
