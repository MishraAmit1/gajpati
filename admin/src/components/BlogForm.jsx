import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { toast } from "react-hot-toast";

const initialFormState = {
  title: "",
  excerpt: "",
  description: "",
  content: "",
  category: "",
  author: "",
  readTime: "",
  featured: false,
  tags: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  image: null,
};

const arrToString = (val) => (Array.isArray(val) ? val.join(", ") : val || "");

const generateSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

const validate = (values, isEdit) => {
  const errors = {};
  if (!String(values.title).trim()) errors.title = "Title is required";
  if (String(values.title).length < 3)
    errors.title = "Title must be at least 3 characters";
  if (String(values.title).length > 100)
    errors.title = "Title cannot exceed 100 characters";
  if (!String(values.excerpt).trim()) errors.excerpt = "Excerpt is required";
  if (String(values.excerpt).length < 10)
    errors.excerpt = "Excerpt must be at least 10 characters";
  if (String(values.excerpt).length > 300)
    errors.excerpt = "Excerpt cannot exceed 300 characters";
  if (!String(values.description).trim())
    errors.description = "Description is required";
  if (String(values.description).length < 10)
    errors.description = "Description must be at least 10 characters";
  if (String(values.description).length > 500)
    errors.description = "Description cannot exceed 500 characters";
  if (!String(values.content).trim()) errors.content = "Content is required";
  if (String(values.content).length < 50)
    errors.content = "Content must be at least 50 characters";
  if (!String(values.category).trim()) errors.category = "Category is required";
  if (!String(values.author).trim()) errors.author = "Author is required";
  if (String(values.author).length < 2)
    errors.author = "Author name must be at least 2 characters";
  if (String(values.author).length > 50)
    errors.author = "Author name cannot exceed 50 characters";
  if (!String(values.readTime).trim())
    errors.readTime = "Read time is required";
  if (!/^\d+\s+min\s+read$/.test(values.readTime))
    errors.readTime = "Read time must be in format 'X min read'";
  if (!String(values.tags).trim()) errors.tags = "At least one tag is required";
  if (!String(values.seoTitle).trim())
    errors.seoTitle = "SEO Title is required";
  if (String(values.seoTitle).length < 3)
    errors.seoTitle = "SEO Title must be at least 3 characters";
  if (String(values.seoTitle).length > 60)
    errors.seoTitle = "SEO Title cannot exceed 60 characters";
  if (!String(values.seoDescription).trim())
    errors.seoDescription = "SEO Description is required";
  if (String(values.seoDescription).length < 10)
    errors.seoDescription = "SEO Description must be at least 10 characters";
  if (String(values.seoDescription).length > 160)
    errors.seoDescription = "SEO Description cannot exceed 160 characters";
  if (!String(values.seoKeywords).trim())
    errors.seoKeywords = "At least one SEO keyword is required";
  if (!isEdit && !values.image) errors.image = "Image is required";
  return errors;
};

