import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { IconNote, IconTrash } from "@tabler/icons-react";
import { cn } from "../../../../libs/utils";
import { JobNoteModal } from "./JobNoteModal";

function JobCard({ job, isBeingDragged, onDelete, onNoteUpdate, existingNote }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [localNote, setLocalNote] = useState(existingNote || null);

  const stopDrag = (e) => e.stopPropagation();
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: job._id,
  });

  const initials = job.company_name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const hasNote = !!(job.notes || localNote?.content);

  const handleNoteSaved = (plainText, savedNote) => {
    setLocalNote(savedNote);
    onNoteUpdate(job._id, plainText);
    setNoteOpen(false);
  };

  const handleNoteDeleted = () => {
    setLocalNote(null);
    onNoteUpdate(job._id, "");
    setNoteOpen(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={cn(
          "bg-white dark:bg-zinc-800/90 rounded-xl border border-zinc-200 dark:border-zinc-700/60",
          "mb-3 cursor-grab active:cursor-grabbing touch-none select-none",
          "shadow-sm hover:shadow-md transition-all",
          isBeingDragged && "opacity-30 scale-95"
        )}
      >
        <div className="p-4">
        <div className="flex items-start gap-3">
            <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                {initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate text-balance">
                {job.role}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                {job.company_name}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-700/50">
            {hasNote ? (
              <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                <IconNote className="size-3.5" />
                <span>Note</span>
              </span>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-0.5" onPointerDown={stopDrag}>
              <button
                aria-label="Delete application"
                onClick={() => onDelete(job._id)}
                className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              >
                <IconTrash className="size-4" />
              </button>
              <button
                aria-label="Add/Edit note"
                onClick={() => setNoteOpen(true)}
                className={cn(
                  "p-1.5 rounded-md transition-colors cursor-pointer",
                  hasNote
                    ? "text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                )}
              >
                <IconNote className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {noteOpen && (
        <JobNoteModal
          job={job}
          existingNote={localNote}
          onClose={() => setNoteOpen(false)}
          onSaved={handleNoteSaved}
          onDeleted={handleNoteDeleted}
        />
      )}
    </>
  );
}

export default JobCard;
