import React from "react";
import { useDroppable } from "@dnd-kit/core";
import JobCard from "./JobCard";
import { cn } from "../../../../libs/utils";

function KanbanColumn({ status, title, jobs, dotColor, activeId, onNoteUpdate, onDelete, jobNoteMap = {} }) {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <div className="flex flex-col flex-1 min-w-[300px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full shrink-0", dotColor)} />
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            {title}
          </span>
        </div>
        <span className="tabular-nums text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
          {jobs.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-3 min-h-[420px] transition-colors duration-150 overflow-y-auto",
          isOver && "bg-zinc-50 dark:bg-zinc-800/50"
        )}
      >
        {jobs.length === 0 ? (
          <div className="flex items-center justify-center h-24 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-xs text-zinc-400 dark:text-zinc-600 text-pretty">Drop a card here</p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isBeingDragged={activeId === job._id}
              onNoteUpdate={onNoteUpdate}
              onDelete={onDelete}
              existingNote={jobNoteMap[job._id] || null}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;

