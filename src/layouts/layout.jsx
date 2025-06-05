import React, { useEffect, useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import Home from "../components/Home.jsx";
import Profile from "../components/Profile.jsx";
import TaskCard from "../components/taskCard.jsx";

export default function Layout() {
  const [task, setTask] = useState("");
  const [listtasks, setListTasks] = useState([]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && task.trim() !== "") {
      e.preventDefault();
      onAddTask(task);
      setTask("");
    }
  };

  const onAddTask = async (newTask) => {
  try {
    const now = new Date().toISOString();
    const taskData = {
      title: newTask,
      creation_date: now,
      validation_date: null,
      description: "",
      completed: 0,
    };

    const response = await fetch("http://localhost:5000/api/tasks/addTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Failed to add task");
    }
    setListTasks(prevTasks => [...prevTasks, taskData]);

  } catch (error) {
    console.error("Error adding task:", error);
  }
};

 useEffect(() => {
    // Fetch tasks from backend
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks/getTask");
        if (!response.ok) throw new Error("Failed to fetc");
        const data = await response.json();
      // Sort by creation_date ascending
      const sortedTasks = data.sort(
        (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
      );

      setListTasks(sortedTasks);      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <>
      <div className="flex h-100vh bg-[#DDDDDD]">
        {/* Sidebar */}
        <div className="group fixed inset-y-0 left-0 z-30 w-[60px] hover:w-[200px] transition-all duration-300 bg-black shadow-xl overflow-hidden">
          <nav className="flex flex-col items-start mt-10 space-y-4 px-2 text-white">
            {/* Home */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center w-full px-3 py-2 rounded-md space-x-4 transition-all duration-300 
                ${isActive ? "bg-cyan-700" : "hover:bg-cyan-600"}`
              }
            >
              <i className="fas fa-home min-w-[24px] text-white" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                Accueil
              </span>
            </NavLink>

            {/* Profile */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center w-full px-3 py-2 rounded-md space-x-4 transition-all duration-300 
                ${isActive ? "bg-[#FF7F3E]" : "hover:bg-[#FF7F3E]"}`
              }
            >
              <i className="fas fa-user min-w-[24px] text-white" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                Profile
              </span>
            </NavLink>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-[60px] group-hover:ml-[200px] transition-all duration-300">
          {/* SearchBar */}
          <header className="p-4">
            <div className="flex justify-center">
              <div className="relative w-[30%] min-w-[200px]">
                <i className="fas fa-search absolute left-3 top-2 text-gray-300 text-sm z-10"></i>
                <input
                  type="text"
                  placeholder="Recherche..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border-none shadow-lg  backdrop-blur-md placeholder-gray-300 text-white focus:ring-2 focus:outline-none transition-all duration-300 bg-gray-900"
                />
              </div>
            </div>
          </header>

           <main className="p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>

            {/* TASK LIST CONTAINER */}
            <div className="container mx-auto w-[90%] mt-8">
              {listtasks.length === 0 && (
                <p className="text-center text-gray-600">No tasks yet</p>
              )}
              {listtasks.map((t, i) => (
                <TaskCard key={i} task={t} setListTasks={setListTasks} />
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Input with plus and send icons */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[70%] p-4 rounded-t-lg">
        <div className="relative flex items-center w-full">
          {/* Left icon */}
          <i className="fas fa-plus absolute left-4 text-gray-400 text-lg pointer-events-none"></i>

          {/* Input */}
          <input
            type="text"
            placeholder="Ajouter une nouvelle tache.."
            value={task}
            name="title"
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown}
            className="peer w-full bg-gray-800 text-white rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 h-[55px] transition-all duration-300"
          />
          <i className="fas fa-paper-plane absolute right-4 text-cyan-400 text-lg opacity-0 peer-focus:opacity-100 transition-opacity duration-300 pointer-events-none"></i>
        </div>
      </div>
    </>
  );
}
