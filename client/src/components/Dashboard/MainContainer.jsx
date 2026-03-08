import React, { useState } from "react"
import Header from "./Home/Header/Header"
import KanbanBoard from "./Home/Kanban/Kanban"
import { AddApplicationModal } from "./Home/Header/AddApplicationModal"

function MainContainer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleJobAdded = () => {
    setIsModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden h-full">
      <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center rounded-b-2xl h-20 px-6 justify-between bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex-none pb-2 relative z-10 shadow-sm">
          <Header onAddClick={() => setIsModalOpen(true)} />
        </div>
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 relative">
          <KanbanBoard refreshTrigger={refreshTrigger} />
        </div>
      </div>
      {isModalOpen && (
        <AddApplicationModal
          onClose={() => setIsModalOpen(false)}
          onJobAdded={handleJobAdded}
        />
      )}
    </div>
  )
}

export default MainContainer
