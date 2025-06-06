import React, { useState } from "react";
import RightSidebar from "./RightSidebar";




export default function TaskCard({ task,setListTasks,setAllTasks  }) {

    const [showModal, setShowModal] = useState(false);
    const [description, setDescription] = useState("");
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false); 

    function formatDate(dateString) {

     const date = new Date(dateString);
     const day = String(date.getDate()).padStart(2, '0');
     const month = String(date.getMonth() + 1).padStart(2, '0');
     const year = date.getFullYear();
     const hours = String(date.getHours()).padStart(2, '0');
     const minutes = String(date.getMinutes()).padStart(2, '0');
     return `${day}/${month}/${year} a ${hours}H${minutes}min`;
    }


  // Handle completing a task (removes from listtasks)
  const handleCompleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/complete/${taskId}`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Failed to complete task");

      // Update allTasks to mark task as completed
      setAllTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: 1 } : task
        )
      );

      setIsRemoving(true);
      // task disappears from UI
      setTimeout(() => {
        setListTasks((prev) => prev.filter((task) => task.id !== taskId));
      }, 300); 

    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const openDescriptionModal = (task) => {
  setCurrentTaskId(task.id);
  setDescription(task.description || "");
  setShowModal(true);
};

const updateDescription = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/tasks/updateDescription/${currentTaskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      throw new Error("Failed to update description");
    }

    setListTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === currentTaskId ? { ...t, description } : t

      )
    );

    setShowModal(false);
    setCurrentTaskId(null);

    setDescription("");
  } catch (error) {
    console.error(error);
  }
};
const removeTaskFromUI = (id) => {
  setListTasks((prev) => prev.filter((task) => task.id !== id));
};
  return (
<div   className={`
        group bg-[#d4a373] rounded-md shadow p-4 mb-4 flex items-center justify-between
        transition-opacity duration-300 ease-in-out
        ${isRemoving ? "opacity-0 max-h-0 p-0 mb-0 overflow-hidden" : "opacity-100 max-h-96"}
      `}
      style={{ transitionProperty: "opacity, max-height, padding, margin"}}>
  {/* Left Side: Checkbox + Task Info */}
  <div className="flex items-start space-x-4">
    <button
      onClick={() => handleCompleteTask(task.id)}
      className="text-white text-2xl hover:text-gray-300 transition-colors mt-1"
      title="Marquer comme complétée"
    >
      {task.completed ? (
        <i className="fas fa-check-circle"></i>
      ) : (
        <i className="far fa-circle"></i>
      )}
    </button>

    <div>
      <h3 className="font-semibold text-[30px] text-white">{task.title}</h3>
      <h2 className="text-gray-900 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Créée le : {formatDate(task.creation_date)}
      </h2>
    </div>
  </div>

  {/* Right Side Icon */}
      <div className="gap-2">
        <i className="fas fa-plus text-gray-900 text-[25px]  cursor-pointer"   onClick={() => openDescriptionModal(task)}></i>
        <i className="fas fa-ellipsis  text-gray-900 text-[25px]  cursor-pointer ml-5"  onClick={() => setSidebarOpen(true)}></i>
      </div>

      <RightSidebar
        isOpen={sidebarOpen}
        onDelete={removeTaskFromUI}
        onUpdate={(updatedTask) => {
            setAllTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
            setListTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
          }}
        onClose={() => setSidebarOpen(false)}
        task={task}
      />

      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-black bg-opacity-70 transition-opacity duration-300 opacity-100"></div>

    {/* Modal Box */}
    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full transition-all duration-300 transform scale-100 opacity-100">
      <h2 className="text-xl font-semibold mb-4">La tâche : {task.title}</h2>
      <textarea
        className="w-full h-[150px] border border-gray-300 rounded p-2 resize-none"
        placeholder="Entrez la description ici..."
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      ></textarea>

      <button
        onClick={() => setShowModal(false)}
        className="bg-gray-200 text-gary px-4 py-2 rounded-full hover:bg-gray-700 hover:text-gray-200 transition duration-300 mt-4"
      >
        fermer
      </button>
      <button
        onClick={updateDescription}
        className="bg-gray-200 text-gary px-4 py-2 rounded-full hover:bg-gray-700 hover:text-gray-200 transition duration-300 mt-4 ml-4"
      >
        Ajouter
      </button>
    </div>
  </div>
)}




</div>

  );
}
