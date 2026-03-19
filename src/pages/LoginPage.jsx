import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Wrench, ShieldCheck, BarChart2, Users } from "../components/Icons.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Acceso administrador | GO FIX MIAMI";
  }, []);

  async function handleLogin(credentials) {
    setLoading(true);
    setError("");
    try {
      await login(credentials);
      navigate("/admin", { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-layout login-split">
      {/* Left branding panel */}
      <div className="login-brand-panel">
        <div className="login-brand-content">
          <div className="login-brand-icon">
            <Wrench size={34} />
          </div>
          <p className="login-brand-eyebrow">Panel de Control</p>
          <h1 className="login-brand-title">GO FIX MIAMI</h1>
          <p className="login-brand-sub">Administración inteligente de reparaciones y repuestos desde una sola plataforma.</p>

          <div className="login-brand-features">
            <div className="login-brand-feature">
              <span className="login-feature-icon"><BarChart2 size={15} /></span>
              <span>Inventario en tiempo real con +3600 repuestos</span>
            </div>
            <div className="login-brand-feature">
              <span className="login-feature-icon"><Users size={15} /></span>
              <span>Gestión de clientes y solicitudes CRM</span>
            </div>
            <div className="login-brand-feature">
              <span className="login-feature-icon"><ShieldCheck size={15} /></span>
              <span>Acceso seguro con JWT y roles de usuario</span>
            </div>
          </div>
        </div>

        <div className="login-brand-stats">
          <div className="login-stat-mini">
            <strong>3,600+</strong>
            <span>Repuestos</span>
          </div>
          <div className="login-stat-mini">
            <strong>7</strong>
            <span>Marcas</span>
          </div>
          <div className="login-stat-mini">
            <strong>24/7</strong>
            <span>Disponible</span>
          </div>
        </div>
      </div>

      {/* Right form side */}
      <div className="login-form-side">
        <LoginForm onSubmit={handleLogin} error={error} loading={loading} />
      </div>
    </div>
  );
}
