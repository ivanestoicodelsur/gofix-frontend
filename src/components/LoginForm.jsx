import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "./Icons.jsx";

export default function LoginForm({ onSubmit, error, loading }) {
  const [form, setForm] = useState({ email: "admin@example.com", password: "Admin12345!" });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="auth-card login-form-modern"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="login-form-header">
        <p className="eyebrow">Acceso seguro</p>
        <h2 className="login-form-title">Iniciar sesión</h2>
        <p className="muted-text">Ingresa tus credenciales para acceder al panel.</p>
      </div>

      <div className="login-form-fields">
        <label className="login-label">
          Correo electrónico
          <div className="input-icon-wrap">
            <Mail size={16} />
            <input
              type="email"
              value={form.email}
              placeholder="admin@ejemplo.com"
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </div>
        </label>

        <label className="login-label">
          Contraseña
          <div className="input-icon-wrap">
            <Lock size={16} />
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              placeholder="••••••••••"
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </label>
      </div>

      {error ? <div className="error-box">{error}</div> : null}

      <button className="primary-button login-submit-btn" type="submit" disabled={loading}>
        {loading ? (
          <span className="login-loading">
            <span className="login-spinner" />
            Ingresando...
          </span>
        ) : (
          "Entrar al panel"
        )}
      </button>

      <p className="login-form-footer">
        Solo personal autorizado de GO FIX MIAMI.
      </p>
    </form>
  );
}
