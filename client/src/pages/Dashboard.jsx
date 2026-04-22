import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import {
  fetchLiveQueue,
  fetchQueueStats,
  createToken,
  serveNext,
  completeToken,
  skipToken,
  resetQueue,
} from "../api/queue";
import { socket } from "../api/socket";
import { useNavigate } from "react-router-dom";

const ROLE_ADMIN = "ADMIN";
const ROLE_STAFF = "STAFF";

const statusColors = {
  WAITING: {
    bg: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-400",
  },
  SERVING: {
    bg: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-500",
  },
};

const StatCard = ({ label, value, icon, color }) => (
  <div className={`rounded-2xl border p-5 flex items-center gap-4 shadow-sm bg-white`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value ?? "—"}</p>
    </div>
  </div>
);

const TokenCard = ({ token, onComplete, onSkip, isCompleting, isSkipping }) => {
  const style = statusColors[token.status] || { bg: "bg-gray-50 border-gray-200", badge: "bg-gray-100 text-gray-700", dot: "bg-gray-400" };
  return (
    <div className={`rounded-2xl border p-4 flex items-center justify-between gap-4 shadow-sm transition-all ${style.bg}`}>
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${style.dot} animate-pulse`} />
        <div>
          <p className="text-2xl font-bold text-gray-800">#{token.tokenNumber}</p>
          {token.counterNameSnapshot && (
            <p className="text-xs text-gray-500 mt-0.5">Counter: {token.counterNameSnapshot}</p>
          )}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
            {token.status}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {token.status === "SERVING" && (
          <button
            onClick={() => onComplete(token._id)}
            disabled={isCompleting}
            className="px-3 py-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition disabled:opacity-50"
          >
            ✓ Complete
          </button>
        )}
        {token.status === "WAITING" && (
          <button
            onClick={() => onSkip(token._id)}
            disabled={isSkipping}
            className="px-3 py-1.5 text-sm font-medium bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition disabled:opacity-50"
          >
            ✕ Skip
          </button>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [counterId, setCounterId] = useState("");
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const invalidateQueue = () => {
    queryClient.invalidateQueries({ queryKey: ["queue"] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  };

  // Real-time socket listener
  useEffect(() => {
    socket.on("queue updated", () => invalidateQueue());
    return () => socket.off("queue updated");
  }, []);

  const { data: queue = [], isLoading: queueLoading } = useQuery({
    queryKey: ["queue"],
    queryFn: fetchLiveQueue,
    refetchInterval: 15000,
  });

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchQueueStats,
    refetchInterval: 15000,
  });

  const createMutation = useMutation({
    mutationFn: createToken,
    onSuccess: () => { invalidateQueue(); showToast("New token created!"); },
    onError: (e) => showToast(e?.response?.data?.message || "Failed to create token", "error"),
  });

  const serveMutation = useMutation({
    mutationFn: () => serveNext(counterId),
    onSuccess: () => { invalidateQueue(); showToast("Now serving next patient!"); },
    onError: (e) => showToast(e?.response?.data?.message || "Failed to serve token", "error"),
  });

  const completeMutation = useMutation({
    mutationFn: completeToken,
    onSuccess: () => { invalidateQueue(); showToast("Token marked as done!"); },
    onError: (e) => showToast(e?.response?.data?.message || "Failed to complete", "error"),
  });

  const skipMutation = useMutation({
    mutationFn: skipToken,
    onSuccess: () => { invalidateQueue(); showToast("Token skipped."); },
    onError: (e) => showToast(e?.response?.data?.message || "Failed to skip", "error"),
  });

  const resetMutation = useMutation({
    mutationFn: resetQueue,
    onSuccess: () => { invalidateQueue(); showToast("Queue has been reset!"); },
    onError: (e) => showToast(e?.response?.data?.message || "Failed to reset", "error"),
  });

  const waitingTokens = queue.filter((t) => t.status === "WAITING");
  const servingTokens = queue.filter((t) => t.status === "SERVING");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Toast */}
      {toastMsg && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-medium transition-all ${toastMsg.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toastMsg.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              Q
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">Queueless</h1>
              <p className="text-xs text-gray-500">Queue Management</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => navigate("/history")}
              className="px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
            >
              📊 History
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
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="ml-2 px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Row */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Tokens" value={stats?.total} icon="🎫" color="bg-indigo-50 text-indigo-600" />
            <StatCard label="Waiting" value={stats?.waiting} icon="⏳" color="bg-amber-50 text-amber-600" />
            <StatCard label="Serving" value={servingTokens.length} icon="🔵" color="bg-blue-50 text-blue-600" />
            <StatCard label="Done Today" value={stats?.done} icon="✅" color="bg-emerald-50 text-emerald-600" />
          </div>
        </section>

        {/* Actions */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Queue Actions</h2>
          <div className="flex flex-wrap gap-3 items-end">
            {/* Create Token */}
            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-sm disabled:opacity-50"
            >
              {createMutation.isPending ? "Creating…" : "➕ New Token"}
            </button>

            {/* Serve Next */}
            <div className="flex gap-2 items-center">
              <input
                value={counterId}
                onChange={(e) => setCounterId(e.target.value)}
                placeholder="Counter ID"
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button
                onClick={() => serveMutation.mutate()}
                disabled={serveMutation.isPending || !counterId}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm disabled:opacity-50"
              >
                {serveMutation.isPending ? "Serving…" : "▶ Serve Next"}
              </button>
            </div>

            {/* Reset — admin only */}
            {user?.role === ROLE_ADMIN && (
              <button
                onClick={() => {
                  if (confirm("Reset all waiting tokens to skipped?")) resetMutation.mutate();
                }}
                disabled={resetMutation.isPending}
                className="ml-auto px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition shadow-sm disabled:opacity-50"
              >
                {resetMutation.isPending ? "Resetting…" : "⚠ Reset Queue"}
              </button>
            )}
          </div>
        </section>

        {/* Live Queue */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Live Queue{" "}
              <span className="text-sm font-normal text-gray-500 ml-1">
                ({queue.length} active)
              </span>
            </h2>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>

          {queueLoading ? (
            <div className="flex justify-center py-16 text-gray-400 text-sm">Loading queue…</div>
          ) : queue.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
              <p className="text-4xl mb-3">🎉</p>
              <p className="font-medium">Queue is empty</p>
              <p className="text-sm mt-1">Create a new token to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Serving first */}
              {servingTokens.map((token) => (
                <TokenCard
                  key={token._id}
                  token={token}
                  onComplete={(id) => completeMutation.mutate(id)}
                  onSkip={(id) => skipMutation.mutate(id)}
                  isCompleting={completeMutation.isPending}
                  isSkipping={skipMutation.isPending}
                />
              ))}
              {/* Then waiting */}
              {waitingTokens.map((token) => (
                <TokenCard
                  key={token._id}
                  token={token}
                  onComplete={(id) => completeMutation.mutate(id)}
                  onSkip={(id) => skipMutation.mutate(id)}
                  isCompleting={completeMutation.isPending}
                  isSkipping={skipMutation.isPending}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
