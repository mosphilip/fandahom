import { normalizeListings } from "../data/properties.js";

const API_BASE = "http://localhost:8000";
const LISTING_PATH = "/listing/";

/* Extract the listings array from a backend response that may be
   either a bare array or an object with a `listings` key. */
function extractListings(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.listings)) return data.listings;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

/**
 * Fetch listings from the backend.
 *
 * @param {object} [options]
 * @param {number} [options.lat]      - user latitude for proximity search
 * @param {number} [options.lng]      - user longitude for proximity search
 * @param {number} [options.radiusKm] - radius in kilometres
 * @returns {Promise<{listings: object[], ok: boolean, error?: string}>}
 */
export async function fetchListings({ lat, lng, radiusKm } = {}) {
  const url = new URL(API_BASE + LISTING_PATH);

  if (
    typeof lat === "number" &&
    typeof lng === "number" &&
    typeof radiusKm === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Number.isFinite(radiusKm)
  ) {
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lng", String(lng));
    url.searchParams.set("radius_km", String(radiusKm));
  }

  let res;
  try {
    res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
  } catch (err) {
    return {
      ok: false,
      error: "Network error — could not reach the server.",
      listings: [],
    };
  }

  if (!res.ok) {
    return {
      ok: false,
      error: `Server error (status ${res.status}). Please try again.`,
      listings: [],
    };
  }

  let data;
  try {
    data = await res.json();
  } catch (err) {
    return {
      ok: false,
      error: "Received a malformed response from the server.",
      listings: [],
    };
  }

  const rawListings = extractListings(data);
  const listings = normalizeListings(rawListings);

  return { ok: true, listings };
}
