import { useEffect, useState } from "react";
import { Search, MessageCircle, Database, Server, Cpu } from "../components/Icons.jsx";
import { api } from "../services/api.js";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers(q = "") {
    setLoading(true);
    setError("");
    try {
      const data = await api.listCustomers({ search: q });
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar clientes.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event) {
    setSearch(event.target.value);
    fetchCustomers(event.target.value);
  }

  function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("es-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="stack-gap">
      {/* Header */}
      <div className="dashboard-hero panel-card">
        <div className="dashboard-hero__copy">
          <span className="eyebrow">Clientes · Solicitudes · Base de datos</span>
          <h2>Solicitudes desde la landing</h2>
          <p className="muted-text">
            Cada vez que alguien llena el formulario de GO FIX MIAMI, sus datos llegan aquí en tiempo real.
          </p>
        </div>
      </div>

      {/* Search + count */}
      <section className="inv-table-section panel-card">
        <div className="section-header compact section-header--spread">
          <div>
            <h2>Solicitudes recibidas</h2>
            <p className="muted-text">Contactos enviados desde la landing page.</p>
          </div>
          <span className="filter-pill">{customers.length} registros</span>
        </div>

        <label style={{ maxWidth: "340px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#cbd5e1", fontWeight: 600 }}>
            <Search size={14} /> Buscar cliente
          </div>
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Nombre, teléfono, dispositivo..."
          />
        </label>

        {error && <div className="landing-alert landing-alert--error">{error}</div>}

        {loading ? (
          <p className="muted-text">Cargando...</p>
        ) : customers.length === 0 ? (
          <div className="empty-box">
            Aún no hay clientes registrados. Cuando alguien llene el formulario de la landing verás sus datos aquí.
          </div>
        ) : (
          <div className="inv-table-wrap">
            <table className="inv-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Dispositivo</th>
                  <th>Problema</th>
                  <th>Ciudad</th>
                  <th>Fecha</th>
                  <th>WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="inv-table__num">{c.id}</td>
                    <td>
                      <div className="inv-table__name">{c.first_name} {c.last_name}</div>
                      {c.email && <div className="inv-table__sub">{c.email}</div>}
                    </td>
                    <td>
                      <a
                        href={`tel:${c.phone}`}
                        className="inv-chip"
                        style={{ textDecoration: "none" }}
                      >
                        {c.phone}
                      </a>
                    </td>
                    <td>{c.device_model ? <span className="inv-chip secondary">{c.device_model}</span> : "—"}</td>
                    <td style={{ maxWidth: "200px" }}>
                      <span
                        className="inv-table__sub"
                        style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                      >
                        {c.device_issue || "—"}
                      </span>
                    </td>
                    <td>{c.city || "—"}</td>
                    <td className="inv-table__sub">{formatDate(c.created_at)}</td>
                    <td>
                      <a
                        className="inv-btn"
                        style={{ width: "auto", padding: "4px 10px", textDecoration: "none", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "5px" }}
                        href={`https://wa.me/${String(c.phone).replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${c.first_name}, soy GO FIX MIAMI. Vi tu solicitud sobre: ${c.device_issue || c.device_model || "tu dispositivo"}. ¿Cómo podemos ayudarte?`)}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Contactar por WhatsApp"
                      >
                        <MessageCircle size={12} /> WA
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* DB status cards */}
      <div className="db-cards-grid">
        <div className="db-card db-card--mongo">
          <div className="db-card__glow" />
          <div className="db-card__icon"><Database size={22} style={{ color: "#34d399" }} /></div>
          <span className="db-card__status">Activo</span>
          <p className="db-card__title">MongoDB</p>
          <p className="db-card__desc">Usuarios y cuentas del panel admin. Persiste entre reinicios del servidor.</p>
        </div>
        <div className="db-card db-card--sqlite">
          <div className="db-card__glow" />
          <div className="db-card__icon"><Server size={22} style={{ color: "#93c5fd" }} /></div>
          <span className="db-card__status">Activo</span>
          <p className="db-card__title">SQLite</p>
          <p className="db-card__desc">Inventario de repuestos y servicios. Archivo local: <code style={{ fontSize: "0.75rem", color: "#93c5fd" }}>backend/data/repair.sqlite</code></p>
        </div>
        <div className="db-card db-card--ram">
          <div className="db-card__glow" />
          <div className="db-card__icon"><Cpu size={22} style={{ color: "#fbbf24" }} /></div>
          <span className="db-card__status">{customers.length} registros</span>
          <p className="db-card__title">RAM (sesión)</p>
          <p className="db-card__desc">Clientes del formulario. Se guardan mientras el servidor esté activo. Próximamente: persistencia en MongoDB.</p>
        </div>
      </div>
    </div>
  );
}