const BlogForm = ({
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}) => {
  const editorRef = useRef(null);
  const [values, setValues] = useState({
    ...initialFormState,
    ...initialValues,
    seoKeywords: arrToString(initialValues.seoKeywords),
    tags: arrToString(initialValues.tags),
    featured: initialValues.featured || false,
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imagePreview, setImagePreview] = useState(initialValues.image || null);
  const [isUploading, setIsUploading] = useState(false);

  // Store URL mappings (blob URL -> actual URL)
  const imageMapRef = useRef(new Map());

  useEffect(() => {
    setValues({
      ...initialFormState,
      ...initialValues,
      seoKeywords: arrToString(initialValues.seoKeywords),
      tags: arrToString(initialValues.tags),
      featured: initialValues.featured || false,
      image: null,
    });
    setImagePreview(initialValues.image || null);
  }, [initialValues?._id, isEdit]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      imageMapRef.current.forEach((_, blobUrl) => {
        URL.revokeObjectURL(blobUrl);
      });
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setValues((prev) => ({ ...prev, image: file }));
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    setValues((prev) => ({ ...prev, featured: e.target.checked }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Handle TinyMCE image upload
  // handleEditorImageUpload function ko replace karo:
  // Replace handleEditorImageUpload function:
  const handleEditorImageUpload = (blobInfo, progress) => {
    return new Promise(async (resolve, reject) => {
      try {
        const file = blobInfo.blob();

        progress(0);

        // Direct API call
        const response = await api.uploadContentImage(file);
        console.log("Upload response:", response);

        // Check different response formats
        const imageUrl =
          response.location || response.url || response.data?.url;

        if (imageUrl) {
          progress(100);
          resolve(imageUrl); // Return actual URL, not blob
        } else {
          reject("No URL in response");
        }
      } catch (error) {
        console.error("Upload error:", error);
        reject(error.message || "Failed to upload image");
      }
    });
  };

  // Update handleSubmit to remove processContent:
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(values, isEdit);
    setErrors(validationErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (Object.keys(validationErrors).length === 0) {
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("excerpt", values.excerpt);
        formData.append("description", values.description);
        formData.append("content", values.content); // Direct content, no processing
        formData.append("category", values.category);
        formData.append("author", values.author);
        formData.append("readTime", values.readTime);
        formData.append("featured", values.featured);
        formData.append("tags", values.tags);
        formData.append("seoTitle", values.seoTitle);
        formData.append("seoDescription", values.seoDescription);
        formData.append("seoKeywords", values.seoKeywords);
        formData.append("slug", generateSlug(values.title));
        if (values.image) formData.append("image", values.image);

        await onSubmit(formData);
      } catch (error) {
        console.error("Submit error:", error);
        toast.error("Failed to save blog");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Title *</label>
        <Input
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading || isUploading}
          placeholder="Blog title"
        />
        {touched.title && errors.title && (
          <div className="text-red-600 text-xs mt-1">{errors.title}</div>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Excerpt *</label>
        <textarea
          name="excerpt"
          value={values.excerpt}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading || isUploading}
          placeholder="Short excerpt of the blog"
          className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
          rows={3}
        />
        {touched.excerpt && errors.excerpt && (
          <div className="text-red-600 text-xs mt-1">{errors.excerpt}</div>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Description *</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading || isUploading}
          placeholder="Description for SEO"
          className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
          rows={3}
        />
        {touched.description && errors.description && (
          <div className="text-red-600 text-xs mt-1">{errors.description}</div>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Content *</label>
        <Editor
          apiKey="q6a9oao4rxst8z7ljy0e3o3bhxuhqn7x0q66v9ts96c5vg5j"
          onInit={(evt, editor) => (editorRef.current = editor)}
          value={values.content}
          onEditorChange={(newContent) => {
            setValues((prev) => ({ ...prev, content: newContent }));
            setTouched((prev) => ({ ...prev, content: true }));
          }}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor backcolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | image media table | code fullscreen preview help",

            init_instance_callback: (editor) => {
              console.log("TinyMCE initialized");

              editor.on("ImageUploadStart", (e) => {
                console.log("Image upload started:", e);
              });

              editor.on("ImageUploadEnd", (e) => {
                console.log("Image upload ended:", e);
              });
            },
            // Image upload settings
            images_upload_handler: handleEditorImageUpload,
            automatic_uploads: true, // Important: Enable auto upload
            images_reuse_filename: true,
            file_picker_types: "image",

            // URL settings
            convert_urls: false,
            relative_urls: false,
            remove_script_host: false,

            // Disable base64 images
            paste_data_images: false, // Important: Disable base64

            branding: false,
          }}
          disabled={loading || isUploading}
        />
        {touched.content && errors.content && (
          <div className="text-red-600 text-xs mt-1">{errors.content}</div>
        )}
        {imageMapRef.current.size > 0 && (
          <div className="text-xs text-green-600 mt-1">
            ✓ {imageMapRef.current.size} image(s) uploaded and ready
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Category *</label>
          <select
            name="category"
            value={values.category}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading || isUploading}
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
          >
            <option value="">Select category</option>
            {[
              "Technical Guide",
              "Application",
              "Product Innovation",
              "Sustainability",
              "Quality Assurance",
              "Case Study",
            ].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {touched.category && errors.category && (
            <div className="text-red-600 text-xs mt-1">{errors.category}</div>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Author *</label>
          <Input
            name="author"
            value={values.author}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading || isUploading}
            placeholder="Author name"
          />
          {touched.author && errors.author && (
            <div className="text-red-600 text-xs mt-1">{errors.author}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Read Time *</label>
          <Input
            name="readTime"
            value={values.readTime}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading || isUploading}
            placeholder="e.g. 5 min read"
          />
          {touched.readTime && errors.readTime && (
            <div className="text-red-600 text-xs mt-1">{errors.readTime}</div>
          )}
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="featured"
            checked={values.featured}
            onChange={handleCheckboxChange}
            disabled={loading || isUploading}
            className="h-4 w-4"
          />
          <label htmlFor="featured" className="font-medium cursor-pointer">
            Featured Blog
          </label>
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1">
          Tags * (comma separated)
        </label>
        <Input
          name="tags"
          value={values.tags}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading || isUploading}
          placeholder="e.g. eco-friendly, sustainable, paper-bags"
        />
        {touched.tags && errors.tags && (
          <div className="text-red-600 text-xs mt-1">{errors.tags}</div>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">SEO Title *</label>
        <Input
          name="seoTitle"
          value={values.seoTitle}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading || isUploading}
          placeholder="SEO optimized title (max 60 chars)"
        />
        {touched.seoTitle && errors.seoTitle && (
          <div className="text-red-600 text-xs mt-1">{errors.seoTitle}</div>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">SEO Description *</label>
        <textarea
          name="seoDescription"
          value={values.seoDescription}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading || isUploading}
          placeholder="SEO meta description (max 160 chars)"
          className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
          rows={2}
        />
        {touched.seoDescription && errors.seoDescription && (
          <div className="text-red-600 text-xs mt-1">
            {errors.seoDescription}
          </div>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">
          SEO Keywords * (comma separated)
        </label>
        <Input
          name="seoKeywords"
          value={values.seoKeywords}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading || isUploading}
          placeholder="e.g. paper bags, eco-friendly packaging, sustainable"
        />
        {touched.seoKeywords && errors.seoKeywords && (
          <div className="text-red-600 text-xs mt-1">{errors.seoKeywords}</div>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">
          Featured Image {isEdit ? "(leave blank to keep current)" : "*"}
        </label>
        <Input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading || isUploading}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 h-32 rounded border object-cover"
          />
        )}
        {touched.image && errors.image && (
          <div className="text-red-600 text-xs mt-1">{errors.image}</div>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading || isUploading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading || isUploading}>
          {isUploading
            ? "Processing..."
            : loading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update Blog"
            : "Create Blog"}
        </Button>
      </div>
    </form>
  );
};

export default BlogForm;
