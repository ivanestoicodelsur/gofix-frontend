import { Pencil, Trash2 } from "./Icons.jsx";

export default function InventoryTable({ items, canManage, onEdit, onDelete }) {
  if (!items.length) {
    return <div className="empty-box">No hay registros para los filtros actuales.</div>;
  }

  return (
    <section className="inv-table-section panel-card">
      <div className="section-header compact section-header--spread">
        <div>
          <h2>Catálogo</h2>
          <p className="muted-text">Vista compacta de servicios y repuestos.</p>
        </div>
        <span className="filter-pill">{items.length} registros</span>
      </div>

      <div className="inv-table-wrap">
        <table className="inv-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Código</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              {canManage && <th></th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="inv-table__name">{item.name}</div>
                  {(item.metadata?.brand || item.metadata?.model) && (
                    <div className="inv-table__sub">
                      {[item.metadata.brand, item.metadata.model].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </td>
                <td><span className="inv-chip">{item.code}</span></td>
                <td><span className="inv-chip secondary">{item.category}</span></td>
                <td className="inv-table__num">{formatCurrency(item.price)}</td>
                <td className="inv-table__num">
                  <span className={Number(item.stock) <= 5 ? "inv-stock low" : "inv-stock"}>
                    {item.stock}
                  </span>
                </td>
                <td>
                  <span className={`status-pill ${item.status}`}>{item.status}</span>
                </td>
                {canManage && (
                  <td className="inv-table__actions">
                    <button className="inv-btn" type="button" onClick={() => onEdit(item)} title="Editar">
                      <Pencil size={13} />
                    </button>
                    <button className="inv-btn danger" type="button" onClick={() => onDelete(item)} title="Eliminar">
                      <Trash2 size={13} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}
