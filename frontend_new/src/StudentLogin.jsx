import { useState } from "react";

function StudentLogin({ onLogin }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {

        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:8080/student/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                onLogin(data);
            } else {
                setError(
                    data.message || "Invalid student email or password."
                );
            }

        } catch (error) {
            setError("Unable to connect to Java backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>

            <div style={styles.loginBox}>

                <h1 style={styles.title}>
                    Student Login
                </h1>

                <p style={styles.subtitle}>
                    Classroom Availability System
                </p>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>
                        Student Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter student email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                </div>

                {error && (
                    <p style={styles.error}>
                        {error}
                    </p>
                )}

                <button
                    onClick={handleLogin}
                    style={styles.button}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </div>

        </div>
    );
}

const styles = {

    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f7fb",
        fontFamily: "Arial, sans-serif"
    },

    loginBox: {
        width: "380px",
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "15px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
    },

    title: {
        textAlign: "center",
        marginBottom: "8px"
    },

    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: "30px"
    },

    inputGroup: {
        marginBottom: "20px"
    },

    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold"
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "15px"
    },

    button: {
        width: "100%",
        padding: "13px",
        backgroundColor: "#16a34a",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer"
    },

    error: {
        color: "#dc2626",
        textAlign: "center",
        marginBottom: "15px"
    }
};

export default StudentLogin;