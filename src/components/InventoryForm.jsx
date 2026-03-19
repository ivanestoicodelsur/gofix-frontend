import { useEffect, useState } from "react";

const INITIAL_STATE = {
  name: "",
  code: "",
  description: "",
  category: "Reparación",
  repairType: "Diagnóstico",
  price: 0,
  estimatedHours: 1,
  stock: 0,
  status: "active",
  visibilityScope: "central",
  assignedUserId: "",
};

export default function InventoryForm({ item, users, currentScope, onSubmit, onCancel, loading, canEdit }) {
  const [form, setForm] = useState(INITIAL_STATE);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        code: item.code,
        description: item.description || "",
        category: item.category,
        repairType: item.repairType,
        price: Number(item.price || 0),
        estimatedHours: Number(item.estimatedHours || 1),
        stock: Number(item.stock || 0),
        status: item.status,
        visibilityScope: item.visibilityScope || currentScope,
        assignedUserId: item.assignedUserId || "",
      });
      return;
    }

    setForm((current) => ({ ...INITIAL_STATE, visibilityScope: currentScope || "central" }));
  }, [item, currentScope]);

  return (
    <form
      className="panel-card form-card inventory-form-card"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          ...form,
          assignedUserId: form.assignedUserId || null,
        });
      }}
    >
      <div className="section-header compact section-header--spread">
        <div>
          <h2>{item ? "Editar producto/servicio" : "Nuevo producto/servicio"}</h2>
          <p className="muted-text">Carga productos y reparaciones con una vista más clara y guiada.</p>
        </div>
        <div className="form-summary-badge">
          <span>{item ? "Modo edición" : "Nuevo registro"}</span>
          <strong>{form.status}</strong>
        </div>
      </div>

      <div className="form-intro-grid">
        <div className="mini-stat-card">
          <span>Scope actual</span>
          <strong>{form.visibilityScope || currentScope}</strong>
        </div>
        <div className="mini-stat-card">
          <span>Usuarios asignables</span>
          <strong>{users.length}</strong>
        </div>
        <div className="mini-stat-card">
          <span>Valor editable</span>
          <strong>{Number(form.price || 0) > 0 ? `$${Number(form.price || 0)}` : "Pendiente"}</strong>
        </div>
      </div>

      <div className="form-grid two-columns">
        <label>
          Nombre
          <small>Nombre comercial visible en el catálogo.</small>
          <input value={form.name} onChange={(event) => setField(setForm, "name", event.target.value)} required />
        </label>
        <label>
          Código
          <small>SKU o identificador rápido interno.</small>
          <input value={form.code} onChange={(event) => setField(setForm, "code", event.target.value)} required />
        </label>
        <label>
          Categoría
          <small>Marca, familia o grupo operativo.</small>
          <input value={form.category} onChange={(event) => setField(setForm, "category", event.target.value)} required />
        </label>
        <label>
          Tipo de reparación
          <small>Servicio específico que ofreces al cliente.</small>
          <input value={form.repairType} onChange={(event) => setField(setForm, "repairType", event.target.value)} required />
        </label>
        <label>
          Precio
          <small>Monto de venta final en USD.</small>
          <input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setField(setForm, "price", event.target.value)} required />
        </label>
        <label>
          Stock
          <small>Unidades disponibles para atención inmediata.</small>
          <input type="number" min="0" value={form.stock} onChange={(event) => setField(setForm, "stock", event.target.value)} required />
        </label>
        <label>
          Horas estimadas
          <small>Tiempo esperado del trabajo.</small>
          <input type="number" min="1" value={form.estimatedHours} onChange={(event) => setField(setForm, "estimatedHours", event.target.value)} required />
        </label>
        <label>
          Estado
          <small>Control de visibilidad operativa.</small>
          <select value={form.status} onChange={(event) => setField(setForm, "status", event.target.value)}>
            <option value="draft">Borrador</option>
            <option value="active">Activo</option>
            <option value="archived">Archivado</option>
          </select>
        </label>
        <label>
          Ámbito
          <small>Scope o zona que lo puede operar.</small>
          <input
            value={form.visibilityScope}
            onChange={(event) => setField(setForm, "visibilityScope", event.target.value)}
            disabled={!canEdit}
            required
          />
        </label>
        <label>
          Asignado a
          <small>Responsable principal del registro.</small>
          <select value={form.assignedUserId} onChange={(event) => setField(setForm, "assignedUserId", event.target.value)}>
            <option value="">Sin asignar</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} · {user.role}
              </option>
            ))}
          </select>
        </label>
        <label className="full-width">
          Descripción
          <small>Notas internas, detalle técnico o compatibilidad.</small>
          <textarea value={form.description} onChange={(event) => setField(setForm, "description", event.target.value)} rows="4" />
        </label>
      </div>

      <div className="action-row">
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Guardando..." : item ? "Actualizar" : "Crear"}
        </button>
        {item ? (
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancelar edición
          </button>
        ) : null}
      </div>
    </form>
  );
}

function setField(setter, field, value) {
  setter((current) => ({ ...current, [field]: value }));
}
