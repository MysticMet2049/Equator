import { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

function validateLoginForm(form) {
  const errors = {};

  if (!form.username.trim()) errors.username = "Le nom d'utilisateur est requis.";
  if (!form.password) errors.password = "Le mot de passe est requis.";

  return errors;
}

function validateRegisterForm(form) {
  const errors = {};

  if (!form.username.trim()) {
    errors.registerUsername = "Le nom d'utilisateur est requis.";
  } else if (form.username.trim().length < 3) {
    errors.registerUsername = "Le nom d'utilisateur doit contenir au moins 3 caractères.";
  }

  if (!form.email.trim()) {
    errors.email = "L'adresse email est requise.";
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = "Adresse email invalide.";
  }

  if (!form.mobileNumber.trim()) errors.mobileNumber = "Le numéro de téléphone est requis.";

  if (!form.password) {
    errors.registerPassword = "Le mot de passe est requis.";
  } else if (form.password.length < 6) {
    errors.registerPassword = "Le mot de passe doit contenir au moins 6 caractères.";
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = "Veuillez confirmer le mot de passe.";
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas.";
  }

  return errors;
}

export default function useLoginPageForm() {
  const { login, register, authLoading, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const from = location.state?.from || "/";
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState(initialMode);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [localSuccess, setLocalSuccess] = useState(null);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const title = useMemo(() => (mode === "login" ? "Se connecter" : "Créer un compte"), [mode]);
  const subtitle = useMemo(
    () =>
      mode === "login"
        ? "Entrez votre nom d'utilisateur et votre mot de passe pour accéder à votre compte."
        : "Créez votre compte avec un nom d'utilisateur, une adresse email, un numéro de téléphone et un mot de passe.",
    [mode]
  );

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setAuthError(null);
    setLocalSuccess(null);
    setSearchParams(nextMode === "register" ? { mode: "register" } : {});
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setAuthError(null);
    setLocalSuccess(null);

    const nextErrors = validateLoginForm(loginForm);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const response = await login(loginForm.username.trim(), loginForm.password);

    if (response.success) {
      navigate(from, { replace: true });
      return;
    }

    if (response.needsVerification) {
      navigate("/verify-email", { state: { email: loginForm.username.trim() } });
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setAuthError(null);
    setLocalSuccess(null);

    const nextErrors = validateRegisterForm(registerForm);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const username = registerForm.username.trim();
    const email = registerForm.email.trim();

    const response = await register({
      username,
      email,
      mobileNumber: registerForm.mobileNumber.trim(),
      password: registerForm.password,
    });

    if (response.success && response.needsVerification) {
      navigate("/verify-email", { state: { email } });
      return;
    }

    if (response.success) {
      setLocalSuccess("Compte créé avec succès. Vous pouvez maintenant vous connecter.");
      setLoginForm({ username, password: "" });
      changeMode("login");
    }
  };

  return {
    mode,
    title,
    subtitle,
    authLoading,
    authError,
    localSuccess,
    errors,
    loginForm,
    setLoginForm,
    registerForm,
    setRegisterForm,
    showLoginPassword,
    setShowLoginPassword,
    showRegisterPassword,
    setShowRegisterPassword,
    changeMode,
    handleLoginSubmit,
    handleRegisterSubmit,
  };
}
