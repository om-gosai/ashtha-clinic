import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);

      // Force re-render of whole app
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Welcome Back</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
