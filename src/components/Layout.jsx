import { useEffect, useMemo } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { LayoutDashboard, FileText, Users, Wrench } from "./Icons.jsx";

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    document.title = "Panel administrativo | GO FIX MIAMI";
  }, []);

  const section = useMemo(() => {
    if (location.pathname.includes("documents")) {
      return {
        label: "Documentos",
        title: "Workspace editorial",
        description: "Gestiona contenido colaborativo, material privado y documentos públicos desde una sola vista.",
      };
    }

    if (location.pathname.includes("clientes")) {
      return {
        label: "Base de datos",
        title: "Clientes y solicitudes",
        description: "Contactos recibidos desde la landing page. MongoDB activo · SQLite activo.",
      };
    }

    return {
      label: "Inventario",
      title: "Centro operativo",
      description: "Controla repuestos, servicios, usuarios y sincronización con una interfaz más clara y dinámica.",
    };
  }, [location.pathname]);

  return (
    <div className="admin-layout admin-shell">
      <aside className="admin-sidebar">
        <div className="brand-surface panel-card">
          <div className="brand-mark">
            <Wrench size={26} />
          </div>
          <div>
            <p className="eyebrow">GO FIX MIAMI</p>
            <h1>Panel de Control</h1>
            <p className="muted-text">Inventario, clientes y operación en tiempo real.</p>
          </div>
        </div>

        <nav className="sidebar-menu panel-card">
          <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            <span className="sidebar-link__icon"><LayoutDashboard size={18} /></span>
            <span>
              <strong>Inventario</strong>
              <small>Catálogo, stock y servicios</small>
            </span>
          </NavLink>
          <NavLink to="/admin/documents" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            <span className="sidebar-link__icon"><FileText size={18} /></span>
            <span>
              <strong>Documentos</strong>
              <small>Notas, material y guías</small>
            </span>
          </NavLink>
          <NavLink to="/admin/clientes" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            <span className="sidebar-link__icon"><Users size={18} /></span>
            <span>
              <strong>Clientes</strong>
              <small>Solicitudes y base de datos</small>
            </span>
          </NavLink>
        </nav>

        <div className="profile-surface panel-card">
          <div className="profile-surface__avatar">{String(user?.name || "A").charAt(0).toUpperCase()}</div>
          <div className="profile-surface__body">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
            <div className="profile-surface__chips">
              <span className="role-chip">{user?.role}</span>
              <span className="scope-chip">{user?.scopeKey}</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer panel-card">
          <Link className="secondary-button" to="/landing">
            Ver landing pública
          </Link>
          <button className="secondary-button danger-soft" type="button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar panel-card">
          <div>
            <p className="eyebrow">{section.label}</p>
            <h2>{section.title}</h2>
            <p className="muted-text">{section.description}</p>
          </div>
          <div className="admin-topbar__actions">
            <span className="live-pill">Sistema activo</span>
            <Link className="secondary-button" to="/landing">
              Abrir landing
            </Link>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
