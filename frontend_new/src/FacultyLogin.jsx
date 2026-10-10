import { useState } from "react";

function FacultyLogin({ onLogin }) {

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
                "http://https://classroom-availability-backend-rwso.onrender.com/faculty/login",
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

                // Login successful
                onLogin(data);

            } else {

                setError(
                    data.message || "Invalid faculty email or password."
                );
            }

        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to Java backend."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>

            <div style={styles.loginBox}>

                <h1 style={styles.title}>
                    Faculty Login
                </h1>

                <p style={styles.subtitle}>
                    Classroom Availability System
                </p>

                <div style={styles.inputGroup}>

                    <label style={styles.label}>
                        Faculty Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter faculty email"
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
        background: "#f5f7fa"
    },

    loginBox: {
        width: "400px",
        padding: "30px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
    },

    title: {
        textAlign: "center",
        marginBottom: "5px"
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
        fontWeight: "bold"
    },

    input: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxSizing: "border-box"
    },

    error: {
        color: "red",
        textAlign: "center"
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
    }
};

export default FacultyLogin;