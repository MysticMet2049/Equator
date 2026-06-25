import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/layout/Footer";

export default function RegisterPage() {
  const { register, authLoading, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", terms: false });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Le nom est requis.";
    if (!form.email.trim()) e.email = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide.";
    if (!form.password) e.password = "Le mot de passe est requis.";
    else if (form.password.length < 8) e.password = "Minimum 8 caractères.";
    if (form.password !== form.confirm) e.confirm = "Les mots de passe ne correspondent pas.";
    if (!form.terms) e.terms = "Vous devez accepter les conditions.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const res = await register(form.name, form.email, form.password);
    if (res.success) navigate("/verify-email", { state: { email: form.email } });
  };

  const inputClass = (key) => ({
    border: `1.5px solid ${errors[key] ? "#dc2626" : "var(--color-equator-beige)"}`,
    fontFamily: "var(--font-body)",
    background: "white",
  });

  return (
    <div className="min-h-screen pt-14 flex" style={{ background: "var(--color-equator-cream)" }}>
      {/* Left image */}
      <div className="hidden lg:block w-2/5 relative overflow-hidden" style={{ minHeight: "calc(100vh - 3.5rem)" }}>
        <img src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800&q=80" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
        <div className="absolute bottom-12 left-10 right-10 text-white">
          <h2 className="text-3xl font-light mb-3" style={{ fontFamily: "var(--font-display)" }}>L'élégance du commerce conscient.</h2>
          <p className="text-sm opacity-80" style={{ fontFamily: "var(--font-body)" }}>Rejoignez une communauté dédiée à l'artisanat d'exception et au design durable.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>BIENVENUE SUR EQUATOR</p>
          <h1 className="text-4xl font-light mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>Créer un compte</h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>Commencez votre voyage vers une consommation plus raffinée.</p>

          {authError && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-5" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
              <FiAlertCircle size={15} style={{ color: "#dc2626", flexShrink: 0 }} />
              <p className="text-xs" style={{ color: "#dc2626", fontFamily: "var(--font-body)" }}>{authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold tracking-widest mb-1.5" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>NOM COMPLET</label>
              <input type="text" placeholder="Jean Dupont" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputClass("name")}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-equator-green)")}
                onBlur={(e) => (e.target.style.borderColor = errors.name ? "#dc2626" : "var(--color-equator-beige)")} />
              {errors.name && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold tracking-widest mb-1.5" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>ADRESSE EMAIL</label>
              <input type="email" placeholder="jean.dupont@exemple.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputClass("email")}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-equator-green)")}
                onBlur={(e) => (e.target.style.borderColor = errors.email ? "#dc2626" : "var(--color-equator-beige)")} />
              {errors.email && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold tracking-widest mb-1.5" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>MOT DE PASSE</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-10" style={inputClass("password")}
                  onFocus={(e) => (e.target.style.borderColor = "var(--color-equator-green)")}
                  onBlur={(e) => (e.target.style.borderColor = errors.password ? "#dc2626" : "var(--color-equator-beige)")} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-equator-muted)" }}>
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold tracking-widest mb-1.5" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>CONFIRMER LE MOT DE PASSE</label>
              <input type={showPwd ? "text" : "password"} placeholder="••••••••" value={form.confirm} onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputClass("confirm")}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-equator-green)")}
                onBlur={(e) => (e.target.style.borderColor = errors.confirm ? "#dc2626" : "var(--color-equator-beige)")} />
              {errors.confirm && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" checked={form.terms} onChange={(e) => setForm((p) => ({ ...p, terms: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded" style={{ accentColor: "var(--color-equator-green)" }} />
              <label htmlFor="terms" className="text-sm leading-relaxed" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                J'accepte les{" "}
                <Link to="/terms" className="font-semibold" style={{ color: "var(--color-equator-text)" }}>Conditions d'Utilisation</Link>
                {" "}et la{" "}
                <Link to="/privacy" className="font-semibold" style={{ color: "var(--color-equator-text)" }}>Politique de Confidentialité</Link>.
              </label>
            </div>
            {errors.terms && <p className="text-xs -mt-3" style={{ color: "#dc2626" }}>{errors.terms}</p>}

            <button type="submit" disabled={authLoading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: authLoading ? "#6b9e84" : "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>
              {authLoading ? "Création en cours..." : "S'inscrire"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>Vous avez déjà un compte ?</p>
            <Link to="/login" className="w-full block py-2.5 rounded-xl text-sm font-semibold text-center transition-colors hover:bg-stone-50"
              style={{ border: "1.5px solid var(--color-equator-text)", color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
              SE CONNECTER
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}