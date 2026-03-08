import { useState, useEffect, useRef, useCallback } from "react";
import { IconTrash, IconX, IconAlertTriangle } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import { useAuth } from "../../../contexts/AuthContext";

export function DeleteModal({ onClose }) {
  const { deleteAccount, currentUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const firstInputRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose],
  );

  const handleChange = (e) => {
    if (e.target.name === "username") setUsername(e.target.value);
    else setConfirmation(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await deleteAccount(username);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    sileo.success({
      title: "Account deleted",
      duration: 4000,
      fill: "black!",
      styles: { title: "text-white!" },
    });
    navigate("/login", { replace: true });
  };

  const canSubmit = username && confirmation === "deleteAccount";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        aria-describedby="delete-account-description"
        className="bg-[#1a1c1c] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-red-500/15 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
              <IconTrash size={15} className="text-red-400/80" />
            </div>
            <div>
              <h2 id="delete-account-title" className="text-sm font-semibold text-white text-balance">
                Delete account
              </h2>
              <p className="text-[11px] text-white/40 mt-0.5">This action is permanent and irreversible.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="size-7 rounded-lg flex items-center justify-center hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"
          >
            <IconX size={16} />
          </button>
        </div>

        {/* Warning banner */}
        <div className="mx-5 mt-4 flex items-start gap-3 rounded-xl bg-red-500/[0.07] border border-red-500/15 px-4 py-3">
          <IconAlertTriangle size={15} className="text-red-400/80 mt-0.5 shrink-0" />
          <p id="delete-account-description" className="text-xs text-white/50 leading-relaxed text-pretty">
            All your applications, documents, and account data will be{" "}
            <span className="text-red-400/80 font-medium">permanently deleted</span>. This cannot be undone.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pt-4 pb-5 flex flex-col gap-3">
          <div>
            <label htmlFor="del_username" className="block text-xs font-medium text-white/50 mb-1.5">
              Username
            </label>
            <input
              ref={firstInputRef}
              required
              type="text"
              id="del_username"
              name="username"
              value={username}
              onChange={handleChange}
              autoComplete="username"
              placeholder={currentUser?.username || "Enter your username"}
              className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="del_confirm" className="block text-xs font-medium text-white/50 mb-1.5">
              Type <span className="font-mono text-white/30">deleteAccount</span> to confirm
            </label>
            <input
              required
              type="text"
              id="del_confirm"
              name="confirmation"
              value={confirmation}
              onChange={handleChange}
              autoComplete="off"
              placeholder="deleteAccount"
              className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 transition-colors"
            />
          </div>

          {/* Inline error */}
          {error && (
            <div role="alert" className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
              <IconAlertTriangle size={13} className="text-red-400/80 shrink-0" />
              <p className="text-xs text-red-400/90">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/25 text-red-400/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <IconTrash size={13} />
              {loading ? "Deleting…" : "Delete account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
