import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";
import api from "../../../../libs/axiosInstance";
import { sileo } from "sileo";
import { IconSearch, IconNote } from '@tabler/icons-react';

const API_URL = "/api/jobs";

const COLUMNS = [
  { title: "Applied",      status: "applied",     dotColor: "bg-blue-500" },
  { title: "Interviewing", status: "interviewed",  dotColor: "bg-amber-500" },
  { title: "Offered",      status: "offered",      dotColor: "bg-emerald-500" },
  { title: "Rejected",     status: "rejected",     dotColor: "bg-rose-500" },
];

function JobCardPreview({ job }) {
  const initials = job.company_name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="bg-white dark:bg-zinc-800/90 rounded-xl border border-zinc-200 dark:border-zinc-700/60 shadow-xl w-[280px] cursor-grabbing">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{job.role}</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{job.company_name}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-700/50">
          {job.notes ? (
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <IconNote className="size-3.5" />
              <span>Note</span>
            </span>
          ) : <span />}
        </div>
      </div>
    </div>
  );
}


function KanbanBoard({ refreshTrigger = 0 }) {
  const [jobs, setJobs] = useState([]);
  const [jobNoteMap, setJobNoteMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, notesRes] = await Promise.all([
          api.get(API_URL),
          api.get("/api/notes"),
        ]);
        setJobs(jobsRes.data.jobs || []);

        const map = {};
        (notesRes.data.notes || []).forEach((n) => {
          if (n.job_ref) {
            const refId = typeof n.job_ref === "object" ? n.job_ref._id : n.job_ref;
            map[refId] = n;
          }
        });
        setJobNoteMap(map);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  const filteredJobs = search.trim() ? jobs.filter((j)=> j.company_name.toLowerCase().includes(search.toLowerCase()) || j.role.toLowerCase().includes(search.toLowerCase())) : jobs;

  const handleDelete = async (jobId) => {
    const previousJobs = [...jobs];
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
    try {
      const del = await api.delete(`${API_URL}/${jobId}`);
      if(del){
          sileo.success({
            title: "Application Deleted",
            duration: 2000,
            fill: "black!",
            styles:{
              title: "text-white!"
            }
          })
      }

    } catch (error) {
      console.error("Failed to delete job:", error);
      setJobs(previousJobs);
    }
  };

  const handleNoteUpdate = async (jobId, notes) => {
    
    setJobs((prev) =>
      prev.map((j) => (j._id === jobId ? { ...j, notes } : j))
    );
    try {
      await api.put(
        `${API_URL}/${jobId}/notes`,
        { notes },
      );
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const handleDragStart = (event) => {
    const job = jobs.find((j) => j._id === event.active.id);
    setActiveJob(job ?? null);
  };

  const handleDragEnd = async (event) => {
    setActiveJob(null);
    const { active, over } = event;

    if (!over) return;

    const jobId = active.id;
    const newStatus = over.id;
    const job = jobs.find((j) => j._id === jobId);

    if (!job || job.status === newStatus) return;

    
    const previousJobs = [...jobs];
    setJobs((prevJobs) =>
      prevJobs.map((j) =>
        j._id === jobId ? { ...j, status: newStatus } : j
      )
    );

    
    try {
      await api.put(
        `${API_URL}/${jobId}/status`,
        { status: newStatus },
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      setJobs(previousJobs);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-6 space-y-2">
          <div className="h-7 w-52 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-zinc-100 dark:bg-zinc-800 rounded-md animate-pulse" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-6 w-full items-start">
          {COLUMNS.map((col) => (
            <div
              key={col.status}
              className="flex-1 min-w-[300px] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="size-2 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
              </div>
              <div className="p-3 space-y-3">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="h-[88px] rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white text-balance">
          Job Pipeline
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
          Drag and drop cards to move applications between stages.
        </p>
        </div>
        <div className="relative flex items-center">
          <IconSearch className="absolute left-3 size-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            id="search"
            className="h-9 w-56 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 transition-shadow"
            placeholder="Search applications…"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <div className="flex gap-4 overflow-x-auto pb-6 w-full items-start">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.status}
              title={col.title}
              status={col.status}
              dotColor={col.dotColor}
              jobs={filteredJobs.filter((j) => j.status === col.status)}
              activeId={activeJob?._id}
              onNoteUpdate={handleNoteUpdate}
              onDelete={handleDelete}
              jobNoteMap={jobNoteMap}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>
          {activeJob ? (
            <div className="rotate-1 opacity-95 shadow-2xl">
              <JobCardPreview job={activeJob} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
