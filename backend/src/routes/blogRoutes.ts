import express from "express";
import {
  getAllBlogs,
  getBlog,
  createBlog,
  toggleLike,
  deleteBlog,
} from "../controller/blogController";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/", auth, getAllBlogs);
router.get("/:id", auth, getBlog);
router.post("/", auth, createBlog);
router.post("/:id/like", auth, toggleLike);
router.delete("/:id", auth, deleteBlog);

export default router;
