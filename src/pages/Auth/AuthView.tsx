import type { FormEvent } from "react";
import { useAuthViewModel } from "./useAuthViewModel";
import "./AuthView.css";

export function AuthView() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    loading,
    error,
    handleSubmit,
    toggleMode,
  } = useAuthViewModel();

  const heading = mode === "login" ? "Login" : "Create Account";
  const subtitle =
    mode === "login"
      ? "Sign in to access your favourites."
      : "Create an account to save your favourite movies.";
  const switchButtonLabel =
    mode === "login"
      ? "Need an account? Create one"
      : "Already registered? Log in";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void handleSubmit();
  }

  return (
    <main className="auth">
      <section className="auth__card">
        <h1 className="auth__title">{heading}</h1>
        <p className="auth__subtitle">{subtitle}</p>

        {error ? (
          <p className="auth__error" role="alert">
            {error}
          </p>
        ) : null}

        <form className="auth__form" onSubmit={onSubmit} noValidate>
          <label className="auth__field">
            Email
            <input
              className="auth__input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              required
            />
          </label>

          <label className="auth__field">
            Password
            <input
              className="auth__input"
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              required
            />
          </label>

          <button className="auth__submit" type="submit" disabled={loading}>
            {loading ? "Please wait..." : heading}
          </button>
        </form>

        <button
          className="auth__switch"
          type="button"
          onClick={toggleMode}
          disabled={loading}
        >
          {switchButtonLabel}
        </button>
      </section>
    </main>
  );
}
