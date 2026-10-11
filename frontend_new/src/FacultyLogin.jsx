
import { useState } from "react";

function FacultyLogin({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Please enter email and password.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "https://classroom-availability-backend-rwso.onrender.com/faculty/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password
                    })
                }
            );

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                onLogin(data);
            } else {
                setError(
                    data.message ||
                    data.error ||
                    "Invalid faculty email or password."
                );
            }
        } catch (err) {
            console.error("Faculty login error:", err);
            setError(
                "Unable to connect to the backend. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <form style={styles.loginBox} onSubmit={handleLogin}>
                <h1 style={styles.title}>Faculty Login</h1>

                <p style={styles.subtitle}>
                    Classroom Availability System
                </p>

                <div style={styles.inputGroup}>
                    <label htmlFor="faculty-email" style={styles.label}>
                        Faculty Email
                    </label>

                    <input
                        id="faculty-email"
                        type="email"
                        placeholder="Enter faculty email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        autoComplete="username"
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="faculty-password" style={styles.label}>
                        Password
                    </label>

                    <input
                        id="faculty-password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        autoComplete="current-password"
                        required
                    />
                </div>

                {error && (
                    <p role="alert" style={styles.error}>
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    style={{
                        ...styles.button,
                        ...(loading ? styles.disabledButton : {})
                    }}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        background: "#f5f7fa"
    },

    loginBox: {
        width: "400px",
        maxWidth: "100%",
        padding: "30px",
        boxSizing: "border-box",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
    },

    title: {
        textAlign: "center",
        marginBottom: "5px",
        color: "#1e293b"
    },

    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: "25px"
    },

    inputGroup: {
        marginBottom: "18px"
    },

    label: {
        display: "block",
        marginBottom: "7px",
        fontWeight: "bold",
        color: "#334155"
    },

    input: {
        width: "100%",
        padding: "11px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxSizing: "border-box",
        fontSize: "15px"
    },

    error: {
        color: "#dc2626",
        textAlign: "center",
        fontSize: "14px"
    },

    button: {
        width: "100%",
        padding: "12px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px"
    },

    disabledButton: {
        opacity: 0.7,
        cursor: "not-allowed"
    }
};

export default FacultyLogin;
