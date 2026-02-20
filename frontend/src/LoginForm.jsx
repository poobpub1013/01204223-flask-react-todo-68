import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function LoginForm() {
  const LOGIN_API_URL = "http://localhost:5000/api/login";

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin() {
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(usernameInput, data.access_token);
        navigate("/");
      } else {
        setErrorMessage(data.error || "Login failed");
      }
    } catch (error) {
      setErrorMessage("Cannot connect to backend");
    }

    setLoading(false);
  }

  return (
    <>
      <h1>Login</h1>

      <div>
        <input
          type="text"
          placeholder="Username"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
      </div>

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {errorMessage && (
        <p style={{ color: "red" }}>{errorMessage}</p>
      )}
    </>
  );
}

export default LoginForm;