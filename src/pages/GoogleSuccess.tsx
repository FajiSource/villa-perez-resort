import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function GoogleSuccess() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      navigate("/"); 
    }
  }, [token]);

  return <div>Signing you in with Google...</div>;
}
