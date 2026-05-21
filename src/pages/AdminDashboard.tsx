import React, { useState, useMemo } from "react";
import { usePosts } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useNavigate, Navigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  LogOut,
  LayoutDashboard,
  FileText,
  Clock,
  Trash2,
  Search,
  CheckSquare,
} from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { posts, pendingPosts, approvedPosts, updatePostStatus, deletePost } =
    usePosts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "pending" | "approved"
  >("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredList = useMemo(() => {
    const currentList =
      activeTab === "pending"
        ? pendingPosts
        : activeTab === "approved"
          ? approvedPosts
          : [];
    return currentList.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [activeTab, pendingPosts, approvedPosts, searchQuery]);

  const rejectedCount = posts.filter((p) => p.status === "REJECTED").length;

  if (!isAuthenticated) return <Navigate to="/admin" />;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-vh-100 bg-subtle-texture d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <aside
        className="d-flex flex-column shadow"
        style={{
          backgroundColor: "#1e293b",
          color: "#cbd5e1",
          width: 300, // fixed 240px
          minWidth: 100, // never shrink below 240px
          flexShrink: 0, // add this new line
        }}
      >
        <div
          className="d-flex align-items-center px-4 border-bottom"
          style={{
            height: 64,
            backgroundColor: "#0f172a",
            borderColor: "#1e293b",
          }}
        >
          <div className="d-flex align-items-center gap-2 fw-bold fs-5 text-white">
            <div
              className="d-flex align-items-center justify-content-center rounded-2 shadow-sm text-white"
              style={{
                width: 32,
                height: 32,
                background:
                  "linear-gradient(135deg, var(--color-brand), #9333ea)",
                fontSize: 13,
              }}
            >
              EA
            </div>
            Administrator Menu
          </div>
        </div>

        <div className="p-3 flex-grow-1 overflow-auto">
          <div
            className="text-uppercase fw-bold small px-2 mb-2 mt-3"
            style={{ color: "#64748b", letterSpacing: "0.08em", fontSize: 11 }}
          >
            Main Menu
          </div>
          <div className="d-flex flex-column gap-1 mb-4">
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard Overview"
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
            <NavItem
              icon={<Clock size={20} />}
              label="Pending Moderation"
              active={activeTab === "pending"}
              onClick={() => setActiveTab("pending")}
              badge={pendingPosts.length > 0 ? pendingPosts.length : undefined}
              badgeColor="#f59e0b"
            />
            <NavItem
              icon={<CheckSquare size={20} />}
              label="Published Posts"
              active={activeTab === "approved"}
              onClick={() => setActiveTab("approved")}
              badge={
                approvedPosts.length > 0 ? approvedPosts.length : undefined
              }
              badgeColor="#10b981"
            />
          </div>
        </div>

        <div
          className="p-3 border-top"
          style={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
        >
          <div className="d-flex align-items-center gap-3 px-2 mb-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-uppercase border"
              style={{
                width: 40,
                height: 40,
                backgroundColor: "rgba(240,88,36,0.15)",
                color: "var(--color-brand)",
                borderColor: "rgba(240,88,36,0.3)",
                flexShrink: 0,
              }}
            >
              {currentUser ? currentUser.charAt(0) : "A"}
            </div>
            <div>
              <div className="fw-bold text-white small">
                {currentUser || "Administrator"}
              </div>
              <div style={{ color: "#64748b", fontSize: 12 }}>
                @{currentUser || "admin"}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn w-100 d-flex align-items-center justify-content-center gap-2 fw-medium small rounded-3 py-2 border"
            style={{
              backgroundColor: "rgba(244,63,94,0.1)",
              color: "#fb7185",
              borderColor: "rgba(244,63,94,0.2)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "#e11d48";
              (e.currentTarget as HTMLElement).style.color = "white";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "rgba(244,63,94,0.1)";
              (e.currentTarget as HTMLElement).style.color = "#fb7185";
            }}
          >
            <LogOut size={18} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 d-flex flex-column overflow-hidden bg-subtle-texture">
        <header
          className="bg-white border-bottom shadow-sm d-flex align-items-center justify-content-between px-4 sticky-top"
          style={{ height: 64, borderColor: "#e2e8f0", zIndex: 10 }}
        >
          <h1
            className="fs-5 fw-bold mb-0 text-capitalize"
            style={{ color: "#1e293b" }}
          >
            {activeTab === "overview"
              ? "Dashboard Overview"
              : `${activeTab} Posts`}
          </h1>
          {activeTab !== "overview" && (
            <div className="position-relative" style={{ width: 256 }}>
              <Search
                className="position-absolute top-50 translate-middle-y ms-3"
                size={16}
                style={{ color: "#94a3b8" }}
              />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control form-control-sm rounded-2 ps-5 bg-light border-0"
              />
            </div>
          )}
        </header>

        <div className="flex-grow-1 overflow-auto p-4">
          <div className="mx-auto" style={{ maxWidth: 1280 }}>
            {activeTab === "overview" && (
              <div>
                <div className="row g-4 mb-4">
                  <div className="col-12 col-sm-6 col-lg-3">
                    <StatCard
                      title="Total Submissions"
                      value={posts.length}
                      icon={<FileText size={24} />}
                      color="#2563eb"
                      bgColor="#dbeafe"
                    />
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <StatCard
                      title="Pending Approval"
                      value={pendingPosts.length}
                      icon={<Clock size={24} />}
                      color="#d97706"
                      bgColor="#fef3c7"
                    />
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <StatCard
                      title="Published Posts"
                      value={approvedPosts.length}
                      icon={<CheckCircle size={24} />}
                      color="#059669"
                      bgColor="#d1fae5"
                    />
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <StatCard
                      title="Rejected Posts"
                      value={rejectedCount}
                      icon={<XCircle size={24} />}
                      color="#e11d48"
                      bgColor="#ffe4e6"
                    />
                  </div>
                </div>

                <div
                  className="bg-white rounded-4 shadow-sm border p-4"
                  style={{ borderColor: "#e2e8f0" }}
                >
                  <h3
                    className="fw-bold mb-4 d-flex align-items-center gap-2"
                    style={{ color: "#1e293b" }}
                  >
                    <Clock size={20} style={{ color: "#f59e0b" }} /> Recent
                    Pending
                  </h3>
                  <div className="d-flex flex-column gap-3">
                    {pendingPosts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className="d-flex align-items-center justify-content-between p-3 rounded-3 border bg-subtle-texture"
                        style={{ borderColor: "#f1f5f9" }}
                      >
                        <div>
                          <div
                            className="fw-semibold"
                            style={{ color: "#1e293b" }}
                          >
                            {post.title}
                          </div>
                          <div className="small" style={{ color: "#64748b" }}>
                            by {post.name} •{" "}
                            {format(post.createdAt, "MMM d, yyyy")}
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab("pending")}
                          className="btn btn-link btn-sm fw-medium p-0 text-decoration-none"
                          style={{ color: "var(--color-brand)" }}
                        >
                          Review
                        </button>
                      </div>
                    ))}
                    {pendingPosts.length === 0 && (
                      <p
                        className="small py-3 mb-0"
                        style={{ color: "#64748b" }}
                      >
                        No pending posts to review.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab !== "overview" && (
              <div
                className="bg-white rounded-4 shadow-sm border overflow-hidden"
                style={{ borderColor: "#e2e8f0" }}
              >
                <div className="table-responsive">
                  <table
                    className="table table-hover mb-0 small"
                    style={{ color: "#475569" }}
                  >
                    <thead
                      className="bg-subtle-texture border-bottom text-uppercase fw-bold"
                      style={{ color: "#334155", fontSize: 11 }}
                    >
                      <tr>
                        <th className="px-4 py-3">Author & Info</th>
                        <th className="px-4 py-3">Post Content</th>
                        <th className="px-4 py-3">Submission Date</th>
                        <th className="px-4 py-3 text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredList.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-5 text-center">
                            <div className="d-flex flex-column align-items-center justify-content-center py-4">
                              {activeTab === "pending" ? (
                                <>
                                  <CheckCircle
                                    size={48}
                                    className="mb-3"
                                    style={{ color: "#34d399" }}
                                  />
                                  <p
                                    className="fw-bold mb-1"
                                    style={{ color: "#334155" }}
                                  >
                                    Inbox Zero!
                                  </p>
                                  <p
                                    className="mb-0"
                                    style={{ color: "#64748b" }}
                                  >
                                    No pending posts to moderate.
                                  </p>
                                </>
                              ) : (
                                <>
                                  <FileText
                                    size={48}
                                    className="mb-3"
                                    style={{ color: "#cbd5e1" }}
                                  />
                                  <p
                                    className="fw-bold mb-1"
                                    style={{ color: "#334155" }}
                                  >
                                    No Posts Found
                                  </p>
                                  <p
                                    className="mb-0"
                                    style={{ color: "#64748b" }}
                                  >
                                    No published posts match your criteria.
                                  </p>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredList.map((post) => (
                          <tr key={post.id}>
                            <td
                              className="px-4 py-4 align-top"
                              style={{ width: "20%" }}
                            >
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <div
                                  className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-uppercase small"
                                  style={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: "#e2e8f0",
                                    color: "#475569",
                                    flexShrink: 0,
                                  }}
                                >
                                  {post.name.charAt(0)}
                                </div>
                                <div>
                                  <div
                                    className="fw-bold"
                                    style={{ color: "#0f172a" }}
                                  >
                                    {post.name}
                                  </div>
                                  <div
                                    className="font-monospace"
                                    style={{ color: "#94a3b8", fontSize: 11 }}
                                  >
                                    ID: {post.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4" style={{ width: "45%" }}>
                              <h6
                                className="fw-bold mb-1"
                                style={{ color: "#0f172a" }}
                              >
                                {post.title}
                              </h6>
                              <p
                                className="mb-3"
                                style={{
                                  color: "#475569",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {post.description}
                              </p>
                              {post.imageUrl && (
                                <div
                                  className="rounded-2 overflow-hidden border"
                                  style={{
                                    width: 160,
                                    height: 96,
                                    borderColor: "#e2e8f0",
                                  }}
                                >
                                  <img
                                    src={post.imageUrl}
                                    alt="Thumbnail"
                                    className="w-100 h-100 object-fit-cover"
                                  />
                                </div>
                              )}
                            </td>
                            <td
                              className="px-4 py-4 align-top text-nowrap"
                              style={{ width: "15%" }}
                            >
                              <div
                                className="fw-medium"
                                style={{ color: "#334155" }}
                              >
                                {format(post.createdAt, "MMM d, yyyy")}
                              </div>
                              <div
                                className="d-flex align-items-center gap-1 mt-1"
                                style={{ color: "#94a3b8", fontSize: 12 }}
                              >
                                <Clock size={12} />{" "}
                                {format(post.createdAt, "h:mm a")}
                              </div>
                            </td>
                            <td
                              className="px-4 py-4 align-top text-end"
                              style={{ width: "20%" }}
                            >
                              <div className="d-flex align-items-center justify-content-end gap-2">
                                {activeTab === "pending" ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        updatePostStatus(post.id, "APPROVED")
                                      }
                                      className="btn btn-sm btn-success d-inline-flex align-items-center gap-1 fw-semibold rounded-2 px-3"
                                    >
                                      <CheckCircle size={15} /> Approve
                                    </button>
                                    <button
                                      onClick={() =>
                                        updatePostStatus(post.id, "REJECTED")
                                      }
                                      className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 fw-semibold rounded-2 px-3"
                                    >
                                      <XCircle size={15} /> Reject
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          "Delete this post permanently?",
                                        )
                                      )
                                        deletePost(post.id);
                                    }}
                                    className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 fw-semibold rounded-2 px-3"
                                  >
                                    <Trash2 size={15} /> Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  badge,
  badgeColor = "var(--color-brand)",
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: number;
  badgeColor?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="btn w-100 d-flex align-items-center justify-content-between px-3 py-2 rounded-3 fw-semibold small border text-start"
      style={
        active
          ? {
              backgroundColor: "rgba(240,88,36,0.12)",
              color: "var(--color-brand)",
              borderColor: "rgba(240,88,36,0.2)",
            }
          : {
              backgroundColor: "transparent",
              color: "#94a3b8",
              borderColor: "transparent",
            }
      }
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.backgroundColor = "#334155";
          (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.backgroundColor =
            "transparent";
          (e.currentTarget as HTMLElement).style.color = "#94a3b8";
        }
      }}
    >
      <span className="d-flex align-items-center gap-2">
        {icon}
        {label}
      </span>
      {badge !== undefined && (
        <span
          className="badge rounded-pill text-white fw-bold"
          style={{ backgroundColor: badgeColor, fontSize: 11 }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  bgColor,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}) {
  return (
    <div
      className="bg-white p-4 rounded-4 shadow-sm border d-flex align-items-center gap-3"
      style={{ borderColor: "#e2e8f0", transition: "box-shadow 0.2s" }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.1)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow = "")
      }
    >
      <div
        className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
        style={{ width: 56, height: 56, backgroundColor: bgColor, color }}
      >
        {icon}
      </div>
      <div>
        <div
          className="fw-bold text-uppercase mb-1"
          style={{ color: "#64748b", fontSize: 11, letterSpacing: "0.08em" }}
        >
          {title}
        </div>
        <div className="fw-bolder" style={{ fontSize: 28, color: "#1e293b" }}>
          {value}
        </div>
      </div>
    </div>
  );
}
