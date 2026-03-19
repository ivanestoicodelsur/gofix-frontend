import { useEffect, useMemo, useState } from "react";
import InventoryForm from "../components/InventoryForm.jsx";
import InventoryTable from "../components/InventoryTable.jsx";
import { Database, Server } from "../components/Icons.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { api } from "../services/api.js";

const FILTERS = { q: "", status: "", category: "" };
const USER_FORM = { name: "", email: "", password: "", role: "viewer", scopeKey: "central" };

export default function DashboardPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [filters, setFilters] = useState(FILTERS);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [sheetsStatus, setSheetsStatus] = useState(null);
  const [userForm, setUserForm] = useState({ ...USER_FORM, scopeKey: user?.scopeKey || "central" });

  const canManage = user?.role === "admin" || user?.role === "manager";
  const canCreateUsers = user?.role === "admin";

  const summary = useMemo(() => {
    const totalStock = items.reduce((sum, item) => sum + Number(item.stock || 0), 0);
    const totalValue = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const activeItems = items.filter((item) => item.status === "active").length;
    const lowStock = items.filter((item) => Number(item.stock || 0) <= 5).length;
    const categories = new Set(items.map((item) => item.category).filter(Boolean)).size;
    return { totalStock, totalValue, activeItems, lowStock, categories };
  }, [items]);

  useEffect(() => {
    fetchInventory();
    if (canManage) {
      fetchUsers();
      api.getSheetsStatus().then(setSheetsStatus).catch(() => {});
    }
  }, [canManage]);

  async function fetchInventory(nextFilters = filters) {
    setLoading(true);
    setError("");
    try {
      const response = await api.listInventory(nextFilters);
      setItems(response.items || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsers() {
    try {
      const response = await api.listUsers();
      setUsers(response.users || []);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleSubmitInventory(payload) {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      if (editingItem) {
        await api.updateInventory(editingItem.id, payload);
        setMessage("Registro actualizado correctamente.");
      } else {
        await api.createInventory(payload);
        setMessage("Registro creado correctamente.");
      }
      setEditingItem(null);
      await fetchInventory();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(`¿Eliminar ${item.name}?`);
    if (!confirmed) {
      return;
    }

    try {
      await api.deleteInventory(item.id);
      setMessage("Registro eliminado correctamente.");
      if (editingItem?.id === item.id) {
        setEditingItem(null);
      }
      await fetchInventory();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setError("");
    setMessage("");
    try {
      const response = await api.syncGoogleSheets({ scopeKey: user.scopeKey });
      const { imported, updated, rows, sheets: sheetList } = response.result;
      const sheetsMsg = sheetList ? ` (${sheetList.length} hojas, ${rows} filas)` : "";
      setMessage(`✓ Sincronización completada${sheetsMsg}. Importados: ${imported}, actualizados: ${updated}.`);
      await fetchInventory();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSyncing(false);
    }
  }

  async function handleCreateUser(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.registerUser(userForm);
      setMessage("Usuario creado correctamente.");
      setUserForm({ ...USER_FORM, scopeKey: user.scopeKey || "central" });
      await fetchUsers();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="dashboard-stack">
      <section className="dashboard-hero panel-card">
        <div className="dashboard-hero__copy">
          <p className="eyebrow">Operación central</p>
          <h1>Vista moderna del inventario y la operación diaria</h1>
          <p className="muted-text large">
            Consulta métricas rápidas, filtra el catálogo, actualiza servicios y administra al equipo sin perder visibilidad del estado general.
          </p>
        </div>
        <div className="dashboard-hero__highlights">
          <div>
            <span>Registros visibles</span>
            <strong>{items.length}</strong>
          </div>
          <div>
            <span>Valor estimado</span>
            <strong>{formatCurrency(summary.totalValue)}</strong>
          </div>
        </div>
      </section>

      <section className="stats-grid modern-stats-grid">
        <article className="panel-card stat-box stat-box--primary">
          <span className="muted-text">Stock total</span>
          <strong>{summary.totalStock}</strong>
          <small>Unidades disponibles en los registros visibles</small>
        </article>
        <article className="panel-card stat-box">
          <span className="muted-text">Servicios activos</span>
          <strong>{summary.activeItems}</strong>
          <small>Elementos listos para operar</small>
        </article>
        <article className="panel-card stat-box">
          <span className="muted-text">Bajo stock</span>
          <strong>{summary.lowStock}</strong>
          <small>Requieren atención o reabastecimiento</small>
        </article>
        <article className="panel-card stat-box">
          <span className="muted-text">Categorías</span>
          <strong>{summary.categories}</strong>
          <small>Familias de producto o servicio</small>
        </article>
      </section>

      {(error || message) ? (
        <div className={`feedback-box ${error ? "error" : "success"}`}>{error || message}</div>
      ) : null}

      {/* ── Google Sheets Integration Panel ─────────────────── */}
      {canManage ? (
        <section className="sheets-panel panel-card">
          <div className="sheets-panel__header">
            <div className="sheets-panel__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="8" y1="13" x2="16" y2="13"/>
                <line x1="8" y1="17" x2="16" y2="17"/>
                <line x1="8" y1="9" x2="10" y2="9"/>
              </svg>
            </div>
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>Integración</p>
              <h2 style={{ margin: 0 }}>Google Sheets → Inventario</h2>
              <p className="muted-text" style={{ margin: "4px 0 0" }}>
                Importa tu tabla de inventario directamente desde Google Sheets a la base de datos SQLite.
              </p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
              {sheetsStatus?.configured ? (
                <span className="sheets-badge sheets-badge--ok">✓ Configurado</span>
              ) : (
                <span className="sheets-badge sheets-badge--warn">⚠ Pendiente configuración</span>
              )}
            </div>
          </div>

          {sheetsStatus?.configured ? (
            <div className="sheets-panel__ready">
              <div className="sheets-brands">
                {(sheetsStatus.spreadsheets || []).map(s => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="sheets-brand-chip"
                    title={`Abrir ${s.label} en Google Sheets`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    {s.label}
                  </a>
                ))}
              </div>
              <div className="sheets-panel__row">
                <div className="sheets-panel__info">
                  <Server size={14} style={{ color: "#93c5fd" }} />
                  <span><strong>{sheetsStatus.spreadsheetCount}</strong> hojas conectadas — solo se sincronizan las pestañas de precios</span>
                </div>
                <button className="primary-button" type="button" onClick={handleSync} disabled={syncing}>
                  {syncing ? "⟳ Sincronizando..." : "⟳ Importar desde Sheets"}
                </button>
              </div>
            </div>
          ) : (
            <div className="sheets-steps">
              <p className="muted-text" style={{ margin: "0 0 16px" }}>
                Sigue estos 4 pasos para conectar tu hoja de cálculo:
              </p>
              <ol className="sheets-steps__list">
                <li>
                  <strong>Abre Google Cloud Console</strong>
                  <span>Ve a <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="sheets-link">console.cloud.google.com</a> con tu cuenta <code>i.romero007guru@gmail.com</code></span>
                </li>
                <li>
                  <strong>Activa Google Sheets API</strong>
                  <span>Busca "Sheets API" → habilítala en tu proyecto (crea uno nuevo si no tienes)</span>
                </li>
                <li>
                  <strong>Crea una API Key</strong>
                  <span>Ve a <em>APIs &amp; Services → Credentials → Create Credentials → API key</em> → Copia la clave generada</span>
                </li>
                <li>
                  <strong>Comparte el Sheet como público</strong>
                  <span>En tu Sheet: <em>Share → Anyone with the link → Viewer</em> (el link sigue siendo privado, nadie puede encontrarlo sin él)</span>
                </li>
                <li>
                  <strong>Pega la API key en el archivo <code>.env</code></strong>
                  <span>Abre <code>backend/.env</code> y pon: <code>GOOGLE_SHEETS_API_KEY=TU_CLAVE_AQUI</code> — luego reinicia el servidor</span>
                </li>
              </ol>
            </div>
          )}
        </section>
      ) : null}

      <section className="filters-panel panel-card">
        <div className="section-header compact section-header--spread">
          <div>
            <h2>Filtros inteligentes</h2>
            <p className="muted-text">Encuentra productos, servicios y registros críticos en segundos.</p>
          </div>
          <div className="toolbar-actions">
            <button className="primary-button" type="button" onClick={() => fetchInventory(filters)} disabled={loading}>
              {loading ? "Consultando..." : "Aplicar filtros"}
            </button>
          </div>
        </div>

        <div className="toolbar-grid">
          <label>
            Buscar
          <input
            value={filters.q}
            onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
            placeholder="Nombre, código, categoría..."
          />
          </label>
          <label>
            Estado
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="">Todos</option>
              <option value="draft">Borrador</option>
              <option value="active">Activo</option>
              <option value="archived">Archivado</option>
            </select>
          </label>
          <label>
            Categoría
            <input
              value={filters.category}
              onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
              placeholder="Categoría"
            />
          </label>
          <div className="filter-pills">
            <span className="filter-pill">{canManage ? "Modo gestor" : "Modo lectura"}</span>
            <span className="filter-pill">Scope: {user?.scopeKey}</span>
            <span className="filter-pill">Usuarios: {users.length}</span>
          </div>
        </div>
      </section>

      <div className="dashboard-content-grid">
        {canManage ? (
          <InventoryForm
            item={editingItem}
            users={users}
            currentScope={user.scopeKey}
            onSubmit={handleSubmitInventory}
            onCancel={() => setEditingItem(null)}
            loading={saving}
            canEdit={user.role === "admin"}
          />
        ) : null}

        <div className="stack-gap">
          <InventoryTable items={items} canManage={canManage} onEdit={setEditingItem} onDelete={handleDelete} />

          {canCreateUsers ? (
            <form className="panel-card form-card user-creation-card" onSubmit={handleCreateUser}>
              <div className="section-header compact section-header--spread">
                <div>
                  <h2>Crear usuario</h2>
                  <p className="muted-text">Alta rápida de administradores, managers y técnicos con acceso inmediato.</p>
                </div>
                <span className="filter-pill">Solo admin</span>
              </div>
              <div className="form-grid two-columns">
                <label>
                  Nombre
                  <input value={userForm.name} onChange={(event) => setUserForm((current) => ({ ...current, name: event.target.value }))} required />
                </label>
                <label>
                  Correo
                  <input type="email" value={userForm.email} onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))} required />
                </label>
                <label>
                  Contraseña
                  <input type="password" value={userForm.password} onChange={(event) => setUserForm((current) => ({ ...current, password: event.target.value }))} required />
                </label>
                <label>
                  Rol
                  <select value={userForm.role} onChange={(event) => setUserForm((current) => ({ ...current, role: event.target.value }))}>
                    <option value="viewer">Viewer</option>
                    <option value="technician">Technician</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
                <label className="full-width">
                  Scope
                  <input value={userForm.scopeKey} onChange={(event) => setUserForm((current) => ({ ...current, scopeKey: event.target.value }))} required />
                </label>
              </div>
              <button className="primary-button" type="submit">Crear usuario</button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}
