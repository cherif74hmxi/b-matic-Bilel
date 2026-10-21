import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import logo from "@/assets/bmatic-logo.webp";
import useSeo from "@/hooks/useSeo";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AccessDenied, AdminLoading, CheckError } from "@/components/admin/RequireAdmin";

const inputClass =
  "w-full min-h-[48px] bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-base";

const AdminLogin = () => {
  useSeo({ title: "Connexion — Admin B MATIC" });
  const { status, signIn } = useAdminSession();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Page demandée avant la redirection vers la connexion (uniquement sous /admin).
  const requested = (location.state as { from?: string } | null)?.from;
  const from =
    requested && (requested === "/admin" || requested.startsWith("/admin/")) && !requested.startsWith("/admin/login")
      ? requested
      : "/admin";

  if (status === "admin") return <Navigate to={from} replace />;
  if (status === "notAdmin") return <AccessDenied />;
  if (status === "error") return <CheckError />;
  if (status === "loading" && !submitting) return <AdminLoading />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const message = await signIn(email, password);
      if (message) setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="B MATIC" className="h-16 w-auto rounded mb-4" />
          <h1 className="font-heading text-lg font-bold uppercase tracking-widest text-gradient-neon">Espace admin</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gradient-card border-glow rounded-xl p-6 glow-card flex flex-col gap-4"
          noValidate
        >
          <div>
            <label htmlFor="admin-email" className="block text-sm mb-1.5">
              E-mail
            </label>
            <input
              id="admin-email"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                aria-pressed={showPassword}
                className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-neon-pink">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !email.trim() || !password}
            className="btn-main w-full min-h-[48px] mt-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Lock className="w-4 h-4" aria-hidden="true" />}
            Se connecter
          </button>
        </form>

        <p className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Retour au site
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
