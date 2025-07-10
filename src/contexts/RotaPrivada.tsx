// src/routes/RotaPrivada.tsx
import { useContext, type JSX } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function RotaPrivada({ children }: { children: JSX.Element }) {
  const { usuario } = useContext(AuthContext);

  if (!usuario.token) {
    return <Navigate to="/login" />;
  }

  return children;
}
