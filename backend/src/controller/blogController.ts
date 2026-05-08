import { Request, Response } from "express";
import Blog from "../models/blog";
import mongoose from "mongoose";

// GET ALL BLOGS (public - anyone logged in can see)
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

// GET SINGLE BLOG
export const getBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    return res.json(blog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

// CREATE BLOG
export const createBlog = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { title, content, authorName } = req.body;

    if (!title || !content) {
      return res.status(400).json({ msg: "Title and content are required" });
    }

    const blog = await Blog.create({
      title,
      content,
      author: userId,
      authorName: authorName || "Anonymous",
      likes: [],
    });

    return res.status(201).json({ msg: "Blog created", blog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

// TOGGLE LIKE
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const alreadyLiked = blog.likes.some((id) => id.equals(userObjectId));

    if (alreadyLiked) {
      blog.likes = blog.likes.filter((id) => !id.equals(userObjectId));
    } else {
      blog.likes.push(userObjectId);
    }

    await blog.save();
    return res.json({ msg: alreadyLiked ? "Unliked" : "Liked", likes: blog.likes.length, liked: !alreadyLiked });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

// DELETE BLOG (only author)
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    if (blog.author.toString() !== userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Blog deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};
