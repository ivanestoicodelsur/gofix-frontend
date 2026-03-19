export default function DocumentList({ items, selectedId, onSelect, onCreate }) {
  return (
    <section className="documents-sidebar panel-card white-panel">
      <div className="section-row section-row--stack-mobile">
        <div>
          <p className="eyebrow black">Workspace</p>
          <h2 className="notion-title">Documentos</h2>
          <p className="muted-dark">Selecciona un documento o crea uno nuevo.</p>
        </div>
        <button className="minimal-button solid" type="button" onClick={onCreate}>
          Nuevo
        </button>
      </div>

      <div className="doc-list">
        {items.length ? (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`doc-list-item ${selectedId === item.id ? "active" : ""}`}
              onClick={() => onSelect(item)}
            >
              <div className="doc-list-item__row">
                <strong>{item.title}</strong>
                <span className={`status-pill subtle ${item.visibility === "public" ? "active" : "archived"}`}>
                  {item.visibility === "public" ? "Público" : "Privado"}
                </span>
              </div>
              <span>{item.summary || "Sin resumen"}</span>
              <small>{item.createdBy?.name || "Autor"}</small>
            </button>
          ))
        ) : (
          <div className="empty-box light">No hay documentos visibles.</div>
        )}
      </div>
    </section>
  );
}
