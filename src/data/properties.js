/* Shared sample data for the pluggable real-estate pages.
   Replace these arrays with real data / API calls when wiring
   the components into your project. */

export const properties = [
  {
    id: 1,
    title: "Modern Lakeside Villa",
    location: "Lakeshore Drive, Chicago, IL",
    price: 1250000,
    lat: 41.8924,
    lng: -87.6176,
    bedrooms: 4,
    bathrooms: 3,
    size: 3200,
    image:
      "https://images.pexels.com/photos/8082328/pexels-photo-8082328.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    id: 2,
    title: "Glass House Retreat",
    location: "Lincoln Park, Chicago, IL",
    price: 875000,
    lat: 41.9214,
    lng: -87.6523,
    bedrooms: 3,
    bathrooms: 2,
    size: 2400,
    image:
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    id: 3,
    title: "Stone & Wood Cottage",
    location: "Evanston, IL",
    price: 615000,
    lat: 42.0451,
    lng: -87.6877,
    bedrooms: 3,
    bathrooms: 2,
    size: 1850,
    image:
      "https://images.pexels.com/photos/7031406/pexels-photo-7031406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    id: 4,
    title: "Twin Modern Homes",
    location: "Oak Park, IL",
    price: 720000,
    lat: 41.8855,
    lng: -87.7845,
    bedrooms: 4,
    bathrooms: 3,
    size: 2750,
    image:
      "https://images.pexels.com/photos/30580640/pexels-photo-30580640.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    id: 5,
    title: "Panoramic Window Estate",
    location: "Naperville, IL",
    price: 980000,
    lat: 41.7508,
    lng: -88.1535,
    bedrooms: 5,
    bathrooms: 4,
    size: 4100,
    image:
      "https://images.pexels.com/photos/7031604/pexels-photo-7031604.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    id: 6,
    title: "Suburban Family Home",
    location: "Arlington Heights, IL",
    price: 540000,
    lat: 42.0884,
    lng: -87.9806,
    bedrooms: 4,
    bathrooms: 3,
    size: 2600,
    image:
      "https://images.pexels.com/photos/7031411/pexels-photo-7031411.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    id: 7,
    title: "Tropical White Villa",
    location: "Schaumburg, IL",
    price: 690000,
    lat: 42.0334,
    lng: -88.0834,
    bedrooms: 3,
    bathrooms: 3,
    size: 2200,
    image:
      "https://images.pexels.com/photos/19219055/pexels-photo-19219055.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    id: 8,
    title: "Driveway Luxury Residence",
    location: "Buffalo Grove, IL",
    price: 830000,
    lat: 42.1514,
    lng: -87.9581,
    bedrooms: 4,
    bathrooms: 3,
    size: 3050,
    image:
      "https://images.pexels.com/photos/8134821/pexels-photo-8134821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
];

export const formatPrice = (value) =>
  "$" + Number(value || 0).toLocaleString("en-US");

/* ---------- Backend data helpers ---------- */

const isNumber = (v) =>
  typeof v === "number" && Number.isFinite(v) && !Number.isNaN(v);

/* A coordinate pair is valid only if both latitude and longitude are
   real, finite numbers. We never treat 0/0 as a valid fallback. */
export const isValidCoordinates = (latitude, longitude) =>
  isNumber(latitude) && isNumber(longitude);

/* Normalize a backend listing object into the shape the existing
   Map View UI expects, while preserving the backend coordinate fields
   (latitude/longitude) as the source of truth. lat/lng are added only
   as compatibility fields for the existing Leaflet code. */
export const normalizeListing = (raw) => {
  if (!raw || typeof raw !== "object") return null;

  const latitude = raw.latitude ?? raw.lat;
  const longitude = raw.longitude ?? raw.lng;
  const hasCoords = isValidCoordinates(latitude, longitude);

  return {
    id: raw.id,
    title: raw.title ?? "Untitled listing",
    location: raw.location ?? raw.address ?? "",
    price: Number(raw.price ?? 0),
    latitude: hasCoords ? Number(latitude) : null,
    longitude: hasCoords ? Number(longitude) : null,
    lat: hasCoords ? Number(latitude) : null,
    lng: hasCoords ? Number(longitude) : null,
    bedrooms: Number(raw.bedrooms ?? raw.beds ?? 0),
    bathrooms: Number(raw.bathrooms ?? raw.baths ?? 0),
    size: Number(raw.size ?? raw.area ?? raw.sqft ?? 0),
    image:
      raw.image ??
      raw.photo ??
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    hasCoordinates: hasCoords,
  };
};

/* Normalize an array of backend listings. */
export const normalizeListings = (list) =>
  Array.isArray(list) ? list.map(normalizeListing).filter(Boolean) : [];
