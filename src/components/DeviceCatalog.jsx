import { useEffect, useState, useMemo } from "react";
import { api } from "../services/api.js";

/* ══════════════════════════════════════════════════════════════
   CATEGORY CONFIG
   ══════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  {
    id: "iphone",
    label: "iPhone",
    icon: (
      <svg width="28" height="28" viewBox="0 0 814 1000" fill="#a8a8b3">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.7 0 248.3 0 122.3 0 38.3 55.8 0 109.2 0c99.5 0 159.3 79.9 222.5 79.9 59.5 0 130.8-83.6 240.4-83.6 35 0 133.3 3.2 201.2 99.5zm-234-181.5c28.3-35.7 47.6-85.7 47.6-135.7 0-6.9-.6-13.9-1.9-19.5-45.1 1.9-99 30.2-131.2 71.2-28.3 33.9-50.8 83.9-50.8 133.9 0 7.5.6 15.1 1.3 17.6 3.8.6 10.1 1.3 16.3 1.3 40.6 0 90.3-27.2 118.7-68.8z"/>
      </svg>
    ),
    accent: "#a8a8b3",
    glow: "rgba(168,168,179,0.15)",
    match: (d) => d.brand === "Apple" && (d.type === "smartphone" || (!d.type && /^iphone/i.test(d.model))),
  },
  {
    id: "ipad",
    label: "iPad",
    icon: "📟",
    accent: "#60a5fa",
    glow: "rgba(96,165,250,0.15)",
    match: (d) => d.brand === "Apple" && (d.type === "tablet" || (!d.type && /^ipad/i.test(d.model))),
  },
  {
    id: "macbook",
    label: "MacBook",
    icon: "💻",
    accent: "#d4af37",
    glow: "rgba(212,175,55,0.15)",
    match: (d) =>
      d.brand === "Apple" &&
      (d.type === "laptop" || d.type === "desktop" || (!d.type && /^macbook|^imac/i.test(d.model))),
  },
  {
    id: "samsung",
    label: "Samsung",
    icon: "🌐",
    accent: "#6ea8fe",
    glow: "rgba(110,168,254,0.15)",
    match: (d) => d.brand === "Samsung",
  },
  {
    id: "motorola",
    label: "Motorola",
    icon: "📡",
    accent: "#f87171",
    glow: "rgba(248,113,113,0.15)",
    match: (d) => d.brand === "Motorola",
  },
  {
    id: "google",
    label: "Google Pixel",
    icon: "🔍",
    accent: "#4ade80",
    glow: "rgba(74,222,128,0.15)",
    match: (d) => d.brand === "Google Pixel",
  },
  {
    id: "other",
    label: "Otros",
    icon: "🔧",
    accent: "#94a3b8",
    glow: "rgba(148,163,184,0.1)",
    match: (d) => !["Apple", "Samsung", "Motorola", "Google Pixel"].includes(d.brand),
  },
];

/* ══════════════════════════════════════════════════════════════
   QUALITY BUCKETS — OEM vs Copy
   ══════════════════════════════════════════════════════════════ */
function qualityBucket(q = "") {
  const ql = q.toLowerCase().trim();
  if (/oem|original/.test(ql)) return "oem";
  if (/aftermarket|copy|copia|gen[eé]rico|generico|copy/.test(ql)) return "copy";
  return "other";
}

const Q = {
  oem:   { label: "OEM",   color: "#4ade80", bg: "rgba(74,222,128,.12)",  border: "rgba(74,222,128,.28)" },
  copy:  { label: "Copy",  color: "#fbbf24", bg: "rgba(251,191,36,.1)",   border: "rgba(251,191,36,.25)" },
  other: { label: "Std",   color: "#a5b4fc", bg: "rgba(165,180,252,.1)",  border: "rgba(165,180,252,.22)" },
};

/* ══════════════════════════════════════════════════════════════
   MODEL SORTING  newest → oldest
   ══════════════════════════════════════════════════════════════ */
function modelSortScore(model = "") {
  const m = model.match(/(\d+(\.\d+)?)/);
  const num = m ? parseFloat(m[0]) : 0;
  // sub-tier: Pro Max > Pro > Plus/Max > base
  const tier =
    /pro\s*max/i.test(model) ? 0.40 :
    /pro/i.test(model)       ? 0.30 :
    /plus|ultra/i.test(model)? 0.20 :
    /max/i.test(model)       ? 0.15 : 0.10;
  return num + tier;
}

/* ══════════════════════════════════════════════════════════════
   SERVICE ICON helper
   ══════════════════════════════════════════════════════════════ */
