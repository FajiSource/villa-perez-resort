import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";

function GoogleCallback() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    apiService
      .get<{ access_token?: string }>(`/auth/callback${location.search}`)
      .then((data) => {
        setData(data);
        setLoading(false);
        if (data.access_token) {
          login(data.access_token);
          fetchUserData(data.access_token);
        }
      })
      .catch(() => setLoading(false));
  }, [location.search, login]);

  const fetchUserData = (token: string) => {
    apiService
      .get<any>("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setUser(data);
        setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
      });
  };

  if (loading) return <div>Loading Google login...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {user ? (
        <div>
          <h2 className="text-xl font-semibold">Welcome, {user.name}!</h2>
          <p>Redirecting you back...</p>
        </div>
      ) : (
        <div>
          <p>Signing in with Google...</p>
        </div>
      )}
    </div>
  );
}

export default GoogleCallback;
