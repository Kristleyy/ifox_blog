import React, { useState, useMemo } from "react";
import { usePosts, Post } from "../lib/api";
import {
  PlusCircle,
  X,
  Image as ImageIcon,
  Calendar,
  User,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface CreatePostData {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function FrontOffice() {
  const { approvedPosts, addPost } = usePosts();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredPosts = useMemo(() => {
    return approvedPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [approvedPosts, searchQuery]);

  return (
    <div className="min-vh-100 bg-subtle-texture d-flex flex-column">
      {/* Header */}
      <header className="bg-white shadow-sm border-bottom sticky-top">
        <div className="container-lg px-3 px-md-4" style={{ height: "64px" }}>
          <div className="d-flex align-items-center justify-content-between h-100">
            <div className="d-flex align-items-center gap-2">
              <h1
                className="fs-4 fw-bolder mb-0 brand"
                style={{ color: "var(--color-brand)", letterSpacing: "-0.5px" }}
              >
                <img src="/fox-logo.png" alt="Logo" className="logo" />
                IFoxBlog
              </h1>
            </div>

            <div
              className="flex-grow-1 mx-4 d-none d-md-block"
              style={{ maxWidth: 400 }}
            >
              <div className="position-relative">
                <Search
                  className="position-absolute top-50 translate-middle-y text-secondary ms-3"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control rounded-pill ps-5 bg-light border-0"
                  style={{ outline: "none" }}
                />
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <Link
                to="/admin"
                className="text-decoration-none fw-semibold small text-secondary"
                style={{ transition: "color 0.2s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-brand)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = "")}
              >
                Admin
              </Link>
              <button
                onClick={() => setIsCreating(true)}
                className="btn rounded-pill d-flex align-items-center gap-2 fw-medium shadow-sm px-4 py-2"
                style={{
                  backgroundColor: "var(--color-brand)",
                  color: "white",
                  border: "none",
                }}
              >
                <PlusCircle size={18} />
                <span className="d-none d-sm-inline">Create Post</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 container-lg px-3 px-md-4 py-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="fw-bold fs-3 mb-1">Community Posts</h2>
            <p className="text-secondary mb-0">
              Discover what others are sharing
            </p>
          </div>

          <div className="d-flex align-items-center gap-1 bg-white p-1 rounded border shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className="btn btn-sm p-2 rounded"
              style={
                viewMode === "grid"
                  ? {
                      backgroundColor: "var(--color-brand-light)",
                      color: "var(--color-brand)",
                    }
                  : { color: "#adb5bd", background: "none", border: "none" }
              }
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className="btn btn-sm p-2 rounded"
              style={
                viewMode === "list"
                  ? {
                      backgroundColor: "var(--color-brand-light)",
                      color: "var(--color-brand)",
                    }
                  : { color: "#adb5bd", background: "none", border: "none" }
              }
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="d-md-none mb-4">
          <div className="position-relative">
            <Search
              className="position-absolute top-50 translate-middle-y ms-3 text-secondary"
              size={18}
            />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control ps-5 rounded-3 border shadow-sm"
              style={{ outline: "none" }}
            />
          </div>
        </div>

        {/* Posts */}
        {approvedPosts.length === 0 ? (
          <div className="bg-white rounded-4 border p-5 text-center shadow-sm">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
              style={{
                width: 80,
                height: 80,
                backgroundColor: "var(--color-brand-light)",
                color: "var(--color-brand)",
              }}
            >
              <ImageIcon size={40} />
            </div>
            <h3 className="fs-5 fw-semibold mb-2">No posts available</h3>
            <p
              className="text-secondary mb-4 mx-auto"
              style={{ maxWidth: 400 }}
            >
              It looks a bit empty here. Be the first to share your thoughts
              with the community.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="btn rounded-pill d-inline-flex align-items-center gap-2 fw-medium shadow-sm px-4 py-2"
              style={{
                backgroundColor: "var(--color-brand)",
                color: "white",
                border: "none",
              }}
            >
              <PlusCircle size={20} /> Create the first post
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-secondary fs-5">
              No posts match your search for "{searchQuery}"
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid" ? "row g-4" : "d-flex flex-column gap-3"
            }
          >
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={
                  viewMode === "grid" ? "col-12 col-sm-6 col-lg-4" : ""
                }
              >
                <div
                  className="bg-white rounded-4 border shadow-sm h-100 overflow-hidden d-flex"
                  style={{
                    cursor: "pointer",
                    transition: "all 0.2s",
                    flexDirection: viewMode === "grid" ? "column" : "row",
                  }}
                  onClick={() => setSelectedPost(post)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 1rem 3rem rgba(0,0,0,.175)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                >
                  {post.imageUrl ? (
                    <div
                      className="overflow-hidden bg-light"
                      style={
                        viewMode === "grid"
                          ? { height: 192 }
                          : { height: "100%", width: 192, flexShrink: 0 }
                      }
                    >
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-100 h-100 object-fit-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        ...(viewMode === "grid"
                          ? { height: 192 }
                          : { height: "100%", width: 192, flexShrink: 0 }),
                        background:
                          "linear-gradient(135deg, var(--color-brand-light), #dbeafe)",
                        color: "var(--color-brand)",
                        opacity: 0.5,
                      }}
                    >
                      <ImageIcon size={48} />
                    </div>
                  )}
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span
                        className="badge rounded-2 small fw-medium px-2 py-1"
                        style={{
                          backgroundColor: "var(--color-brand-light)",
                          color: "var(--color-brand)",
                        }}
                      >
                        {post.name}
                      </span>
                      <span className="text-secondary">•</span>
                      <span className="text-secondary small">
                        {format(post.createdAt, "MMM d, yyyy")}
                      </span>
                    </div>
                    <h3 className="fw-bold fs-5 mb-2 text-truncate">
                      {post.title}
                    </h3>
                    <p
                      className="text-secondary small mb-3 flex-grow-1"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.description}
                    </p>
                    <div
                      className="border-top pt-3 mt-auto small fw-medium"
                      style={{ color: "var(--color-brand)" }}
                    >
                      Read full post →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Post Details Modal */}
      {selectedPost && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            className="position-absolute w-100 h-100"
            style={{
              backgroundColor: "rgba(17,24,39,0.7)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setSelectedPost(null)}
          />
          <div
            className="bg-white rounded-4 shadow-lg w-100 position-relative overflow-hidden d-flex flex-column"
            style={{ maxWidth: 768, maxHeight: "90vh", zIndex: 10 }}
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="btn position-absolute top-0 end-0 m-3 rounded-circle p-2"
              style={{
                zIndex: 20,
                backgroundColor: "rgba(0,0,0,0.2)",
                color: "white",
                border: "none",
              }}
            >
              <X size={20} />
            </button>

            <div className="overflow-auto flex-grow-1">
              {selectedPost.imageUrl && (
                <div
                  className="position-relative w-100"
                  style={{ height: 300 }}
                >
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div
                    className="position-absolute bottom-0 start-0 end-0 p-4 text-white"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                    }}
                  >
                    <h2 className="fs-3 fw-bold mb-2">{selectedPost.title}</h2>
                    <div className="d-flex align-items-center gap-3 small text-light">
                      <span className="d-flex align-items-center gap-1">
                        <User size={16} />
                        {selectedPost.name}
                      </span>
                      <span>•</span>
                      <span className="d-flex align-items-center gap-1">
                        <Calendar size={16} />
                        {format(selectedPost.createdAt, "MMMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 p-md-5">
                {!selectedPost.imageUrl && (
                  <div className="mb-4">
                    <h2 className="fs-3 fw-bold mb-3">{selectedPost.title}</h2>
                    <div className="d-flex align-items-center gap-3 small text-secondary">
                      <span
                        className="d-flex align-items-center gap-1 rounded-pill px-3 py-1"
                        style={{
                          backgroundColor: "var(--color-brand-light)",
                          color: "var(--color-brand)",
                        }}
                      >
                        <User size={16} />
                        {selectedPost.name}
                      </span>
                      <span>•</span>
                      <span className="d-flex align-items-center gap-1">
                        <Calendar size={16} />
                        {format(selectedPost.createdAt, "MMMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                )}
                <p
                  className="text-secondary lh-lg"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {selectedPost.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {isCreating && (
        <CreatePostModal
          onClose={() => setIsCreating(false)}
          onSubmit={(data) => {
            addPost(data);
            setIsCreating(false);
            alert(
              "Post submitted successfully! It is now pending admin approval.",
            );
          }}
        />
      )}
    </div>
  );
}

function CreatePostModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: CreatePostData) => void;
}) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, title, description, imageUrl });
  };

  return (
    <div
      className="position-fixed w-100 h-100 top-0 start-0 d-flex align-items-center justify-content-center p-3"
      style={{
        zIndex: 1050,
        backgroundColor: "rgba(17,24,39,0.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="bg-white rounded-4 shadow-lg w-100 overflow-hidden"
        style={{ maxWidth: 560 }}
      >
        <div className="d-flex align-items-center justify-content-between p-4 border-bottom bg-subtle-texture">
          <div>
            <h2 className="fs-5 fw-bold mb-0">Create New Post</h2>
            <p className="text-secondary small mb-0 mt-1">
              Share something with the community
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-light rounded-circle p-2"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-3">
            <label htmlFor="title" className="form-label fw-semibold small">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control rounded-3 bg-subtle-texture"
              placeholder="A catchy title..."
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-6">
              <label htmlFor="name" className="form-label fw-semibold small">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control rounded-3 bg-subtle-texture"
                placeholder="John Doe"
              />
            </div>
            <div className="col-12 col-sm-6">
              <label
                htmlFor="imageUpload"
                className="form-label fw-semibold small"
              >
                Image (Optional)
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setImageUrl(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                className="form-control rounded-3"
              />
            </div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="description"
              className="form-label fw-semibold small"
            >
              Description
            </label>
            <textarea
              id="description"
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control rounded-3 bg-subtle-texture"
              placeholder="What's on your mind?"
              style={{ resize: "none" }}
            />
          </div>

          {imageUrl && (
            <div
              className="rounded-3 overflow-hidden border bg-light mb-3 position-relative"
              style={{ height: 160 }}
            >
              <img
                src={imageUrl}
                alt="Preview"
                className="w-100 h-100 object-fit-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/600x200?text=Invalid+Image+URL";
                }}
              />
              <span className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-50">
                Image Preview
              </span>
            </div>
          )}

          <div className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-light fw-semibold rounded-3 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn fw-semibold rounded-3 px-4"
              style={{
                backgroundColor: "var(--color-brand)",
                color: "white",
                border: "none",
              }}
            >
              Submit for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
