import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState, useCallback, useRef } from "react";
import api from "../../../libs/axiosInstance";
import {
  IconPlus,
  IconTrash,
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconList,
  IconListNumbers,
  IconH1,
  IconH2,
  IconH3,
  IconHighlight,
  IconPalette,
  IconNote,
  IconDots,
  IconBriefcase,
} from "@tabler/icons-react";
import { JobNoteModal } from "../Home/Kanban/JobNoteModal";

const CARD_COLORS = [
  { label: "Default", value: "#ffffff" },
  { label: "Red",     value: "#fef2f2" },
  { label: "Orange",  value: "#fff7ed" },
  { label: "Yellow",  value: "#fefce8" },
  { label: "Green",   value: "#f0fdf4" },
  { label: "Blue",    value: "#eff6ff" },
  { label: "Purple",  value: "#faf5ff" },
  { label: "Pink",    value: "#fdf2f8" },
];

const TEXT_COLORS = [
  "#ef4444", "#f97316", "#eab308",
  "#22c55e", "#3b82f6", "#8b5cf6",
  "#ec4899", "#000000", "#6b7280",
];

function Toolbar({ editor }) {
  const [showColors, setShowColors] = useState(false);
  const colorRef = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (colorRef.current && !colorRef.current.contains(e.target))
        setShowColors(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  if (!editor) return null;

  const btn = (active, onClick, children, title) => (
    <button
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded-md transition-colors cursor-pointer ${
        active
          ? "bg-zinc-800 text-white"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-zinc-100 bg-zinc-50 rounded-t-xl">
      {btn(editor.isActive("bold"),      () => editor.chain().focus().toggleBold().run(),                        <IconBold size={15} />,          "Bold")}
      {btn(editor.isActive("italic"),    () => editor.chain().focus().toggleItalic().run(),                      <IconItalic size={15} />,        "Italic")}
      {btn(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(),                   <IconUnderline size={15} />,     "Underline")}
      {btn(editor.isActive("strike"),    () => editor.chain().focus().toggleStrike().run(),                      <IconStrikethrough size={15} />, "Strikethrough")}

      <div className="w-px h-4 bg-zinc-200 mx-1" />

      {btn(editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), <IconH1 size={15} />, "Heading 1")}
      {btn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <IconH2 size={15} />, "Heading 2")}
      {btn(editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <IconH3 size={15} />, "Heading 3")}

      <div className="w-px h-4 bg-zinc-200 mx-1" />

      {btn(editor.isActive("bulletList"),  () => editor.chain().focus().toggleBulletList().run(),  <IconList size={15} />,        "Bullet List")}
      {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <IconListNumbers size={15} />, "Numbered List")}

      <div className="w-px h-4 bg-zinc-200 mx-1" />

      {btn(editor.isActive("highlight"), () => editor.chain().focus().toggleHighlight().run(), <IconHighlight size={15} />, "Highlight")}

      <div ref={colorRef} className="relative">
        <button
          title="Text Color"
          onMouseDown={(e) => { e.preventDefault(); setShowColors((v) => !v); }}
          className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors cursor-pointer"
        >
          <IconPalette size={15} />
        </button>
        {showColors && (
          <div className="absolute top-8 left-0 z-50 bg-white border border-zinc-200 rounded-xl shadow-xl p-2 flex gap-1.5 flex-wrap w-36">
            {TEXT_COLORS.map((c) => (
              <button
                key={c}
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setColor(c).run();
                  setShowColors(false);
                }}
                className="w-5 h-5 rounded-full border border-zinc-200 hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().unsetColor().run();
                setShowColors(false);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-800 px-1 mt-0.5 w-full text-left cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NoteEditor({ note, onSave, onDelete }) {
  const [title, setTitle] = useState(note?.title || "");
  const [color, setColor] = useState(note?.color || "#ffffff");
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      Underline,
      Placeholder.configure({ placeholder: "Write your note here…" }),
    ],
    content: note?.content || "",
  });

  const handleSave = async () => {
    if (!editor) return;
    setSaving(true);
    await onSave({ title, content: editor.getJSON(), color });
    setSaving(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title…"
          className="w-full text-xl font-semibold bg-transparent border-none outline-none text-zinc-900 placeholder:text-zinc-400"
        />
      </div>

      <div className="px-5 pb-3 flex items-center gap-2">
        <span className="text-xs text-zinc-400 font-medium">Card color:</span>
        <div className="flex gap-1.5">
          {CARD_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              title={c.label}
              className={`w-4 h-4 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                color === c.value ? "border-zinc-700 scale-110" : "border-zinc-300"
              }`}
              style={{ backgroundColor: c.value === "#ffffff" ? "#e5e7eb" : c.value }}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-100" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Toolbar editor={editor} />
        <div className="flex-1 overflow-y-auto px-5 py-3">
          <EditorContent
            editor={editor}
            className="tiptap-editor min-h-[200px] focus:outline-none text-zinc-800 text-sm leading-relaxed"
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-100 bg-zinc-50 rounded-b-2xl">
        {note?._id ? (
          <button
            onClick={() => onDelete(note._id)}
            className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <IconTrash size={14} /> Delete
          </button>
        ) : (
          <span />
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Saving…" : note?._id ? "Save changes" : "Create note"}
        </button>
      </div>
    </div>
  );
}

function NoteCard({ note, onClick }) {
  const preview = note.content?.content
    ?.flatMap((node) => node.content?.map((c) => c.text || "") || [])
    .join(" ")
    .slice(0, 120) || "";

  const bg = note.color || "#ffffff";
  const isJobNote = !!note.job_ref;
  const jobRef = note.job_ref;

  return (
    <button
      onClick={onClick}
      className="group relative text-left rounded-2xl p-4 border border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md transition-all duration-200 w-full cursor-pointer"
      style={{ backgroundColor: bg }}
    >
      {isJobNote && (
        <div className="flex items-center gap-1 mb-2">
          <IconBriefcase size={10} className="text-zinc-400" />
          <span className="text-[10px] font-medium text-zinc-400 truncate">
            {jobRef?.company_name} — {jobRef?.role}
          </span>
        </div>
      )}
      <h3 className="text-sm font-semibold text-zinc-800 truncate mb-1">
        {isJobNote ? (jobRef?.company_name || note.title) : (note.title || "Untitled Note")}
      </h3>
      {preview && (
        <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">{preview}</p>
      )}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconDots size={14} className="text-zinc-400" />
      </div>
    </button>
  );
}

function Notes() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [jobModalNote, setJobModalNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      const { data } = await api.get("/api/notes");
      setNotes(data.notes || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleOpen = (note = null) => {
    if (note?.job_ref) {
      setJobModalNote(note);
    } else {
      setActiveNote(note);
      setModalOpen(true);
    }
  };

  const handleSave = async ({ title, content, color }) => {
    try {
      if (activeNote?._id) {
        const { data } = await api.put(
          `/api/notes/${activeNote._id}`,
          { title, content, color },
        );
        setNotes((prev) => prev.map((n) => (n._id === data.note._id ? data.note : n)));
      } else {
        const { data } = await api.post(
          "/api/notes",
          { title, content, color },
        );
        setNotes((prev) => [data.note, ...prev]);
      }
      setModalOpen(false);
    } catch {
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      setModalOpen(false);
    } catch {
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden h-full">
      <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between h-20 px-6 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex-none shadow-sm rounded-b-2xl">
          <div className="flex items-center gap-2">
            <IconNote size={20} className="text-zinc-500" />
            <h1 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">Notes</h1>
            <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
              {notes.length}
            </span>
          </div>
          <button
            onClick={() => handleOpen(null)}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <IconPlus size={18} /> New note
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-400">
              <IconNote size={40} strokeWidth={1.2} />
              <p className="text-sm">No notes yet — create your first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onClick={() => handleOpen(note)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-2xl mx-4 bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6l-12 12" /><path d="M6 6l12 12" />
              </svg>
            </button>
            <NoteEditor
              key={activeNote?._id || "new"}
              note={activeNote}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}

      {jobModalNote && (
        <JobNoteModal
          job={jobModalNote.job_ref}
          existingNote={jobModalNote}
          onClose={() => setJobModalNote(null)}
          onSaved={(_plainText, savedNote) => {
            setNotes((prev) => prev.map((n) => (n._id === savedNote._id ? savedNote : n)));
            setJobModalNote(null);
          }}
          onDeleted={(deletedId) => {
            setNotes((prev) => prev.filter((n) => n._id !== deletedId));
            setJobModalNote(null);
          }}
        />
      )}

      <style>{`
        .tiptap-editor:focus { outline: none; }
        .tiptap-editor p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .tiptap-editor h1 { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.4rem; }
        .tiptap-editor h2 { font-size: 1.2rem; font-weight: 600; margin-bottom: 0.35rem; }
        .tiptap-editor h3 { font-size: 1rem;   font-weight: 600; margin-bottom: 0.3rem; }
        .tiptap-editor ul { list-style: disc; padding-left: 1.25rem; }
        .tiptap-editor ol { list-style: decimal; padding-left: 1.25rem; }
        .tiptap-editor mark { background: #fde68a; border-radius: 2px; padding: 0 2px; }
        .tiptap-editor p { margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
}

export default Notes;