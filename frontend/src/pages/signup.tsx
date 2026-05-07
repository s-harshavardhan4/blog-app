import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${API}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsError(true);
        setMsg(data.msg || "Signup failed");
        setLoading(false);
        return;
      }
      setIsError(false);
      setMsg("Account created! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setIsError(true);
      setMsg("Server error");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
      <h1>Sign Up</h1>
      <br />
      {msg && (
        <p style={{ color: isError ? "red" : "green", marginBottom: 12 }}>
          {msg}
        </p>
      )}
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: 12 }}>
          <label>Full Name</label>
          <br />
          <input
            type="text"
            value={form.name}
            placeholder="Enter your name"
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 4, border: "1px solid #ccc" }}
          />
        </div>
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
            placeholder="Create a password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 4, border: "1px solid #ccc" }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "8px 24px" }}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      <br />
      <p>
        Already have an account?{" "}
        <Link href="/login" style={{ textDecoration: "underline" }}>
          Login here
        </Link>
      </p>
    </div>
  );
}
