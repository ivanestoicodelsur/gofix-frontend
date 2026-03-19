import { useEffect, useMemo, useState } from "react";

const EMPTY_DOC = {
  id: null,
  title: "",
  summary: "",
  content: "",
  imageUrls: [],
  visibility: "private",
  createdBy: null,
  updatedAt: null,
};

export default function DocumentEditor({ user, document, onSave, onDelete, saving }) {
  const [form, setForm] = useState(EMPTY_DOC);

  useEffect(() => {
    setForm(document || EMPTY_DOC);
  }, [document]);

  const imageText = useMemo(() => (form.imageUrls || []).join("\n"), [form.imageUrls]);
  const canDelete = form.id && form.createdBy?.id === user?.id;

  return (
    <section className="editor-surface panel-card white-panel">
      <div className="editor-header editor-header--modern">
        <div>
          <p className="eyebrow black">Editor</p>
          <input
            className="document-title-input"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Documento sin título"
          />
          <div className="editor-meta">
            <span>{form.createdBy?.name ? `Creado por ${form.createdBy.name}` : "Nuevo documento"}</span>
            <span>{form.updatedAt ? `Editado ${formatDate(form.updatedAt)}` : "Sin guardar"}</span>
          </div>
        </div>
        <div className="editor-actions">
          <select value={form.visibility} onChange={(event) => updateField("visibility", event.target.value)}>
            <option value="private">Privado</option>
            <option value="public">Público</option>
          </select>
          <button className="minimal-button solid" type="button" onClick={() => onSave(normalizePayload(form))} disabled={saving || !form.title.trim()}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
          {canDelete ? (
            <button className="minimal-button danger" type="button" onClick={() => onDelete(form)}>
              Eliminar
            </button>
          ) : null}
        </div>
      </div>

      <div className="editor-workspace">
        <div className="editor-grid">
          <label className="full-width black-label">
            Resumen
            <input value={form.summary || ""} onChange={(event) => updateField("summary", event.target.value)} placeholder="Resumen corto del documento" />
          </label>

          <label className="full-width black-label">
            Contenido
            <textarea
              className="document-content-input"
              value={form.content || ""}
              onChange={(event) => updateField("content", event.target.value)}
              placeholder="Escribe aquí tu documento..."
              rows="16"
            />
          </label>

          <label className="full-width black-label">
            Imágenes
            <textarea
              value={imageText}
              onChange={(event) => updateField("imageUrls", event.target.value.split("\n").map((line) => line.trim()).filter(Boolean))}
              placeholder="Una URL por línea"
              rows="4"
            />
          </label>
        </div>

        <section className="document-preview modern-preview">
          <div className="section-header compact section-header--spread preview-header">
            <div>
              <h3>{form.title || "Vista previa"}</h3>
              {form.summary ? <p className="preview-summary">{form.summary}</p> : null}
            </div>
            <span className={`status-pill subtle ${form.visibility === "public" ? "active" : "archived"}`}>
              {form.visibility === "public" ? "Público" : "Privado"}
            </span>
          </div>
          <div className="preview-body">
            {(form.content || "").split("\n").filter(Boolean).map((paragraph, index) => (
              <p key={`${paragraph}-${index}`}>{paragraph}</p>
            ))}
          </div>
          {(form.imageUrls || []).length ? (
            <div className="preview-images">
              {form.imageUrls.map((url) => (
                <img key={url} src={url} alt="Documento" />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </section>
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }
}

function normalizePayload(form) {
  return {
    title: form.title.trim(),
    summary: (form.summary || "").trim(),
    content: form.content || "",
    imageUrls: (form.imageUrls || []).filter(Boolean),
    visibility: form.visibility || "private",
  };
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
