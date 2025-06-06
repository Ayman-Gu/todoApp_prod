import React from "react";
import { useState, useEffect } from "react";

export default function RightSidebar({ isOpen, onClose, task, onDelete,onUpdate  }) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

   useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
    }
  }, [task]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/deleteTask/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onDelete(id);      // Remove from UI
        onClose();         // Close sidebar
      } else {
        const data = await res.json();
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

   const handleUpdate = async () => {
    if (!task) return;

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/updateTask/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        const data = await res.json();
        onClose(true);
        if (onUpdate) onUpdate(data.task);
      } else {
        const data = await res.json();
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <>
      {/* RightSIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-50`}
      >

        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Options</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <i className="fas fa-times text-[25px]"></i>
          </button>
        </div>

        <div className="p-4">
          <label className="block text-gray-700 font-medium mb-2">Titre :</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm transition duration-200"
          />

          <label className="block text-gray-700 font-medium mb-2">Description :</label>
          <textarea
            value={description}
            rows="4"
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm transition duration-200"
          ></textarea>

          <div className="fixed bottom-[55px] flex items-center">
            <button
              onClick={handleUpdate}
              className="w-[150px] py-2 mt-4 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center gap-2"
            >
              
              Modifier

              <i className="fas fa-pencil-alt text-white text-[18px]"></i>
            </button>

            <button
               onClick={() => handleDelete(task.id)}
               className="w-[50px] h-[50px] mt-4 ml-5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center"
            >
              <i className="fas fa-trash text-white text-[18px]"></i>
            </button>
          </div>
        </div>



      </div>

      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}
