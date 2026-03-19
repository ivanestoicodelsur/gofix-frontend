import { useState, useEffect, useMemo } from "react";
import { api } from "../services/api.js";

// ─── SVG helpers ──────────────────────────────────────────────────────────────
function sv(size) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
}

function PhoneIcon({ size = 24 }) {
  return (
    <svg {...sv(size)}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
    </svg>
  );
}

function TabletIcon({ size = 24 }) {
  return (
    <svg {...sv(size)}>
      <rect x="4" y="1" width="16" height="22" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
    </svg>
  );
}

function LaptopIcon({ size = 24 }) {
  return (
    <svg {...sv(size)}>
      <rect x="2" y="3" width="20" height="14" rx="1" />
      <polyline points="8 21 12 17 16 21" />
      <line x1="2" y1="21" x2="22" y2="21" />
    </svg>
  );
}

function CheckIcon({ size = 14 }) {
  return (
    <svg {...sv(size)}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ScreenIcon({ size = 28 }) {
  return (
    <svg {...sv(size)}>
      <rect x="2" y="3" width="20" height="14" rx="1" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function BatteryIcon({ size = 28 }) {
  return (
    <svg {...sv(size)}>
      <rect x="1" y="6" width="18" height="12" rx="2" />
      <line x1="23" y1="11" x2="23" y2="13" strokeWidth="3" />
      <line x1="5" y1="10" x2="5" y2="14" />
      <line x1="9" y1="10" x2="9" y2="14" />
      <line x1="13" y1="10" x2="13" y2="14" />
    </svg>
  );
}

function CameraIcon({ size = 28 }) {
  return (
    <svg {...sv(size)}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ZapIcon({ size = 28 }) {
  return (
    <svg {...sv(size)}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function WrenchIcon({ size = 28 }) {
  return (
    <svg {...sv(size)}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 20 }) {
  return (
    <svg {...sv(size)}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function FormIcon({ size = 20 }) {
  return (
    <svg {...sv(size)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

// ─── Brand logos (inline SVG / styled text) ───────────────────────────────────
function BrandLogo({ brand }) {
  switch ((brand || "").toLowerCase()) {
    case "apple":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="52" viewBox="0 0 814 1000" fill="currentColor">
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 652.8 23.4 545.4 23.4 440.5c0-175.8 114.4-268.9 226.3-268.9 59.7 0 109.4 38.8 147.2 38.8 35.8 0 92.2-40.8 159.3-40.8 25.2 0 127.3 2.6 196.3 104.5zM461.5 25.4c32.1-38.8 57.9-99.1 57.9-159.4 0-8.3-.6-16.7-2-23.8-54.5 2-118.2 36.2-157 77.4-28.1 31.2-56.4 91.5-56.4 152.8 0 9.7 1.6 19.4 2.6 22.5 3.6.6 9.7 1.3 15.8 1.3 49 0 109.4-33 139.1-70.8z" />
        </svg>
      );
    case "samsung":
      return (
        <span style={{ fontSize: "1.1rem", fontWeight: 900, letterSpacing: "0.08em", fontFamily: "'Arial Black', Arial, sans-serif" }}>SAMSUNG</span>
      );
    case "motorola":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="23" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <text x="26" y="34" textAnchor="middle" fontFamily="'Arial Black', Arial, sans-serif" fontSize="24" fontWeight="900" fill="currentColor">M</text>
        </svg>
      );
    case "google pixel":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="230" fill="none" stroke="currentColor" strokeWidth="28"/>
          <text x="250" y="310" textAnchor="middle" fontFamily="'Arial', sans-serif" fontSize="200" fontWeight="700" fill="currentColor">G</text>
        </svg>
      );
    case "lg":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="23" fill="none" stroke="currentColor" strokeWidth="2"/>
          <text x="26" y="33" textAnchor="middle" fontFamily="'Arial Black', Arial, sans-serif" fontSize="18" fontWeight="900" fill="currentColor">LG</text>
        </svg>
      );
    case "huawei":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
          {[0,60,120,180,240,300].map((angle, i) => (
            <ellipse key={i} cx="26" cy="26" rx="6" ry="18" fill="currentColor" opacity="0.85"
              transform={`rotate(${angle} 26 26)`} />
          ))}
        </svg>
      );
    case "xiaomi":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
          <rect x="4" y="10" width="13" height="32" rx="3" fill="currentColor"/>
          <rect x="20" y="10" width="12" height="32" rx="3" fill="currentColor"/>
          <path d="M32 10 h10 a6 6 0 0 1 6 6 v20 a6 6 0 0 1 -6 6 h-10 v-13 h7 v-6 h-7 Z" fill="currentColor"/>
        </svg>
      );
    default:
      return (
        <span style={{ fontSize: "2rem", fontWeight: 900 }}>
          {(brand || "?").charAt(0).toUpperCase()}
        </span>
      );
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = ["Dispositivo", "Marca", "Modelo", "Reparación"];

const DEVICE_TYPES = [
  { key: "smartphone", label: "Teléfono",     sub: "iPhone · Samsung · Motorola", Icon: PhoneIcon },
  { key: "tablet",     label: "Tablet / iPad", sub: "iPad · Samsung Tab",          Icon: TabletIcon },
  { key: "laptop",     label: "Laptop / Mac",  sub: "MacBook · PC portátil",       Icon: LaptopIcon },
];

function getRepairType(partName) {
  const n = (partName || "").toLowerCase();
  if (n.includes("pantalla") || n.includes("screen") || n.includes("display") || n.includes("retina") || n.includes("oled") || n.includes("led")) return "screen";
  if (n.includes("batería") || n.includes("battery") || n.includes("bateria")) return "battery";
  if (n.includes("cámara") || n.includes("camera") || n.includes("camara")) return "camera";
  if (n.includes("carga") || n.includes("charging") || n.includes("puerto") || n.includes("port") || n.includes("flex") || n.includes("lightning") || n.includes("usb")) return "charging";
  return "repair";
}

function RepairIcon({ type, size = 28 }) {
  switch (type) {
    case "screen":   return <ScreenIcon  size={size} />;
    case "battery":  return <BatteryIcon size={size} />;
    case "camera":   return <CameraIcon  size={size} />;
    case "charging": return <ZapIcon     size={size} />;
    default:         return <WrenchIcon  size={size} />;
  }
}

function fmtPrice(val) {
  return "$" + Number(val || 0).toFixed(0);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function QuoteWizard() {
  const [allDevices,     setAllDevices]    = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [step,        setStep]        = useState(0);
  const [sel,         setSel]         = useState({ type: null, brand: null, deviceId: null, partIds: [] });
  const [parts,       setParts]       = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [showPrices,  setShowPrices]  = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [formName,    setFormName]    = useState("");
  const [formPhone,   setFormPhone]   = useState("");

  function loadDevices() {
    setDevicesLoading(true);
    api.listLandingDevices()
      .then(res => setAllDevices(Array.isArray(res) ? res : []))
      .catch(() => setAllDevices([]))
      .finally(() => setDevicesLoading(false));
  }

  useEffect(() => { loadDevices(); }, []);

  // ── derived data ────────────────────────────────────────────────────────────
  const availableTypes = useMemo(
    () => DEVICE_TYPES.filter(dt => allDevices.some(d => d.type === dt.key)),
    [allDevices]
  );

  const brands = useMemo(() => {
    const pool = sel.type ? allDevices.filter(d => d.type === sel.type) : allDevices;
    return [...new Set(pool.map(d => d.brand).filter(Boolean))];
  }, [allDevices, sel.type]);

  const models = useMemo(() => {
    let pool = allDevices.filter(d =>
      (!sel.type  || d.type  === sel.type) &&
      (!sel.brand || d.brand === sel.brand)
    );
    if (modelSearch.trim()) {
      const q = modelSearch.toLowerCase();
      pool = pool.filter(d => `${d.brand} ${d.model}`.toLowerCase().includes(q));
    }
    return pool;
  }, [allDevices, sel.type, sel.brand, modelSearch]);

  const selectedDevice = useMemo(
    () => allDevices.find(d => d.id === sel.deviceId) || null,
    [allDevices, sel.deviceId]
  );

  const selectedParts = useMemo(
    () => parts.filter(p => sel.partIds.includes(p.id)),
    [parts, sel.partIds]
  );

  const totalPrice = useMemo(
    () => selectedParts.reduce((sum, p) => sum + Number(p.sale_price || 0), 0),
    [selectedParts]
  );

  // ── fetch parts when device changes ─────────────────────────────────────────
  useEffect(() => {
    if (!sel.deviceId) { setParts([]); setLoading(false); return; }
    let active = true;
    api.listLandingParts({ device_id: sel.deviceId })
      .then(res  => { if (active) setParts(Array.isArray(res) ? res : []); })
      .catch(()  => { if (active) setParts([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [sel.deviceId]);

  // ── handlers ─────────────────────────────────────────────────────────────────
  function pickType(type) {
    setSel({ type, brand: null, deviceId: null, partId: null });
    setStep(1);
  }

  function pickBrand(brand) {
    setSel(s => ({ ...s, brand, deviceId: null, partId: null }));
    setStep(2);
  }

  function pickModel(deviceId) {
    setLoading(true);          // set loading eagerly — batched with the other updates
    setParts([]);
    setShowForm(false);
    setSel(s => ({ ...s, deviceId, partIds: [] }));
    setStep(3);
  }

  function pickPart(partId) {
    setShowForm(false);
    setSel(s => {
      const already = s.partIds.includes(partId);
      return { ...s, partIds: already ? s.partIds.filter(id => id !== partId) : [...s.partIds, partId] };
    });
  }

  function goBack(targetStep) {
    if (targetStep >= step) return;
    if (targetStep <= 0) setSel({ type: null, brand: null, deviceId: null, partIds: [] });
    else if (targetStep <= 1) setSel(s => ({ ...s, brand: null, deviceId: null, partIds: [] }));
    else if (targetStep <= 2) setSel(s => ({ ...s, deviceId: null, partIds: [] }));
    setStep(targetStep);
    setModelSearch("");
    setShowForm(false);
  }

  function reset() {
    setSel({ type: null, brand: null, deviceId: null, partIds: [] });
    setParts([]);
    setStep(0);
    setModelSearch("");
    setShowForm(false);
    setFormName("");
    setFormPhone("");
    loadDevices();
  }

  const waMessageDirect = useMemo(() => {
    if (!selectedDevice || selectedParts.length === 0) return "";
    const list = selectedParts.map(p => `🔧 ${p.part_name} — ${fmtPrice(p.sale_price)}`).join("\n");
    return encodeURIComponent(
      `Hola GO FIX MIAMI! 👋\n\nQuiero cotizar:\n📱 ${selectedDevice.brand} ${selectedDevice.model}\n\n${list}\n\n💰 Total estimado: ${fmtPrice(totalPrice)}\n\n¿Cuándo pueden atenderme?`
    );
  }, [selectedDevice, selectedParts, totalPrice]);

  function buildFormWaMessage() {
    if (!selectedDevice || selectedParts.length === 0) return "";
    const list = selectedParts.map(p => `🔧 ${p.part_name} — ${fmtPrice(p.sale_price)}`).join("\n");
    const intro = formName.trim()
      ? `Mi nombre: ${formName.trim()}${formPhone.trim() ? `\nTeléfono: ${formPhone.trim()}` : ""}\n\n`
      : "";
    return encodeURIComponent(
      `Hola GO FIX MIAMI! 👋\n\n${intro}Quiero cotizar:\n📱 ${selectedDevice.brand} ${selectedDevice.model}\n\n${list}\n\n💰 Total estimado: ${fmtPrice(totalPrice)}\n\n¿Cuándo pueden atenderme?`
    );
  }

  async function saveTocrm({ name = "", phone = "" } = {}) {
    if (!selectedDevice) return;
    const issue = selectedParts.length > 0
      ? `${selectedDevice.brand} ${selectedDevice.model} — ${selectedParts.map(p => p.part_name).join(", ")} — Total: ${fmtPrice(totalPrice)}`
      : `${selectedDevice.brand} ${selectedDevice.model}`;
    try {
      const [first_name, ...rest] = (name || "Cliente WhatsApp").trim().split(/\s+/);
      await api.createLandingCustomer({
        first_name: first_name || "Cliente",
        last_name: rest.join(" "),
        phone: phone || "",
        city: "Miami",
        device_issue: issue,
      });
    } catch (_) { /* silencioso */ }
  }

  const selectedTypeLabel = DEVICE_TYPES.find(d => d.key === sel.type)?.label || null;

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div className="qw">

      {/* ── Stepper ── */}
      <nav className="qw-stepper" aria-label="Pasos">
        {STEPS.map((label, i) => (
          <div key={label} className="qw-step-wrapper">
            <button
              type="button"
              className={`qw-step${i === step ? " is-active" : ""}${i < step ? " is-done" : ""}`}
              onClick={() => goBack(i)}
              disabled={i >= step}
              aria-current={i === step ? "step" : undefined}
            >
              <span className="qw-step__dot">
                {i < step ? <CheckIcon size={14} /> : i + 1}
              </span>
              <span className="qw-step__label">{label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <span className={`qw-connector${i < step ? " is-done" : ""}`} aria-hidden="true" />
            )}
          </div>
        ))}
      </nav>

      {/* ── Body ── */}
      <div className="qw-body">

        {/* main content */}
        <div className="qw-main">

          {/* STEP 0 — device type */}
          {step === 0 && (
            <div className="qw-panel" key="s0">
              <p className="qw-panel__title">¿Qué tipo de dispositivo tienes?</p>
              {devicesLoading ? (
                <div className="qw-loading"><span className="qw-spinner" aria-hidden="true" /> Cargando inventario...</div>
              ) : (
              <div className="qw-type-grid">
                {(availableTypes.length > 0 ? availableTypes : DEVICE_TYPES).map(({ key, label, sub, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    className={`qw-type-card${sel.type === key ? " is-selected" : ""}`}
                    onClick={() => pickType(key)}
                  >
                    <span className="qw-type-card__icon"><Icon size={52} /></span>
                    <strong className="qw-type-card__label">{label}</strong>
                    <span className="qw-type-card__sub">{sub}</span>
                  </button>
                ))}
              </div>
              )}
            </div>
          )}

          {/* STEP 1 — brand */}
          {step === 1 && (
            <div className="qw-panel" key="s1">
              <p className="qw-panel__title">Selecciona la marca</p>
              {brands.length > 0 ? (
                <div className="qw-brand-grid">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      type="button"
                      className={`qw-brand-card${sel.brand === brand ? " is-selected" : ""}`}
                      onClick={() => pickBrand(brand)}
                    >
                      <span className="qw-brand-card__logo">
                        <BrandLogo brand={brand} />
                      </span>
                      <strong className="qw-brand-card__name">{brand}</strong>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="qw-empty">No hay marcas disponibles para este tipo de dispositivo.</p>
              )}
            </div>
          )}

          {/* STEP 2 — model */}
          {step === 2 && (
            <div className="qw-panel" key="s2">
              <p className="qw-panel__title">Elige el modelo exacto</p>
              <div className="qw-search-bar">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  className="qw-search-input"
                  placeholder="Buscar modelo..."
                  value={modelSearch}
                  onChange={e => setModelSearch(e.target.value)}
                  autoComplete="off"
                />
                {modelSearch && (
                  <button type="button" className="qw-search-clear" onClick={() => setModelSearch("")} aria-label="Limpiar búsqueda">✕</button>
                )}
              </div>
              {models.length > 0 ? (
                <div className="qw-model-grid">
                  {models.map(device => (
                    <button
                      key={device.id}
                      type="button"
                      className={`qw-model-card${sel.deviceId === device.id ? " is-selected" : ""}`}
                      onClick={() => pickModel(device.id)}
                    >
                      <span className="qw-model-card__brand">{device.brand}</span>
                      <strong className="qw-model-card__name">{device.model}</strong>
                      {device.series && (
                        <span className="qw-model-card__series">{device.series}</span>
                      )}
                      <span className="qw-model-card__count">{device.parts_count} servicios disponibles</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="qw-empty">
                  No se encontraron modelos{modelSearch ? ` para "${modelSearch}"` : ""}.
                </p>
              )}
            </div>
          )}

          {/* STEP 3 — repair */}
          {step === 3 && (
            <div className="qw-panel" key="s3">
              <div className="qw-panel__header">
                <div className="qw-panel__title-row">
                  <p className="qw-panel__title">¿Qué necesitas reparar?</p>
                  {sel.partIds.length > 0 && (
                    <span className="qw-selection-counter">
                      {sel.partIds.length} {sel.partIds.length === 1 ? "pieza" : "piezas"} seleccionada{sel.partIds.length === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
                <label className="qw-toggle">
                  <input
                    type="checkbox"
                    checked={showPrices}
                    onChange={e => setShowPrices(e.target.checked)}
                  />
                  <span>Mostrar precios</span>
                </label>
              </div>

              {loading ? (
                <div className="qw-loading">
                  <span className="qw-spinner" aria-hidden="true" />
                  Cargando servicios...
                </div>
              ) : parts.length > 0 ? (
                <div className="qw-repair-grid">
                  {parts.map(part => {
                    const isSelected = sel.partIds.includes(part.id);
                    return (
                      <button
                        key={part.id}
                        type="button"
                        className={`qw-repair-card${isSelected ? " is-selected" : ""}`}
                        onClick={() => pickPart(part.id)}
                      >
                        {isSelected && <span className="qw-repair-card__check" aria-hidden="true">✓</span>}
                        <span className="qw-repair-card__icon">
                          <RepairIcon type={getRepairType(part.part_name)} size={28} />
                        </span>
                        <strong className="qw-repair-card__name">{part.part_name}</strong>
                        <span className="qw-repair-card__quality">{part.quality}</span>
                        {showPrices && (
                          <b className="qw-repair-card__price">{fmtPrice(part.sale_price)}</b>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="qw-empty">No hay servicios registrados para este modelo.</p>
              )}
            </div>
          )}

        </div>

        {/* ── Sticky summary sidebar ── */}
        <aside className="qw-summary" aria-label="Resumen de cotización">
          <h4 className="qw-summary__title">Tu cotización</h4>

          <dl className="qw-summary__lines">
            <div className="qw-summary__line">
              <dt>Tipo</dt>
              <dd>{selectedTypeLabel || "—"}</dd>
            </div>
            <div className="qw-summary__line">
              <dt>Marca</dt>
              <dd>{sel.brand || "—"}</dd>
            </div>
            <div className="qw-summary__line">
              <dt>Modelo</dt>
              <dd>{selectedDevice?.model || "—"}</dd>
            </div>
          </dl>

          {selectedParts.length > 0 && (
            <div className="qw-selected-services">
              <p className="qw-selected-services__label">
                Servicios seleccionados ({selectedParts.length})
              </p>
              <ul className="qw-selected-services__list">
                {selectedParts.map(p => (
                  <li key={p.id} className="qw-selected-services__item">
                    <span>{p.part_name}</span>
                    <b>{fmtPrice(p.sale_price)}</b>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedParts.length > 0 && (
            <div className="qw-summary__price">
              <span>Total estimado</span>
              <b>{fmtPrice(totalPrice)}</b>
            </div>
          )}

          {selectedParts.length > 0 ? (
            showForm ? (
              <form
                className="qw-contact-form"
                onSubmit={async e => {
                  e.preventDefault();
                  await saveTocrm({ name: formName, phone: formPhone });
                  const msg = buildFormWaMessage();
                  if (msg) window.open(`https://wa.me/17868062197?text=${msg}`, "_blank");
                }}
              >
                <p className="qw-contact-form__title">Déjanos tus datos</p>
                <input
                  className="qw-contact-form__input"
                  type="text"
                  placeholder="Tu nombre"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  required
                />
                <input
                  className="qw-contact-form__input"
                  type="tel"
                  placeholder="Teléfono (ej: +1 786…)"
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  required
                />
                <button type="submit" className="qw-cta-btn">
                  <WhatsAppIcon size={18} />
                  Enviar solicitud
                </button>
                <button type="button" className="qw-contact-form__cancel" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
              </form>
            ) : (
              <div className="qw-cta-group">
                <button
                  type="button"
                  className="qw-cta-btn"
                  onClick={async () => {
                    await saveTocrm();
                    window.open(`https://wa.me/17868062197?text=${waMessageDirect}`, "_blank");
                  }}
                >
                  <WhatsAppIcon size={20} />
                  Preguntar por WhatsApp
                </button>
                <button
                  type="button"
                  className="qw-cta-btn qw-cta-btn--secondary"
                  onClick={() => setShowForm(true)}
                >
                  <FormIcon size={20} />
                  Solicitar presupuesto
                </button>
              </div>
            )
          ) : (
            <p className="qw-summary__hint">Selecciona uno o más servicios para ver el precio y contactarnos.</p>
          )}

          {(sel.type || sel.brand || sel.deviceId) && (
            <button type="button" className="qw-reset-btn" onClick={reset}>
              Empezar de nuevo
            </button>
          )}

          <p className="qw-summary__note">
            * Precio estimado sujeto a inspección física. Garantía de 90 días incluida.
          </p>
        </aside>

      </div>
    </div>
  );
}
