import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function CreateBlog() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const token = localStorage.getItem("token");
    const authorName = localStorage.getItem("userName") || "Anonymous";
    try {
      const res = await fetch(`${API}/api/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, authorName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.msg || "Failed to create blog");
        setLoading(false);
        return;
      }
      router.push("/blogs");
    } catch {
      setMsg("Server error");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Link href="/blogs" style={{ textDecoration: "underline" }}>
          ← Back to Blogs
        </Link>
      </div>
      <h1>Write a Blog</h1>
      <br />
      {msg && <p style={{ color: "red", marginBottom: 12 }}>{msg}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Title</label>
          <br />
          <input
            type="text"
            value={form.title}
            placeholder="Blog title"
            required
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 4, border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Content</label>
          <br />
          <textarea
            value={form.content}
            placeholder="Write your blog content here..."
            required
            rows={10}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 4, border: "1px solid #ccc", resize: "vertical" }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "8px 24px" }}>
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
}
