import { useEffect, useMemo, useState } from "react";
import DocumentEditor from "../components/DocumentEditor.jsx";
import DocumentList from "../components/DocumentList.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { api } from "../services/api.js";

const EMPTY_DOC = {
  title: "",
  summary: "",
  content: "",
  imageUrls: [],
  visibility: "private",
  createdBy: null,
  updatedAt: null,
};

export default function DocumentsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(EMPTY_DOC);
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState("");
  const [mineOnly, setMineOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const stats = useMemo(() => ({
    visible: items.length,
    publicDocs: items.filter((item) => item.visibility === "public").length,
    myDocs: items.filter((item) => item.createdBy?.id === user?.id).length,
  }), [items, user?.id]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments(next = { q: search, visibility, mine: mineOnly }) {
    setLoading(true);
    setFeedback({ type: "", text: "" });
    try {
      const response = await api.listDocuments(next);
      setItems(response.items || []);
      if (response.items?.length && (!selected?.id || !response.items.some((item) => item.id === selected.id))) {
        setSelected(response.items[0]);
      }
      if (!response.items?.length) {
        setSelected(EMPTY_DOC);
      }
    } catch (error) {
      setFeedback({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(payload) {
    setSaving(true);
    setFeedback({ type: "", text: "" });
    try {
      if (selected?.id) {
        const response = await api.updateDocument(selected.id, payload);
        setSelected(response.item);
        setFeedback({ type: "success", text: "Documento actualizado." });
      } else {
        const response = await api.createDocument(payload);
        setSelected(response.item);
        setFeedback({ type: "success", text: "Documento creado." });
      }
      await fetchDocuments();
    } catch (error) {
      setFeedback({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(doc) {
    if (!doc?.id || !window.confirm(`¿Eliminar ${doc.title}?`)) {
      return;
    }

    try {
      await api.deleteDocument(doc.id);
      setSelected(EMPTY_DOC);
      setFeedback({ type: "success", text: "Documento eliminado." });
      await fetchDocuments();
    } catch (error) {
      setFeedback({ type: "error", text: error.message });
    }
  }

  return (
    <div className="documents-shell">
      <section className="documents-hero panel-card white-panel compact-panel">
        <div>
          <p className="eyebrow black">Notion inspired</p>
          <h1 className="page-headline">Documentos colaborativos</h1>
          <p className="muted-dark">
            Los públicos pueden ser vistos y editados por todos los usuarios registrados. Los privados solo por su creador.
          </p>
        </div>
        <div className="notion-stats">
          <div><strong>{stats.visible}</strong><span>visibles</span></div>
          <div><strong>{stats.publicDocs}</strong><span>públicos</span></div>
          <div><strong>{stats.myDocs}</strong><span>míos</span></div>
        </div>
      </section>

      {feedback.text ? <div className={`feedback-box ${feedback.type}`}>{feedback.text}</div> : null}

      <section className="documents-toolbar panel-card white-panel compact-panel">
        <div className="documents-toolbar__fields">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por título, resumen o contenido" />
          <select value={visibility} onChange={(event) => setVisibility(event.target.value)}>
            <option value="">Todos</option>
            <option value="public">Públicos</option>
            <option value="private">Privados</option>
          </select>
          <label className="checkbox-line black-label">
            <input type="checkbox" checked={mineOnly} onChange={(event) => setMineOnly(event.target.checked)} />
            Solo mis documentos
          </label>
        </div>
        <button className="minimal-button solid" type="button" onClick={() => fetchDocuments()} disabled={loading}>
          {loading ? "Buscando..." : "Actualizar"}
        </button>
      </section>

      <div className="documents-grid">
        <DocumentList
          items={items}
          selectedId={selected?.id || null}
          onSelect={setSelected}
          onCreate={() => setSelected({ ...EMPTY_DOC, visibility: "private" })}
        />
        <DocumentEditor user={user} document={selected} onSave={handleSave} onDelete={handleDelete} saving={saving} />
      </div>
    </div>
  );
}
