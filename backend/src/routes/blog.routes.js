// routes/blog.routes.js mein add karo
import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadToSupabase } from "../utils/superbase.js";
import { throwApiError } from "../utils/apiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// Public routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.get("/slug/:slug", getBlogBySlug);

// Private routes
router.post(
  "/create",
  verifyJWT,
  upload.fields([{ name: "image", maxCount: 1 }]),
  createBlog
);
router.put(
  "/:id",
  verifyJWT,
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateBlog
);
router.delete("/:id", verifyJWT, deleteBlog);

router.post(
  "/upload-content-image",
  verifyJWT,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    console.log("Content image upload request received");

    if (!req.file) {
      return res.status(400).json({
        error: "Image file is required",
      });
    }

    try {
      const uploadResult = await uploadToSupabase(req.file, "blog");
      console.log("Upload result:", uploadResult);

      if (!uploadResult?.url) {
        return res.status(500).json({
          error: "Failed to upload image",
        });
      }

      // TinyMCE expects 'location' key
      return res.json({
        location: uploadResult.url,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({
        error: "Upload failed",
        details: error.message,
      });
    }
  })
);

export default router;
