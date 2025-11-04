// src/services/firestore.js
import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc, 
} from "firebase/firestore";

// 🔹 Update rating
export const updateShowRating = async (id, newRating) => {
  const ref = doc(db, "watchlist", id);
  await updateDoc(ref, {
    rating: newRating,
    updatedAt: new Date().toISOString(),
  });
};

// 🔹 Update status (with auto dates)
export const updateShowStatus = async (id, newStatus) => {
  const ref = doc(db, "watchlist", id);

  const updateData = { status: newStatus, updatedAt: new Date().toISOString() };

  if (newStatus === "watching") {
    updateData.startedAt = new Date().toISOString();
  }

  if (newStatus === "completed") {
    updateData.finishedAt = new Date().toISOString();
  }

  await updateDoc(ref, updateData);
};


// 🔹 Fetch all shows
export const getAllShows = async () => {
  const snapshot = await getDocs(collection(db, "watchlist"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 🔹 Fetch a single show by ID
export const getShowById = async (id) => {
  const ref = doc(db, "watchlist", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// 🔹 Add a new show
export const addShow = async (data) => {
  const ref = collection(db, "watchlist");
  await addDoc(ref, data);
};

// 🔹 Delete a show
export const deleteShow = async (id) => {
  await deleteDoc(doc(db, "watchlist", id));
};

// 🔹 Fetch a show + its episode notes
export const getShowWithNotes = async (id) => {
  const showRef = doc(db, "watchlist", id);
  const showSnap = await getDoc(showRef);

  if (!showSnap.exists()) return null;

  const showData = { id: showSnap.id, ...showSnap.data() };

  // 🔹 Choose correct subcollection
  const notesCollection = collection(
    showRef,
    showData.type === "tv" ? "episodes" : "notes"
  );

  const notesSnap = await getDocs(notesCollection);
  const notes = notesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return { ...showData, notes };
};

// 🔹 Add new note (handles both movies and TV shows)
export const addNote = async (showId, showType, noteData) => {
  const showRef = doc(db, "watchlist", showId);

  if (showType === "tv") {
    const notesRef = collection(showRef, "episodes");
    await addDoc(notesRef, noteData); // ✅ just use noteData
  } else {
    const notesRef = collection(showRef, "notes");
    await addDoc(notesRef, noteData); // ✅ same here
  }
};




// 🔹 Delete an episode note
export const deleteNote = async (showId, showType, noteId) => {
  const showRef = doc(db, "watchlist", showId);
  const noteRef = doc(
    showRef,
    showType === "tv" ? "episodes" : "notes",
    noteId
  );
  await deleteDoc(noteRef);
};
// Add a Show to Watchlist from Search
export const addShowToWatchlist = async (showData) => {
  const ref = collection(db, "watchlist");
  await addDoc(ref, showData);

};


