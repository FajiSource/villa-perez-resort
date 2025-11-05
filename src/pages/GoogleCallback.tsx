import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function GoogleCallback() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/auth/callback${location.search}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          fetchUserData(data.access_token);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchUserData = (token: string) => {
    fetch(`http://localhost:8000/api/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setTimeout(() => navigate("/"), 1500);
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
