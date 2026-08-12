import { useCallback, useState } from "react";
import type { AuthMode } from "../../types/auth";
import { login, register } from "./AuthModel";

export function useAuthViewModel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }

      setPassword("");
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [email, password, mode]);

  const toggleMode = useCallback(() => {
    setMode((prevMode) => (prevMode === "login" ? "register" : "login"));
    setError("");
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    setMode,
    loading,
    error,
    handleSubmit,
    toggleMode,
  } as const;
}
