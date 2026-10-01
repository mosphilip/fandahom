import { useState } from "react";
import MapView from "./pages/MapView.jsx";
import Profile from "./pages/Profile.jsx";
import Contact from "./pages/Contact.jsx";
import "./styles/theme.css";

function App() {
  const [page, setPage] = useState("map");

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Lightweight demo switcher — remove when integrating */}
      <div
        style={{
          position: "fixed",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5000,
          display: "flex",
          gap: 8,
          background: "rgba(22,26,29,0.9)",
          padding: "6px",
          borderRadius: 999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        {[
          ["map", "Map View"],
          ["profile", "Profile"],
          ["contact", "Contact"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "8px 14px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              background: page === key ? "#1f6c69" : "transparent",
              color: page === key ? "#fff" : "rgba(255,255,255,0.7)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {page === "map" && <MapView />}
      {page === "profile" && <Profile />}
      {page === "contact" && <Contact />}
    </div>
  );
}

export default App;