function serviceIcon(name = "") {
  if (/pantalla|screen|display|lcd|oled/i.test(name))       return "📱";
  if (/bater[ií]a|battery/i.test(name))                     return "🔋";
  if (/c[aá]mara|camera/i.test(name))                       return "📷";
  if (/puerto|charging|carga|usb|lightning/i.test(name))    return "⚡";
  if (/altavoz|speaker|bocina|audio/i.test(name))           return "🔊";
  if (/bot[oó]n|button|home|power|volumen/i.test(name))     return "🔘";
  if (/tactil|touch|digitizer/i.test(name))                 return "👆";
  if (/chasis|back|carcasa|cover/i.test(name))              return "🔩";
  if (/agua|water|liquid/i.test(name))                      return "💧";
  return "🔧";
}

/* ══════════════════════════════════════════════════════════════
   BREADCRUMB STEPPER
   ══════════════════════════════════════════════════════════════ */
function Stepper({ step, selCat, selDevice, onClickStep }) {
  const steps = [
    { label: "Tipo", detail: selCat ? `${selCat.label}` : null },
    { label: "Modelo", detail: selDevice?.model || null },
    { label: "Precios", detail: null },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 36, flexWrap: "wrap" }}>
      {steps.map((s, i) => {
        const active = step === i;
        const done   = step > i;
        return (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => done && onClickStep(i)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "none", border: "none",
                cursor: done ? "pointer" : "default", padding: 0,
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: "50%", fontSize: 10, fontWeight: 900,
                display: "grid", placeItems: "center", flexShrink: 0,
                background: done ? "#d4af37" : active ? "rgba(212,175,55,0.18)" : "rgba(255,255,255,0.04)",
                border: active ? "1.5px solid #d4af37" : done ? "none" : "1.5px solid rgba(255,255,255,0.1)",
                color: done ? "#0a0a0a" : active ? "#d4af37" : "#374151",
                transition: "all .25s",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: active ? "#f1f5f9" : done ? "#d4af37" : "#374151",
                  lineHeight: 1.2,
                }}>
                  {s.label}
                </div>
                {s.detail && done && (
                  <div style={{ fontSize: 10, color: "#475569", lineHeight: 1 }}>{s.detail}</div>
                )}
              </div>
            </button>
            {i < 2 && (
              <div style={{
                width: 20, height: 1, flexShrink: 0,
                background: done ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.06)",
                transition: "background .3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function DeviceCatalog() {
  const [devices, setDevices]   = useState([]);
  const [partsMap, setPartsMap] = useState({});
  const [loading, setLoading]   = useState(true);

  const [step, setStep]           = useState(0); // 0=category 1=model 2=prices
  const [selCatId, setSelCatId]   = useState(null);
  const [selDevice, setSelDevice] = useState(null);
  const [modelSearch, setModelSearch] = useState("");

  useEffect(() => {
    Promise.all([api.listLandingDevices({}), api.listLandingParts({})])
      .then(([devs, parts]) => {
        const devList = Array.isArray(devs) ? devs : [];
        const map = {};
        (Array.isArray(parts) ? parts : []).forEach((p) => {
          if (!map[p.device_id]) map[p.device_id] = [];
          map[p.device_id].push(p);
        });
        setDevices(devList);
        setPartsMap(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Only show categories that have at least one device
  const activeCats = useMemo(
    () => CATEGORIES.filter((cat) => devices.some((d) => cat.match(d))),
    [devices]
  );

  const selCat = CATEGORIES.find((c) => c.id === selCatId) || null;

  // Models for selected category, sorted newest → oldest
  const models = useMemo(() => {
    if (!selCat) return [];
    const q = modelSearch.toLowerCase();
    return devices
      .filter((d) => selCat.match(d))
      .filter((d) => !q || `${d.model} ${d.series || ""}`.toLowerCase().includes(q))
      .sort((a, b) => modelSortScore(b.model) - modelSortScore(a.model));
  }, [devices, selCat, modelSearch]);

  // Price table: group by part_name → { oem, copy, other }
  const priceTable = useMemo(() => {
    if (!selDevice) return [];
    const parts = partsMap[selDevice.id] || [];
    const rows = new Map();
    parts.forEach((p) => {
      if (!rows.has(p.part_name)) rows.set(p.part_name, { oem: null, copy: null, other: null });
      const bucket = qualityBucket(p.quality);
      const row = rows.get(p.part_name);
      if (p.sale_price > 0) row[bucket] = p.sale_price;
    });
    return [...rows.entries()].map(([name, prices]) => ({ name, ...prices }));
  }, [partsMap, selDevice]);

  const hasOEM  = priceTable.some((r) => r.oem  !== null);
  const hasCopy = priceTable.some((r) => r.copy !== null);

  // Navigation
  function pickCat(catId) {
    setSelCatId(catId);
    setModelSearch("");
    setSelDevice(null);
    setStep(1);
  }
  function pickDevice(d) {
    setSelDevice(d);
    setStep(2);
  }
  function handleStepClick(i) {
    if (i === 0) { setStep(0); setSelCatId(null); setSelDevice(null); setModelSearch(""); }
    if (i === 1) { setStep(1); setSelDevice(null); }
  }
  function goBack() {
    if (step === 2) { setStep(1); setSelDevice(null); }
    else if (step === 1) { setStep(0); setSelCatId(null); setModelSearch(""); }
  }
  function reset() {
    setStep(0); setSelCatId(null); setSelDevice(null); setModelSearch("");
  }

  /* ── Loading ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#475569", fontSize: 14 }}>
        <div style={{
          width: 32, height: 32, border: "2.5px solid rgba(212,175,55,.25)",
          borderTopColor: "#d4af37", borderRadius: "50%",
          animation: "dc-spin .8s linear infinite",
          margin: "0 auto 16px",
        }} />
        <style>{`@keyframes dc-spin { to { transform: rotate(360deg); } }`}</style>
        Cargando catálogo...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>

      {/* ── Breadcrumb stepper ─────────────────────────────── */}
      <Stepper step={step} selCat={selCat} selDevice={selDevice} onClickStep={handleStepClick} />

      {/* ══════════════════════════════════════════════════════
          STEP 0 — CATEGORY GRID
          ══════════════════════════════════════════════════════ */}
      {step === 0 && (
        <div>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24, fontWeight: 500 }}>
            Selecciona el tipo de dispositivo que necesitas reparar
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 14,
          }}>
            {activeCats.map((cat) => {
              const count = devices.filter((d) => cat.match(d)).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => pickCat(cat.id)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 14, padding: "30px 16px 24px", borderRadius: 22, cursor: "pointer",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    transition: "all .22s", textAlign: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = cat.glow;
                    e.currentTarget.style.borderColor = `${cat.accent}55`;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.35), 0 0 0 1px ${cat.accent}22`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: 18, fontSize: 26,
                    display: "grid", placeItems: "center",
                    background: `${cat.accent}11`,
                    border: `1px solid ${cat.accent}30`,
                  }}>
                    {typeof cat.icon === "string" ? cat.icon : cat.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#f1f5f9", marginBottom: 5 }}>
                      {cat.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#374151", fontWeight: 600 }}>
                      {count} modelos
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          STEP 1 — MODEL LIST  (nuevo → viejo)
          ══════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button
              onClick={goBack}
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#64748b", cursor: "pointer", padding: "8px 12px",
                borderRadius: 10, fontSize: 15, lineHeight: 1, transition: "all .15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#f1f5f9"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >←</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#f1f5f9" }}>
                {selCat?.label}
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                {models.length} modelos · ordenados del más nuevo al más antiguo
              </div>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <svg
              style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              autoFocus
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              placeholder={`Buscar en ${selCat?.label}…`}
              style={{
                width: "100%", padding: "12px 14px 12px 38px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 12, color: "#f1f5f9", fontSize: 13, outline: "none",
                boxSizing: "border-box", transition: "border-color .2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
            />
            {modelSearch && (
              <button
                onClick={() => setModelSearch("")}
                style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#374151", cursor: "pointer", fontSize: 14,
                }}
              >✕</button>
            )}
          </div>

          {/* Model grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))",
            gap: 10,
            maxHeight: 440,
            overflowY: "auto",
            paddingRight: 4,
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(212,175,55,0.2) transparent",
          }}>
            {models.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 0", color: "#374151", fontSize: 13 }}>
                No se encontraron modelos.
              </div>
            ) : (
              models.map((d) => {
                const parts   = partsMap[d.id] || [];
                const prices  = parts.map((p) => p.sale_price).filter(Boolean);
                const minP    = prices.length ? Math.min(...prices) : 0;
                const hasO    = parts.some((p) => qualityBucket(p.quality) === "oem");
                const hasC    = parts.some((p) => qualityBucket(p.quality) === "copy");

                return (
                  <button
                    key={d.id}
                    onClick={() => pickDevice(d)}
                    style={{
                      display: "flex", flexDirection: "column", gap: 10,
                      padding: "16px 14px", borderRadius: 16, cursor: "pointer",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      transition: "all .18s", textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(212,175,55,0.08)";
                      e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Model name */}
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#f1f5f9", lineHeight: 1.3 }}>
                      {d.model}
                    </div>
                    {d.series && d.series !== d.model && (
                      <div style={{ fontSize: 10, color: "#374151", marginTop: -6 }}>{d.series}</div>
                    )}

                    {/* Quality badges */}
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {hasO && (
                        <span style={{
                          fontSize: 9, padding: "2px 7px", borderRadius: 99,
                          background: Q.oem.bg, color: Q.oem.color, border: `1px solid ${Q.oem.border}`,
                          fontWeight: 800, letterSpacing: "0.04em",
                        }}>OEM</span>
                      )}
                      {hasC && (
                        <span style={{
                          fontSize: 9, padding: "2px 7px", borderRadius: 99,
                          background: Q.copy.bg, color: Q.copy.color, border: `1px solid ${Q.copy.border}`,
                          fontWeight: 800, letterSpacing: "0.04em",
                        }}>Copy</span>
                      )}
                    </div>

                    {/* Price + arrow */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                      {minP > 0 ? (
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#d4af37" }}>desde ${minP}</span>
                      ) : (
                        <span style={{ fontSize: 11, color: "#374151" }}>{parts.length} servicios</span>
                      )}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          STEP 2 — PRICE TABLE  (OEM | Copy)
          ══════════════════════════════════════════════════════ */}
      {step === 2 && selDevice && (() => {
        const allPrices = (partsMap[selDevice.id] || []).map((p) => p.sale_price).filter(Boolean);
        const minPrice  = allPrices.length ? Math.min(...allPrices) : 0;

        return (
          <div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24 }}>
              <button
                onClick={goBack}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#64748b", cursor: "pointer", padding: "8px 12px",
                  borderRadius: 10, fontSize: 15, lineHeight: 1, flexShrink: 0, transition: "all .15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#f1f5f9"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >←</button>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: "#f1f5f9", lineHeight: 1.2 }}>
                  {selDevice.model}
                </div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>
                  {selDevice.brand} · {priceTable.length} {priceTable.length === 1 ? "servicio" : "servicios disponibles"}
                </div>
              </div>

              {minPrice > 0 && (
                <div style={{
                  padding: "5px 14px", borderRadius: 99, flexShrink: 0, alignSelf: "center",
                  background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)",
                  fontSize: 12, fontWeight: 800, color: "#d4af37",
                }}>
                  desde ${minPrice}
                </div>
              )}
            </div>

            {/* Quality legend */}
            {(hasOEM || hasCopy) && (
              <div style={{
                display: "flex", gap: 20, marginBottom: 18,
                padding: "12px 16px", borderRadius: 12,
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                flexWrap: "wrap",
              }}>
                {hasOEM && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: Q.oem.color, flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: Q.oem.color }}>OEM </span>
                      <span style={{ fontSize: 11, color: "#475569" }}>— Calidad original, mayor durabilidad y garantía</span>
                    </div>
                  </div>
                )}
                {hasCopy && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: Q.copy.color, flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: Q.copy.color }}>Copy </span>
                      <span style={{ fontSize: 11, color: "#475569" }}>— Funcional y económica, precio accesible</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Price table or empty */}
            {priceTable.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "48px 20px",
                background: "rgba(255,255,255,0.02)", borderRadius: 18,
                border: "1px dashed rgba(255,255,255,0.08)",
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
                <div style={{ color: "#64748b", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  Contáctanos para cotizar este modelo
                </div>
                <div style={{ color: "#374151", fontSize: 12, marginBottom: 20 }}>
                  Te damos precio personalizado por WhatsApp en minutos
                </div>
                <a
                  href={`https://wa.me/17868062197?text=${encodeURIComponent(`Hola GO FIX MIAMI, necesito cotización para reparar mi ${selDevice.model}.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "12px 24px", borderRadius: 14,
                    background: "linear-gradient(135deg,#22c55e,#16a34a)",
                    color: "#fff", fontWeight: 800, fontSize: 13, textDecoration: "none",
                    boxShadow: "0 8px 24px rgba(34,197,94,0.3)",
                  }}
                >
                  Preguntar por WhatsApp →
                </a>
              </div>
            ) : (
              <div style={{
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
                background: "rgba(255,255,255,0.015)",
              }}>
                {/* Table header row */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `1fr${hasOEM ? " 100px" : ""}${hasCopy ? " 100px" : ""} 52px`,
                  padding: "11px 20px",
                  background: "rgba(255,255,255,0.04)",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  gap: 8,
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 900, color: "#374151",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>Servicio</span>
                  {hasOEM && (
                    <span style={{
                      fontSize: 10, fontWeight: 900, color: Q.oem.color,
                      textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center",
                    }}>OEM</span>
                  )}
                  {hasCopy && (
                    <span style={{
                      fontSize: 10, fontWeight: 900, color: Q.copy.color,
                      textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center",
                    }}>Copy</span>
                  )}
                  <span />
                </div>

                {/* Rows */}
                <div style={{ maxHeight: 400, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "rgba(212,175,55,0.2) transparent" }}>
                  {priceTable.map((row, idx) => {
                    const price   = row.oem || row.copy || row.other;
                    const waText  = encodeURIComponent(
                      `Hola GO FIX MIAMI, quiero reparar mi ${selDevice.model}.\nServicio: ${row.name}${price ? ` ($${price})` : ""}`
                    );
                    const isLast  = idx === priceTable.length - 1;

                    return (
                      <div
                        key={row.name}
                        style={{
                          display: "grid",
                          gridTemplateColumns: `1fr${hasOEM ? " 100px" : ""}${hasCopy ? " 100px" : ""} 52px`,
                          alignItems: "center",
                          padding: "15px 20px",
                          gap: 8,
                          borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.05)",
                          transition: "background .12s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {/* Service name + icon */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                          <span style={{ fontSize: 16, flexShrink: 0 }}>{serviceIcon(row.name)}</span>
                          <span style={{ fontWeight: 600, fontSize: 13, color: "#e2e8f0", lineHeight: 1.3 }}>
                            {row.name}
                          </span>
                        </div>

                        {/* OEM price */}
                        {hasOEM && (
                          <div style={{ textAlign: "center" }}>
                            {row.oem !== null ? (
                              <span style={{
                                display: "inline-block",
                                fontWeight: 900, fontSize: 15, color: Q.oem.color,
                                padding: "4px 10px", borderRadius: 8,
                                background: Q.oem.bg, border: `1px solid ${Q.oem.border}`,
                              }}>
                                ${row.oem}
                              </span>
                            ) : (
                              <span style={{ color: "#1f2937", fontSize: 13 }}>—</span>
                            )}
                          </div>
                        )}

                        {/* Copy price */}
                        {hasCopy && (
                          <div style={{ textAlign: "center" }}>
                            {row.copy !== null ? (
                              <span style={{
                                display: "inline-block",
                                fontWeight: 900, fontSize: 15, color: Q.copy.color,
                                padding: "4px 10px", borderRadius: 8,
                                background: Q.copy.bg, border: `1px solid ${Q.copy.border}`,
                              }}>
                                ${row.copy}
                              </span>
                            ) : (
                              <span style={{ color: "#1f2937", fontSize: 13 }}>—</span>
                            )}
                          </div>
                        )}

                        {/* WhatsApp CTA */}
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <a
                            href={`https://wa.me/17868062197?text=${waText}`}
                            target="_blank" rel="noopener noreferrer"
                            title="Reservar por WhatsApp"
                            style={{
                              width: 34, height: 34, borderRadius: "50%",
                              background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)",
                              display: "grid", placeItems: "center", flexShrink: 0,
                              transition: "all .15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(37,211,102,0.25)";
                              e.currentTarget.style.transform = "scale(1.12)";
                              e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,211,102,0.25)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "rgba(37,211,102,0.1)";
                              e.currentTarget.style.transform = "none";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#4ade80">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Table footer — total CTA */}
                <div style={{
                  padding: "14px 20px",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(0,0,0,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  flexWrap: "wrap",
                }}>
                  <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>
                    Incluye garantía de 90 días · Servicio a domicilio
                  </span>
                  <a
                    href={`https://wa.me/17868062197?text=${encodeURIComponent(`Hola GO FIX MIAMI, quiero cotizar reparación para mi ${selDevice.model}.`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "9px 18px", borderRadius: 12,
                      background: "linear-gradient(135deg,#22c55e,#16a34a)",
                      color: "#fff", fontWeight: 800, fontSize: 12, textDecoration: "none",
                      transition: "all .2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(34,197,94,0.35)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    Reservar por WhatsApp →
                  </a>
                </div>
              </div>
            )}

            {/* Reset */}
            <button
              onClick={reset}
              style={{
                marginTop: 16, width: "100%", padding: "12px",
                borderRadius: 12, background: "transparent",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#374151", fontSize: 13, cursor: "pointer", fontWeight: 600,
                transition: "all .15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#374151"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              ← Buscar otro dispositivo
            </button>
          </div>
        );
      })()}

    </div>
  );
}
