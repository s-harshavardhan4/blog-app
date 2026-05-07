import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.msg || "Login failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("userName", data.user.name);
      router.push("/blogs");
    } catch {
      setMsg("Server error");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
      <h1>Login</h1>
      <br />
      {msg && <p style={{ color: "red", marginBottom: 12 }}>{msg}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={form.email}
            placeholder="Enter your email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 4, border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={form.password}
            placeholder="Enter your password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 4, border: "1px solid #ccc" }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "8px 24px" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <br />
      <p>
        New user?{" "}
        <Link href="/signup" style={{ textDecoration: "underline" }}>
          Sign up here
        </Link>
      </p>
    </div>
  );
}
