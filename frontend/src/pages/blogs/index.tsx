import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  content: string;
  authorName: string;
  author: string;
  likes: string[];
  createdAt: string;
}

export default function Blogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [likeLoading, setLikeLoading] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setUserId(localStorage.getItem("userId") || "");
    setUserName(localStorage.getItem("userName") || "");
    fetchBlogs(token);
  }, []);

  const fetchBlogs = async (token: string) => {
    try {
      const res = await fetch(`${API}/api/blogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.clear();
        router.replace("/login");
        return;
      }
      const data = await res.json();
      setBlogs(data);
    } catch {
      alert("Failed to fetch blogs");
    }
    setLoading(false);
  };

  const handleLike = async (blogId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLikeLoading(blogId);
    try {
      const res = await fetch(`${API}/api/blogs/${blogId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setBlogs((prev) =>
          prev.map((b) => {
            if (b._id !== blogId) return b;
            // toggle userId in likes array locally
            const alreadyLiked = b.likes.includes(userId);
            const newLikes = alreadyLiked
              ? b.likes.filter((id) => id !== userId)
              : [...b.likes, userId];
            return { ...b, likes: newLikes };
          })
        );
      }
    } catch {
      alert("Error liking blog");
    }
    setLikeLoading(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm("Delete this blog?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/api/blogs/${blogId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      } else {
        const data = await res.json();
        alert(data.msg || "Delete failed");
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: "1px solid #ccc", paddingBottom: 12 }}>
        <h1>Blog Feed</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span>Hello, {userName}</span>
          <Link href="/blogs/create">
            <button style={{ padding: "6px 16px" }}>+ Write Blog</button>
          </Link>
          <button onClick={handleLogout} style={{ padding: "6px 16px" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Blog List */}
      {loading ? (
        <p>Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs yet. Be the first to write one!</p>
      ) : (
        blogs.map((blog) => {
          const liked = blog.likes.includes(userId);
          const isAuthor = blog.author === userId;
          return (
            <div
              key={blog._id}
              style={{ border: "1px solid #ccc", padding: 16, marginBottom: 16 }}
            >
              <h2>{blog.title}</h2>
              <p style={{ color: "#555", fontSize: 13, marginTop: 4 }}>
                By {blog.authorName} &nbsp;·&nbsp;{" "}
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
                {blog.content.length > 200
                  ? blog.content.slice(0, 200) + "..."
                  : blog.content}
              </p>
              <div style={{ marginTop: 16, display: "flex", gap: 16, alignItems: "center" }}>
                <button
                  onClick={() => handleLike(blog._id)}
                  disabled={likeLoading === blog._id}
                  style={{ padding: "4px 16px" }}
                >
                  {liked ? "❤️ Liked" : "🤍 Like"} ({blog.likes.length})
                </button>
                {isAuthor && (
                  <button
                    onClick={() => handleDelete(blog._id)}
                    style={{ padding: "4px 16px", color: "red" }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
