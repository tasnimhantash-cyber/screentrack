import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getShowWithNotes,
  addEpisodeNote,
  deleteEpisodeNote,
} from "../services/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getSeasons, getEpisodes } from "../services/tmdb";


function ShowNotes() {
  const { id } = useParams();
  const [showData, setShowData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [editingDateField, setEditingDateField] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState("");

useEffect(() => {
  if (showData && showData.tmdbId) { // assuming you store tmdbId in Firestore
    getSeasons(showData.tmdbId).then(setSeasons);
  }
}, [showData]);


const handleSeasonChange = async (seasonNumber) => {
  setSelectedSeason(seasonNumber);
  const eps = await getEpisodes(showData.tmdbId, seasonNumber);
  setEpisodes(eps);
};

  

  // 🔹 Fetch show and notes
  const fetchShowData = useCallback(async () => {
    try {
      const result = await getShowWithNotes(id);
      if (!result) return;
      const { notes, ...show } = result;
      setShowData(show);
      setNotes(notes);
    } catch (err) {
      console.error("Error fetching show:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchShowData();
  }, [fetchShowData]);

const handleAddNote = async () => {
  if (!noteText.trim()) return;
  try {
    await addEpisodeNote(id, {
      text: noteText,
       season: selectedSeason,
      episode: selectedEpisode,
      createdAt: new Date().toISOString(),
    });
    setNoteText("");
    setSelectedSeason("");
    setSelectedEpisode("");
    setEpisodes([]);
    fetchShowData();
  } catch (error) {
    console.error("Error adding note:", error);
  }

};



const handleDeleteNote = async (noteId) => {
  try {
    await deleteEpisodeNote(id, noteId);
    fetchShowData(); // refresh list
  } catch (error) {
    console.error("Error deleting note:", error);
  }
};

  const updateShowDate = async (field, value) => {
    try {
      const showRef = doc(db, "watchlist", id);
      await updateDoc(showRef, { [field]: value });
      setShowData((prev) => ({ ...prev, [field]: value }));
    } catch (err) {
      console.error("Error updating date:", err);
    }
  };

const addRewatchDate = async (date, notes) => {
  if (!date) return;

  // Figure out the next rewatch number
  const nextRewatchNumber = (showData.rewatches?.length || 0) + 1;

  const newRewatch = {
    number: nextRewatchNumber,
    date,
    notes,
  };

  try {
    const showRef = doc(db, "watchlist", id);
    const updatedRewatches = [...(showData.rewatches || []), newRewatch];
    await updateDoc(showRef, { rewatches: updatedRewatches });
    setShowData((prev) => ({ ...prev, rewatches: updatedRewatches }));
  } catch (err) {
    console.error("Error adding rewatch:", err);
  }
};

const deleteRewatch = async (indexToDelete) => {
  try {
    const updatedRewatches = (showData.rewatches || [])
      .filter((_, i) => i !== indexToDelete)
      // 🔁 re-assign new numbers (1, 2, 3, …)
      .map((r, i) => ({ ...r, number: i + 1 }));

    const showRef = doc(db, "watchlist", id);
    await updateDoc(showRef, { rewatches: updatedRewatches });
    setShowData((prev) => ({ ...prev, rewatches: updatedRewatches }));
  } catch (err) {
    console.error("Error deleting rewatch:", err);
  }
};



  // 🧩 Then your renderDateSection (this one calls the functions above)
  const renderDateSection = () => (
    <div style={{ marginBottom: "20px" }}>
      <h3>📅 Watch Dates</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
       {/* TV Shows */}
{showData.type === "tv" && (
  <>
    {/* Started Date */}
    <div>
      <strong>Started:</strong>{" "}
      {editingDateField === "startedAt" ? (
        <>
          <input
            type="date"
            defaultValue={
              showData.startedAt
                ? new Date(showData.startedAt).toISOString().slice(0, 10)
                : ""
            }
            onChange={(e) => updateShowDate("startedAt", e.target.value)}
            style={{ marginLeft: "6px" }}
          />
          <button
            onClick={() => setEditingDateField(null)}
            style={{
              marginLeft: "6px",
              border: "none",
              background: "#ccc",
              padding: "2px 8px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ✔
          </button>
        </>
      ) : (
        <>
          {showData.startedAt
            ? new Date(showData.startedAt).toLocaleDateString()
            : "— not started yet"}
          <button
            onClick={() => setEditingDateField("startedAt")}
            style={{
              marginLeft: "8px",
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            ✏️
          </button>
        </>
      )}
    </div>

    {/* Finished Date */}
    <div>
      <strong>Finished:</strong>{" "}
      {editingDateField === "finishedAt" ? (
        <>
          <input
            type="date"
            defaultValue={
              showData.finishedAt
                ? new Date(showData.finishedAt).toISOString().slice(0, 10)
                : ""
            }
            onChange={(e) => updateShowDate("finishedAt", e.target.value)}
            style={{ marginLeft: "6px" }}
          />
          <button
            onClick={() => setEditingDateField(null)}
            style={{
              marginLeft: "6px",
              border: "none",
              background: "#ccc",
              padding: "2px 8px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ✔
          </button>
        </>
      ) : (
        <>
          {showData.finishedAt
            ? new Date(showData.finishedAt).toLocaleDateString()
            : "— not finished yet"}
          <button
            onClick={() => setEditingDateField("finishedAt")}
            style={{
              marginLeft: "8px",
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            ✏️
          </button>
        </>
      )}
    </div>
  </>
)}
{/* Movie Watched Date */}
{showData.type === "movie" && (
  <div>
    <strong>Watched:</strong>{" "}
    {editingDateField === "finishedAt" ? (
      <>
        <input
          type="date"
          defaultValue={
            showData.finishedAt
              ? new Date(showData.finishedAt).toISOString().slice(0, 10)
              : ""
          }
          onChange={(e) => updateShowDate("finishedAt", e.target.value)}
          style={{ marginLeft: "6px" }}
        />
        <button
          onClick={() => setEditingDateField(null)}
          style={{
            marginLeft: "6px",
            border: "none",
            background: "#ccc",
            padding: "2px 8px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ✔
        </button>
      </>
    ) : (
      <>
        {showData.finishedAt
          ? new Date(showData.finishedAt).toLocaleDateString()
          : "— not watched yet"}
        <button
          onClick={() => setEditingDateField("finishedAt")}
          style={{
            marginLeft: "8px",
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          ✏️
        </button>
      </>
    )}
  </div>
)}

        {/* ✅ Rewatch Section */}
        <div style={{ marginTop: "15px" }}>
          <h4>🔁 Rewatch Log</h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              maxWidth: "300px",
            }}
          >
            <input
              type="date"
              id="rewatchDate"
              style={{
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              id="rewatchNotes"
              placeholder="Add optional notes..."
              style={{
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={() => {
                const date =
                  document.getElementById("rewatchDate").value;
                const notes =
                  document.getElementById("rewatchNotes").value;
                addRewatchDate(date, notes);
                document.getElementById("rewatchDate").value = "";
                document.getElementById("rewatchNotes").value = "";
              }}
              style={{
                background: "#007BFF",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
                width: "fit-content",
              }}
            >
              ➕ Add Rewatch
            </button>
          </div>

          {showData.rewatches && showData.rewatches.length > 0 && (
            <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
              {showData.rewatches.map((r, i) => (
  <li
    key={i}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "6px",
    }}
  >
    <span>
      <strong>Rewatch {r.number || i + 1}:</strong>{" "}
      {new Date(r.date).toLocaleDateString()}{" "}
      {r.notes && `– ${r.notes}`}
    </span>
    <button
      onClick={() => deleteRewatch(i)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#ff4d4d",
        fontSize: "16px",
      }}
      title="Delete rewatch"
    >
      🗑️
    </button>
  </li>
))}

            </ul>
          )}
        </div>
      </div>
    </div>
  );

  // ✅ Return section last
  if (!showData) return <p>Loading show info...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Link to="/watchlist" style={{ textDecoration: "none", color: "#007BFF" }}>
        ⬅ Back to Watchlist
      </Link>

      <h2 style={{ marginTop: "10px" }}>{showData.title}</h2>
      <p>🎬 Type: {showData.type}</p>
      <p>⭐ Rating: {showData.rating || "No rating yet"}</p>

      {renderDateSection()}
    <h3>📝 Notes by Season</h3>
{/* 📁 Organized by Season */}
{notes.length > 0 ? (
  Object.entries(
    notes.reduce((acc, note) => {
      const season = note.season ? `Season ${note.season}` : "Misc Notes";
      if (!acc[season]) acc[season] = [];
      acc[season].push(note);
      return acc;
    }, {})
  ).map(([season, seasonNotes]) => (
    <details key={season} style={{ marginBottom: "10px" }}>
      <summary
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          background: "#f5f5f5",
          padding: "6px 10px",
          borderRadius: "6px",
        }}
      >
        📁 {season}
      </summary>
      <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
        {seasonNotes.map((note) => (
          <li key={note.id} style={{ marginBottom: "6px" }}>
            <strong>
              Ep {note.episode || "—"}:
            </strong>{" "}
            {note.text}
            <button
              onClick={() => handleDeleteNote(note.id)}
              style={{
                marginLeft: "8px",
                background: "none",
                border: "none",
                color: "#d9534f",
                cursor: "pointer",
              }}
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
    </details>
  ))
) : (
  <p>No notes yet.</p>
)}



{/* 🎬 Select Season & Episode */}
<div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
  <select
    value={selectedSeason}
    onChange={(e) => handleSeasonChange(e.target.value)}
    style={{
      padding: "6px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      width: "120px",
    }}
  >
    <option value="">Select Season</option>
    {seasons.map((s) => (
      <option key={s.id} value={s.season_number}>
        Season {s.season_number}
      </option>
    ))}
  </select>

  <select
    value={selectedEpisode}
    onChange={(e) => setSelectedEpisode(e.target.value)}
    disabled={!episodes.length}
    style={{
      padding: "6px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      width: "140px",
    }}
  >
    <option value="">Select Episode</option>
    {episodes.map((ep) => (
      <option key={ep.id} value={ep.episode_number}>
        Ep {ep.episode_number} — {ep.name}
      </option>
    ))}
  </select>
</div>

    <textarea
      placeholder="Add a new note..."
      value={noteText}
      onChange={(e) => setNoteText(e.target.value)}
      rows="3"
      style={{
        width: "100%",
        marginTop: "10px",
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ccc",
      }}
    />

    <button
      onClick={handleAddNote}
      style={{
        marginTop: "10px",
        background: "#007BFF",
        color: "white",
        padding: "8px 12px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      💾 Save Note
    </button>
  </div>
);
}

export default ShowNotes;