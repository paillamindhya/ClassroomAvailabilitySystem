
import React, { useState } from "react";

const API = "https://classroom-availability-backend-rwso.onrender.com";

function StudentLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/student/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(
          data.message ||
            data.error ||
            `Login failed (${response.status}). Please check your credentials.`
        );
        return;
      }

      // Save student login information.
      localStorage.setItem("student", JSON.stringify(data));

      // Send student data to App.jsx.
      if (typeof onLogin === "function") {
        onLogin(data);
      } else {
        setMessage(
          "Login successful, but dashboard navigation is not configured."
        );
      }
    } catch (error) {
      console.error("Student login error:", error);
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Student Login</h2>
      <p>Classroom Availability System</p>

      <form onSubmit={handleLogin}>
        <label htmlFor="email">Student Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter student email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && <p role="alert">{message}</p>}
    </div>
  );
}

export default StudentLogin;
