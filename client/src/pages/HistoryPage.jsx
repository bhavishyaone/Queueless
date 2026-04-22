import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { fetchHistoryQueue, fetchQueueStats } from "../api/queue";
import { socket } from "../api/socket";

const formatTime = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDuration = (start, end) => {
  if (!start || !end) return "—";
  const diff = Math.floor((new Date(end) - new Date(start)) / 1000);
  if (diff < 60) return `${diff}s`;
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  return `${m}m ${s}s`;
};

const StatusBadge = ({ status }) => {
  const styles = {
    DONE: "bg-emerald-100 text-emerald-800",
    SKIPPED: "bg-rose-100 text-rose-700",
  };
  const icons = { DONE: "✓", SKIPPED: "✕" };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {icons[status]} {status}
    </span>
  );
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const { data: history = [], isLoading, refetch } = useQuery({
    queryKey: ["history"],
    queryFn: fetchHistoryQueue,
    refetchInterval: 30000,
  });

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchQueueStats,
    refetchInterval: 30000,
  });

  useEffect(() => {
    socket.on("queue updated", () => refetch());
    return () => socket.off("queue updated");
  }, []);

  const filtered = history.filter((t) => {
    const matchesFilter = filter === "ALL" || t.status === filter;
    const matchesSearch =
      !search || String(t.tokenNumber).includes(search) || (t.counterNameSnapshot || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const doneCount = history.filter((t) => t.status === "DONE").length;
  const skippedCount = history.filter((t) => t.status === "SKIPPED").length;
  const completionRate = history.length > 0 ? Math.round((doneCount / history.length) * 100) : 0;

  const avgServiceTime = (() => {
    const served = history.filter((t) => t.status === "DONE" && t.servedAt && t.completedAt);
    if (!served.length) return null;
    const total = served.reduce((acc, t) => acc + (new Date(t.completedAt) - new Date(t.servedAt)), 0);
    const avg = Math.floor(total / served.length / 1000);
    return avg < 60 ? `${avg}s` : `${Math.floor(avg / 60)}m ${avg % 60}s`;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg"
            >
              Q
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">History & Analytics</h1>
              <p className="text-xs text-gray-500">Today's completed records</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => navigate("/track")}
              className="px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
            >
              🎫 Track Token
            </button>
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <button onClick={logout} className="ml-1 px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Cards */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm text-gray-500 font-medium">Total Issued</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats?.total ?? "—"}</p>
            </div>
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
              <p className="text-sm text-emerald-600 font-medium">Completed</p>
              <p className="text-3xl font-bold text-emerald-700 mt-1">{doneCount}</p>
            </div>
            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5">
              <p className="text-sm text-rose-500 font-medium">Skipped</p>
              <p className="text-3xl font-bold text-rose-600 mt-1">{skippedCount}</p>
            </div>
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5">
              <p className="text-sm text-indigo-600 font-medium">Completion Rate</p>
              <p className="text-3xl font-bold text-indigo-700 mt-1">{completionRate}%</p>
            </div>
          </div>

          {/* Progress bar */}
          {history.length > 0 && (
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Completion Rate
                  {avgServiceTime && (
                    <span className="ml-3 text-gray-400 font-normal">· Avg service: {avgServiceTime}</span>
                  )}
                </span>
                <span className="text-sm font-bold text-indigo-600">{completionRate}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-700"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="flex mt-2 gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Done: {doneCount}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> Skipped: {skippedCount}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Filters & Search */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by token # or counter…"
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56"
            />
            <div className="flex gap-2">
              {["ALL", "DONE", "SKIPPED"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition ${
                    filter === f
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="ml-auto text-sm text-gray-400">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </section>

        {/* History Table */}
        <section>
          {isLoading ? (
            <div className="flex justify-center py-16 text-gray-400 text-sm">Loading history…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-medium">No records found</p>
              <p className="text-sm mt-1">Completed and skipped tokens will appear here</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Token</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Counter</th>
                    <th className="px-6 py-3">Served At</th>
                    <th className="px-6 py-3">Completed At</th>
                    <th className="px-6 py-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((token) => (
                    <tr key={token._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-bold text-gray-800">#{token.tokenNumber}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={token.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-600">{token.counterNameSnapshot || "—"}</td>
                      <td className="px-6 py-4 text-gray-600">{formatTime(token.servedAt)}</td>
                      <td className="px-6 py-4 text-gray-600">{formatTime(token.completedAt || token.skippedAt)}</td>
                      <td className="px-6 py-4 text-gray-500">{formatDuration(token.servedAt, token.completedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HistoryPage;
