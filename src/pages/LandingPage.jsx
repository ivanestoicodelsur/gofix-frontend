import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import QuoteWizard from "../components/QuoteWizard.jsx";
import "../styles/landing.css";

const CONTACT_FORM = {
  fullName: "",
  email: "",
  phone: "",
  deviceIssue: "",
};

export default function LandingPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [contactForm, setContactForm] = useState(CONTACT_FORM);
  const [contactState, setContactState] = useState({ loading: false, message: "", error: "" });

  useEffect(() => {
    document.title = "GO FIX MIAMI | Reparación iPhone a Domicilio en Downtown Miami";
    api.getLandingStats().then(setStats).catch(() => {});
  }, []);

  async function handleContactSubmit(event) {
    event.preventDefault();
    setContactState({ loading: true, message: "", error: "" });
    try {
      const [first_name, ...lastNameParts] = contactForm.fullName.trim().split(/\s+/);
      api.createLandingCustomer({
        first_name: first_name || contactForm.fullName.trim(),
        last_name: lastNameParts.join(" "),
        email: contactForm.email,
        phone: contactForm.phone,
        city: "Miami",
        device_issue: contactForm.deviceIssue,
      }).catch(() => {});
      const message = encodeURIComponent(
        `Hola GO FIX MIAMI, quiero solicitar una reparación:\n\nNombre: ${contactForm.fullName}\nCorreo: ${contactForm.email}\nTeléfono: ${contactForm.phone}\nProblema: ${contactForm.deviceIssue}\n\n¡Por favor contáctenme! 🙏`
      );
      setContactForm(CONTACT_FORM);
      setContactState({ loading: false, message: "Redirigiendo a WhatsApp...", error: "" });
      window.open(`https://wa.me/17868062197?text=${message}`, "_blank");
    } catch {
      setContactState({ loading: false, message: "", error: "No fue posible abrir WhatsApp." });
    }
  }

  return (
    <div className="min-h-screen font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl">GF</div>
            <div>
              <h1 className="font-bold text-lg leading-tight">GO FIX MIAMI</h1>
              <p className="text-xs text-blue-200">Servicio Técnico Especializado</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#precios"
              className="text-sm font-bold text-white/90 hover:text-yellow-300 transition-colors px-2 py-1"
            >
              Quote
            </a>
            <a
              href="#contacto"
              className="text-sm font-bold text-white/90 hover:text-yellow-300 transition-colors px-2 py-1"
            >
              Contacto
            </a>
            <a
              href="https://wa.me/17868062197"
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              +1 (786) 806-2197
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-24 min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] [background-size:40px_40px]"></div>

        <div className="container mx-auto px-4 py-16 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: Copy */}
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20 mb-4">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Downtown Miami · Servicio a domicilio
                </span>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  Servicio técnico iPhone a domicilio en Downtown Miami.{" "}
                  <span className="text-yellow-300">Reparamos pantallas y baterías mientras trabajas.</span>
                </h1>
                <p className="text-xl text-blue-200">
                  Consulta precios y agenda tu cita de reparación al instante: servicio express para empresas y trabajadores.
                  <strong className="text-white"> ¡10 años de experiencia respaldan tu confianza!</strong>
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20 flex items-center gap-2">
                  ⚡ 30 min promedio
                </span>
                <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20 flex items-center gap-2">
                  📍 Vamos a tu oficina
                </span>
                <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20 flex items-center gap-2">
                  🛡️ Garantía 90 días
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="https://wa.me/17868062197" className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Directo
                </a>
                <a href="tel:+17868062197" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border border-white/20">
                  📞 Llamar Ahora
                </a>
              </div>

              <div className="flex gap-8 pt-2">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">{stats?.total_customers || "10+"}</div>
                  <div className="text-sm text-blue-200">Clientes atendidos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">5k+</div>
                  <div className="text-sm text-blue-200">Reparaciones</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">90</div>
                  <div className="text-sm text-blue-200">Días garantía</div>
                </div>
              </div>
            </div>

            {/* Right: Contact form */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl text-gray-800">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Necesitas reparación urgente?</h3>
                <p className="text-gray-600 text-sm">Completa el formulario y te contactamos en minutos</p>
              </div>

              <form className="space-y-4" onSubmit={handleContactSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input
                    type="text" required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="Tu nombre"
                    value={contactForm.fullName}
                    onChange={(e) => setContactForm((c) => ({ ...c, fullName: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                    <input
                      type="email" required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="tu@email.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm((c) => ({ ...c, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel" required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="+1 (786) 000-0000"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm((c) => ({ ...c, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">¿Qué necesitas reparar?</label>
                  <textarea
                    required rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none outline-none"
                    placeholder="Ej: iPhone 14 Pro, pantalla rota, en Brickell..."
                    value={contactForm.deviceIssue}
                    onChange={(e) => setContactForm((c) => ({ ...c, deviceIssue: e.target.value }))}
                  />
                </div>

                {contactState.error && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-200">{contactState.error}</div>
                )}
                {contactState.message && (
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm border border-green-200">{contactState.message}</div>
                )}

                <button
                  type="submit"
                  disabled={contactState.loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {contactState.loading ? "Abriendo WhatsApp..." : "Enviar Solicitud ✉️"}
                </button>
                <p className="text-xs text-center text-gray-500">
                  Al enviar, aceptas nuestra política de privacidad. Te contactaremos por WhatsApp o llamada.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote Wizard ─────────────────────────────────────── */}
      <section id="precios" className="landing-section landing-section--wizard">
        <div className="landing-container">
          <div className="landing-section-heading landing-section-heading--center" style={{ marginBottom: 48 }}>
            <span className="qw-eyebrow">Cotizador instantáneo</span>
            <h2 style={{ color: "#fff" }}>¿Cuánto cuesta reparar tu dispositivo?</h2>
            <p>Selecciona tu equipo, elige el servicio y recibe el precio al instante — sin esperas</p>
          </div>
          <QuoteWizard />
        </div>
      </section>

      {/* ── Perfil + Galería ─────────────────────────────────── */}
      <section id="contacto" className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Left: Profile */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold">GF</div>
                <div>
                  <h2 className="text-2xl font-bold">GO FIX MIAMI</h2>
                  <p className="text-slate-400">Técnico Especializado</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-1">
                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img
                        src="https://gofixcompany.netlify.app/LOGO%20DE%20GO%20FIX%20.jpeg"
                        alt="Logo GO FIX MIAMI"
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">¿Quién soy?</h3>
                  <p className="text-slate-400">Técnico desarrollador multidisciplinario</p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <p className="text-lg leading-relaxed text-slate-300">
                  Soy <span className="text-blue-400 font-semibold">técnico desarrollador</span> con más de{" "}
                  <span className="text-yellow-400 font-bold">10 años de experiencia</span> en el mercado de la ciudad de Miami, ayudando a residentes y visitantes con sus reparaciones de celulares, tablets, iPads, MacBooks y otros dispositivos.
                  <span className="block mt-3 text-white font-semibold">
                    Técnico multidisciplinario, certificado y en constante actualización.
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "📱", label: "Reparación de Celulares" },
                  { icon: "📟", label: "Tablets y iPads" },
                  { icon: "💻", label: "MacBooks y Laptops" },
                  { icon: "🔬", label: "Diagnóstico Especializado" },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <span className="text-xl">{icon}</span>
                    <span className="font-medium text-sm">{label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Contacto Directo</h3>
                <a href="https://wa.me/17868062197" className="flex items-center gap-4 p-4 bg-green-600/20 border border-green-500/30 rounded-xl hover:bg-green-600/30 transition-all">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-xl">📱</div>
                  <div>
                    <p className="text-sm text-slate-400">WhatsApp / Llamadas</p>
                    <p className="text-xl font-bold text-green-400">+1 (786) 806-2197</p>
                  </div>
                </a>
                <a href="https://instagram.com/gofixmiamicompany" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-pink-600/20 border border-pink-500/30 rounded-xl hover:bg-pink-600/30 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl">📸</div>
                  <div>
                    <p className="text-sm text-slate-400">Instagram</p>
                    <p className="text-lg font-bold text-pink-400">@gofixmiamicompany</p>
                  </div>
                </a>
                <a href="https://youtube.com/@ivaniphonerepair" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-red-600/20 border border-red-500/30 rounded-xl hover:bg-red-600/30 transition-all">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-xl">▶️</div>
                  <div>
                    <p className="text-sm text-slate-400">YouTube</p>
                    <p className="text-lg font-bold text-red-400">@ivaniphonerepair</p>
                  </div>
                </a>
                <a href="mailto:gofixcompany@gmail.com" className="flex items-center gap-4 p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-all">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl">✉️</div>
                  <div>
                    <p className="text-sm text-slate-400">Correo electrónico</p>
                    <p className="text-lg font-bold text-blue-400">gofixcompany@gmail.com</p>
                  </div>
                </a>
              </div>

              {/* Gallery */}
              <div>
                <h3 className="text-lg font-bold mb-4">Galería de Trabajos</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    "https://gofixcompany.netlify.app/WhatsApp%20Image%202026-02-23%20at%2017.45.33.jpeg",
                    "https://gofixcompany.netlify.app/WhatsApp%20Image%202026-02-23%20at%2017.45.38.jpeg",
                    "https://gofixcompany.netlify.app/GO%20FIX%20COMPANY%20SERVICE.jpeg",
                    "https://gofixcompany.netlify.app/ca3a216d-b39a-4fbd-9ad8-9bf071a213c4.jpg",
                    "https://gofixcompany.netlify.app/8281a535-4a67-4f46-8db0-607e462495e8.jpg",
                    "https://gofixcompany.netlify.app/9bbf2876-069a-43df-be09-b22c19ec928f.jpg",
                  ].map((src, i) => (
                    <div key={src} className="aspect-square bg-slate-800 rounded-xl border-2 border-slate-600 hover:border-blue-500 transition-colors overflow-hidden">
                      <img src={src} alt={`Foto ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Map & Service Area */}
            <div className="space-y-8">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-blue-400 text-xl">📍</span>
                  <h3 className="text-xl font-bold">Área de Servicio</h3>
                </div>
                <p className="text-slate-300 mb-4">Atendemos a domicilio en toda el área de Miami-Dade:</p>
                <div className="flex flex-wrap gap-2">
                  {["Miami", "Aventura", "Miami Beach", "Brickell", "Downtown", "Coral Gables", "South Miami", "Kendall", "Homestead", "Florida City", "Doral", "Hialeah"].map((area) => (
                    <span key={area} className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
                <iframe
                  className="w-full"
                  style={{ height: "300px", border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3589.858964893839!2d-80.4094156849747!3d25.64704098369759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9c1e2e2e2e2e2%3A0x2e2e2e2e2e2e2e2e!2sMiami%2C%20FL%2033186%2C%20USA!5e0!3m2!1ses-419!2sus!4v1708723200000!5m2!1ses-419!2sus"
                  title="Área de servicio Miami"
                />
                <div className="p-4 bg-slate-800">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <span>🕐</span>
                    <span className="font-semibold">Servicio Express</span>
                  </div>
                  <p className="text-sm text-slate-400">Tiempo promedio de respuesta: 15-30 minutos en área central de Miami.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="text-3xl font-bold text-blue-400 mb-1">10+</div>
                  <div className="text-xs text-slate-400">Años experiencia</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="text-3xl font-bold text-green-400 mb-1">5k+</div>
                  <div className="text-xs text-slate-400">Reparaciones</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">90</div>
                  <div className="text-xs text-slate-400">Días garantía</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">© 2024 GO FIX MIAMI. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-white transition-colors">Garantía</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
