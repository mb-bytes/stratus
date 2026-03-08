import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState, useRef } from "react";
import api from "../../../../libs/axiosInstance";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconHighlight,
  IconPalette,
  IconBriefcase,
  IconTrash,
} from "@tabler/icons-react";

const TEXT_COLORS = [
  "#ef4444", "#f97316", "#eab308",
  "#22c55e", "#3b82f6", "#8b5cf6",
  "#ec4899", "#000000", "#6b7280",
];

function MiniToolbar({ editor }) {
  const [showColors, setShowColors] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowColors(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  if (!editor) return null;

  const btn = (active, onClick, icon, title) => (
    <button
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded transition-colors cursor-pointer ${
        active
          ? "bg-zinc-800 text-white"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-zinc-100 bg-zinc-50">
      {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <IconBold size={13} />, "Bold")}
      {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <IconItalic size={13} />, "Italic")}
      {btn(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), <IconUnderline size={13} />, "Underline")}
      {btn(editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run(), <IconStrikethrough size={13} />, "Strikethrough")}
      <div className="w-px h-4 bg-zinc-200 mx-1" />
      {btn(editor.isActive("highlight"), () => editor.chain().focus().toggleHighlight().run(), <IconHighlight size={13} />, "Highlight")}
      <div ref={ref} className="relative">
        <button
          title="Text Color"
          onMouseDown={(e) => { e.preventDefault(); setShowColors((v) => !v); }}
          className="p-1.5 rounded text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors cursor-pointer"
        >
          <IconPalette size={13} />
        </button>
        {showColors && (
          <div className="absolute top-7 left-0 z-[100] bg-white border border-zinc-200 rounded-xl shadow-xl p-2 flex gap-1.5 flex-wrap w-32">
            {TEXT_COLORS.map((c) => (
              <button
                key={c}
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setColor(c).run();
                  setShowColors(false);
                }}
                className="w-4 h-4 rounded-full border border-zinc-200 hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: c }}
              />
            ))}
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().unsetColor().run();
                setShowColors(false);
              }}
              className="text-[10px] text-zinc-500 hover:text-zinc-800 mt-0.5 w-full text-left cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function JobNoteModal({ job, existingNote, onClose, onSaved, onDeleted }) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      Underline,
      Placeholder.configure({ placeholder: "Write a note for this job…" }),
    ],
    content: existingNote?.content || "",
  });

  const extractText = (json) => {
    if (!json) return "";
    return (json.content || [])
      .flatMap((n) => n.content?.map((c) => c.text || "") || [])
      .join(" ");
  };

  const handleSave = async () => {
    if (!editor) return;
    setSaving(true);
    const content = editor.getJSON();
    const plainText = extractText(content);
    const title = `${job.company_name} – ${job.role}`;

    try {
      let savedNote;
      if (existingNote?._id) {
        // Update existing note
        const { data } = await api.put(
          `/api/notes/${existingNote._id}`,
          { title, content, color: existingNote.color || "#ffffff" },
        );
        savedNote = data.note;
      } else {
        // Create new note linked to job
        const { data } = await api.post(
          "/api/notes",
          { title, content, color: "#ffffff", job_ref: job._id },
        );
        savedNote = data.note;
      }

      await api.put(
        `/api/jobs/${job._id}/notes`,
        { notes: plainText },
      );

      onSaved(plainText, savedNote);
    } catch (e) {
      console.error("Failed to save note:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingNote?._id) return;
    setDeleting(true);
    try {
      await api.delete(`/api/notes/${existingNote._id}`);
      // Clear the plain-text notes field on the job too
      await api.put(`/api/jobs/${job._id}/notes`, { notes: "" });
      onDeleted?.(existingNote._id);
    } catch (e) {
      console.error("Failed to delete note:", e);
    } finally {
      setDeleting(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onPointerDown={handleBackdrop}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-zinc-200 flex flex-col max-h-[80vh] overflow-hidden"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <IconBriefcase size={14} className="text-zinc-400" />
              <span className="text-xs text-zinc-400 font-medium">Job note</span>
            </div>
            <h3 className="text-base font-semibold text-zinc-900 leading-tight">
              {job.company_name}
              <span className="text-zinc-400 font-normal"> — {job.role}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6l-12 12" /><path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="border-t border-zinc-100" />

        <MiniToolbar editor={editor} />
        <div className="flex-1 overflow-y-auto px-5 py-3 min-h-[160px]">
          <EditorContent
            editor={editor}
            className="job-note-editor text-sm text-zinc-800 leading-relaxed focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-100 bg-zinc-50 rounded-b-2xl">
          {existingNote?._id ? (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              <IconTrash size={13} />
              {deleting ? "Deleting…" : "Delete note"}
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving…" : "Save note"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .job-note-editor:focus { outline: none; }
        .job-note-editor p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .job-note-editor mark { background: #fde68a; border-radius: 2px; padding: 0 2px; }
        .job-note-editor p { margin-bottom: 0.4rem; }
      `}</style>
    </div>
  );
}
