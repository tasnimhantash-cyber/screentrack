// src/services/tmdb.js
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// 🔹 Get all seasons for a TV show
export const getSeasons = async (tmdbId) => {
  try {
    const res = await fetch(`${BASE_URL}/tv/${tmdbId}?api_key=${API_KEY}`);
    const data = await res.json();
    return data.seasons || [];
  } catch (error) {
    console.error("Error fetching seasons:", error);
    return [];
  }
};

// 🔹 Get all episodes for a specific season
export const getEpisodes = async (tmdbId, seasonNumber) => {
  try {
    const res = await fetch(
      `${BASE_URL}/tv/${tmdbId}/season/${seasonNumber}?api_key=${API_KEY}`
    );
    const data = await res.json();
    return data.episodes || [];
  } catch (error) {
    console.error("Error fetching episodes:", error);
    return [];
  }
};
