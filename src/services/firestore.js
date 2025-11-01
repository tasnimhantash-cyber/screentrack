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

  const notesSnap = await getDocs(collection(showRef, "episodeNotes"));
  const notes = notesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return { id: showSnap.id, ...showSnap.data(), notes };
};

// 🔹 Add new episode note
export const addEpisodeNote = async (showId, noteData) => {
  const showRef = doc(db, "watchlist", showId);
  const notesRef = collection(showRef, "episodeNotes");
  await addDoc(notesRef, noteData);
};

// 🔹 Delete an episode note
export const deleteEpisodeNote = async (showId, noteId) => {
  const noteRef = doc(db, "watchlist", showId, "episodeNotes", noteId);
  await deleteDoc(noteRef);
};
// Add a Show to Watchlist from Search
export const addShowToWatchlist = async (showData) => {
  const ref = collection(db, "watchlist");
  await addDoc(ref, showData);

};


