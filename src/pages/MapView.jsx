import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  LocateFixed,
  Loader2,
  AlertCircle,
  MapPin,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { properties, isValidCoordinates } from "../data/properties.js";
import { fetchListings } from "../api/listings.js";
import PropertyMap from "../components/PropertyMap/index.js";
import "../styles/mapview.css";

const RADIUS_OPTIONS = [5, 10, 25, 50];
const DEFAULT_RADIUS = 10;
const DEFAULT_MAX_PRICE = 1500000;

export default function MapView() {
  // Backend listings (normalized). Null = not yet loaded from API.
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selection + search/filter state (preserved from existing UI).
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);

  // Near-me / radius state.
  const [nearMe, setNearMe] = useState(false);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [userLocation, setUserLocation] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);

  // Load listings from the backend on mount.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchListings()
      .then((res) => {
        if (cancelled) return;
        if (res.ok) {
          setListings(res.listings);
          const firstMappable = res.listings.find((p) =>
            isValidCoordinates(p.lat, p.lng),
          );
          setActiveId(firstMappable?.id ?? res.listings[0]?.id ?? null);
        } else {
          setError(res.error || "Could not load listings.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Client-side search over the loaded backend listings.
  const sourceListings = listings ?? properties;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sourceListings.filter((p) => {
      const matchesQuery =
        !q ||
        (p.title || "").toLowerCase().includes(q) ||
        (p.location || "").toLowerCase().includes(q);
      const matchesPrice = (p.price || 0) <= maxPrice;
      return matchesQuery && matchesPrice;
    });
  }, [sourceListings, query, maxPrice]);

  const selected =
    filtered.find((p) => p.id === activeId) || filtered[0] || null;

  // ---------- Near me / proximity search ----------

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setUserLocation({ lat, lng });
        setNearMe(true);
        setGeoLoading(false);
        setLoading(true);
        fetchListings({ lat, lng, radiusKm: radius })
          .then((res) => {
            if (res.ok) {
              setListings(res.listings);
              const firstMappable = res.listings.find((p) =>
                isValidCoordinates(p.lat, p.lng),
              );
              setActiveId(firstMappable?.id ?? res.listings[0]?.id ?? null);
              if (res.listings.length === 0) {
                setGeoError(
                  `No listings found within ${radius} km of your location.`,
                );
              }
            } else {
              setError(res.error || "Proximity search failed.");
            }
          })
          .finally(() => setLoading(false));
      },
      (err) => {
        setGeoLoading(false);
        setNearMe(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError(
            "Location permission denied. Enable location access to search nearby.",
          );
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGeoError("Your location is currently unavailable.");
        } else if (err.code === err.TIMEOUT) {
          setGeoError("Timed out while getting your location.");
        } else {
          setGeoError("Could not determine your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
    // If near-me is already active, re-fetch with the new radius.
    if (nearMe) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setGeoLoading(false);
          setLoading(true);
          fetchListings({ lat, lng, radiusKm: newRadius })
            .then((res) => {
              if (res.ok) {
                setListings(res.listings);
                const firstMappable = res.listings.find((p) =>
                  isValidCoordinates(p.lat, p.lng),
                );
                setActiveId(firstMappable?.id ?? res.listings[0]?.id ?? null);
                setGeoError(
                  res.listings.length === 0
                    ? `No listings found within ${newRadius} km of your location.`
                    : null,
                );
              } else {
                setError(res.error || "Proximity search failed.");
              }
            })
            .finally(() => setLoading(false));
        },
        (err) => {
          setGeoLoading(false);
          setGeoError("Could not determine your location for radius search.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    }
  };

  const clearNearMe = () => {
    setNearMe(false);
    setGeoError(null);
    setRadius(DEFAULT_RADIUS);
    // Reload all listings.
    setLoading(true);
    fetchListings()
      .then((res) => {
        if (res.ok) {
          setListings(res.listings);
          const firstMappable = res.listings.find((p) =>
            isValidCoordinates(p.lat, p.lng),
          );
          setActiveId(firstMappable?.id ?? res.listings[0]?.id ?? null);
        } else {
          setError(res.error || "Could not load listings.");
        }
      })
      .finally(() => setLoading(false));
  };

  const resetFilters = () => {
    setQuery("");
    setMaxPrice(DEFAULT_MAX_PRICE);
  };

  return (
    <div className="re-page re-mapview">
      {/* Top bar */}
      <header className="re-mapview__topbar">
        <button className="re-btn re-btn--ghost re-mapview__back" type="button">
          <ArrowLeft size={18} />
          <span>Back to Listings</span>
        </button>

        <div className="re-mapview__searchwrap">
          <Search size={18} className="re-mapview__searchicon" />
          <input
            className="re-mapview__search"
            type="text"
            placeholder="Search by location, area, or landmark…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="re-mapview__searchclear"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          className={`re-btn re-btn--ghost re-mapview__filter ${filtersOpen ? "re-mapview__filter--open" : ""}`}
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </button>
      </header>

      {/* Near-me control row */}
      <div className="re-mapview__nearme">
        <button
          className={`re-btn re-btn--ghost re-mapview__nearme-btn ${nearMe ? "re-mapview__nearme-btn--active" : ""}`}
          type="button"
          onClick={nearMe ? clearNearMe : handleNearMe}
          disabled={geoLoading}
        >
          {geoLoading ? (
            <Loader2 size={16} className="re-mapview__spin" />
          ) : (
            <LocateFixed size={16} />
          )}
          {nearMe ? "Clear Near Me" : "Search Near Me"}
        </button>

        <div className="re-mapview__radius">
          <span className="re-mapview__radius-label">Radius:</span>
          <div className="re-mapview__radius-options">
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                className={`re-mapview__radius-chip ${radius === r ? "re-mapview__radius-chip--active" : ""}`}
                onClick={() => handleRadiusChange(r)}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Geolocation error banner */}
      {geoError && (
        <div className="re-mapview__banner re-mapview__banner--warn">
          <AlertCircle size={16} />
          <span>{geoError}</span>
          <button
            type="button"
            className="re-mapview__banner-close"
            aria-label="Dismiss"
            onClick={() => setGeoError(null)}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* API error banner */}
      {error && (
        <div className="re-mapview__banner re-mapview__banner--error">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button
            type="button"
            className="re-mapview__banner-close"
            aria-label="Dismiss"
            onClick={() => setError(null)}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filter panel */}
      {filtersOpen && (
        <div className="re-mapview__filters">
          <div className="re-mapview__filter-row">
            <label htmlFor="pf-price">Max Price</label>
            <input
              id="pf-price"
              type="range"
              min={500000}
              max={1500000}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <span className="re-mapview__filter-value">
              ${maxPrice.toLocaleString()}
            </span>
          </div>
          <button
            className="re-btn re-btn--ghost re-mapview__filter-reset"
            type="button"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      )}

      {/* Map */}
      <div className="re-mapview__body">
        <div className="re-mapview__map">
          {loading ? (
            <div className="re-mapview__loading">
              <Loader2 size={28} className="re-mapview__spin" />
              <p>Loading listings…</p>
            </div>
          ) : filtered.length > 0 ? (
            <PropertyMap
              properties={filtered}
              selectedId={selected?.id}
              onSelect={setActiveId}
              userLocation={userLocation}
              onViewDetails={(p) => {
                // Hook for future routing to property details page.
                // eslint-disable-next-line no-console
                console.info("View property details:", p.id);
              }}
            />
          ) : (
            <div className="re-mapview__empty">
              <Search size={28} />
              <h3>No properties found</h3>
              <p>Try adjusting your search or filters.</p>
              <button
                className="re-btn re-btn--primary"
                type="button"
                onClick={() => {
                  resetFilters();
                  if (nearMe) clearNearMe();
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
