import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function GoogleSuccess() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (token) {
      login(token);
      navigate("/dashboard", { replace: true }); 
    }
  }, [token, login, navigate]);

  return <div>Signing you in with Google...</div>;
}
