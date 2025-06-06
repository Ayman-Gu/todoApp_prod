import React, { useEffect, useState } from "react";
import RightSidebar from "./RightSidebar";

export default function History({ task, setListTasks, setAllTasks }) {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [currentTaskId, setCurrentTaskId] = useState(null);

  // Track sidebar open and which task it relates to
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTask, setSidebarTask] = useState(null);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/tasks/getTask");
      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();
      const completed = data.filter((task) => task.completed === 1);
      setCompletedTasks(completed);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Run once on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} à ${hours}H${minutes}min`;
  }

  const openDescriptionModal = (task) => {
    setCurrentTaskId(task.id);
    setDescription(task.description || "");
    setShowModal(true);
  };

  const updateDescription = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/updateDescription/${currentTaskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        }
      );

      if (!response.ok) throw new Error("Failed to update description");

      // Update local state for description change
      setCompletedTasks((prevTasks) =>
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

  // Remove task from UI after delete
  const removeTaskFromUI = (id) => {
    setCompletedTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Update task in UI after update from sidebar
  const updateTaskInUI = (updatedTask) => {
    setCompletedTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  if (loading) return <p>Loading...</p>;

  if (completedTasks.length === 0) return <p>No completed tasks found.</p>;

  return (
    <div className="p-4">
      <h1 className="containertext-2xl font-bold mb-6 inline-flex items-center px-5 py-2.5 text-sm font-lg text-center text-gray-900 rounded-full bg-gray-200 shadow-lg">
        Historique des tâches complétées
      </h1>

      {completedTasks.map((task) => (
        <div
          key={task.id}
          className="w-[90%] group bg-[#d4a373] rounded-md ml-[55px] shadow p-4 mb-4 flex items-center justify-between "
        >
          {/* Left Side: Task Info */}
          <div className="flex items-start space-x-4">
            <button
              className="text-white text-2xl mt-1 cursor-default"
              title="Tâche complétée"
              disabled
            >
              <i className="fas fa-check-circle"></i>
            </button>

            <div>
              <h3 className="font-semibold text-[30px] text-white">
                {task.title}
              </h3>
              <h2 className="text-gray-900 font-semibold  transition-opacity duration-300">
                Créée le : {formatDate(task.creation_date)}
              </h2>
              <h2 className="text-gray-900 font-semibold  transition-opacity duration-300">
                Validée le : {formatDate(task.validation_date)}
              </h2>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="gap-2 flex">
            <i
              className="fas fa-plus text-gray-900 text-[25px] cursor-pointer"
              onClick={() => openDescriptionModal(task)}
              title="Modifier description"
            ></i>
            <i
              className="fas fa-ellipsis text-gray-900 text-[25px] cursor-pointer ml-5"
              onClick={() => {
                setSidebarTask(task); // Set the current task for the sidebar
                setSidebarOpen(true);
              }}
              title="Options"
            ></i>
          </div>
        </div>
      ))}

      <RightSidebar
        isOpen={sidebarOpen}
        onDelete={removeTaskFromUI}
        onClose={() => setSidebarOpen(false)}
        task={sidebarTask}
        onUpdate={updateTaskInUI}
      />

      {/* Modal for description editing */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-70 transition-opacity duration-300 opacity-100"></div>

          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full transition-all duration-300 transform scale-100 opacity-100">
            <h2 className="text-xl font-semibold mb-4">
              La tâche :{" "}
              {completedTasks.find((t) => t.id === currentTaskId)?.title || ""}
            </h2>
            <textarea
              className="w-full h-[150px] border border-gray-300 rounded p-2 resize-none"
              placeholder="Entrez la description ici..."
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></textarea>

            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-700 hover:text-gray-200 transition duration-300 mt-4"
            >
              fermer
            </button>
            <button
              onClick={updateDescription}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-700 hover:text-gray-200 transition duration-300 mt-4 ml-4"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
