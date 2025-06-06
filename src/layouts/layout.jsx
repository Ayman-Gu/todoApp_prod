import React, { useEffect, useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import TaskCard from "../components/taskCard.jsx";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";


export default function Layout() {
  const [task, setTask] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const [listtasks, setListTasks] = useState([]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && task.trim() !== "") {
      e.preventDefault();
      onAddTask(task);
      setTask("");
    }
  };

   useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("task:added", (newTask) => {
      setAllTasks((prev) => {
        // Avoid duplicates by id
        if (prev.some((t) => t.id === newTask.id)) return prev;
        const updatedTasks = [...prev, newTask];
        return updatedTasks;
      });

      setListTasks((prev) => {
        // Add only if incomplete (completed === 0)
        if (newTask.completed === 0) {
          return [...prev, newTask].sort(
            (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
          );
        }
        return prev;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);


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

  } catch (error) {
    console.error("Error adding task:", error);
  }
  };


 useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks/getTask");
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();

        setAllTasks(data);

        const incompleteTasks = data.filter((task) => task.completed === 0);

        const sortedTasks = incompleteTasks.sort(
          (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
        );

        setListTasks(sortedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);


  const location = useLocation();
  const isHistorique = location.pathname === "/historique";
  const isProfile = location.pathname === "/profile";


  return (
    <>
      <div className="flex h-100vh bg-[#ccd5ae]">
        {/* Sidebar */}
        <div className="group fixed inset-y-0 left-0 z-30 w-[60px] hover:w-[200px] transition-all duration-300 bg-black shadow-xl overflow-hidden">
          <nav className="flex flex-col items-start mt-10 space-y-4 px-2 text-white">
            {/* Home */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center w-full px-3 py-2 rounded-md space-x-4 transition-all duration-300 
                ${isActive ? "bg-[#8da9c4]" : "hover:bg-[#8da9c4]"}`
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

             {/* History */}
            <NavLink
              to="/historique"
              className={({ isActive }) =>
                `flex items-center w-full px-3 py-2 rounded-md space-x-4 transition-all duration-300 
                ${isActive ? "bg-green-700" : "hover:bg-green-600"}`
              }
            >
              <i className="fas fa-history min-w-[24px] text-white" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                Historique
              </span>
            </NavLink>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-[60px] group-hover:ml-[200px] transition-all duration-300">
          {/* SearchBar */}
          <header className="p-4">
            <div className="flex justify-center">
              <div className="relative w-[30%] min-w-[200px] shadow-sm">
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
            <Outlet />
            {/* TASK LIST CONTAINER */}
           {!isHistorique && !isProfile &&(
            
              <div className="container mx-auto w-[90%] mt-8">
                 {/* top content */}
                 <div className="container mt-5 mb-5">
                     <div class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-gray-900  rounded-full bg-gray-200 ml-5 shadow-lg">
                         Les taches D'aujourd'hui
                     </div>
                 </div>
                {listtasks.length === 0 && (
                 <div className="flex items-center justify-center mt-[150px]">
                    <div className="text-center p-6 bg-gray-200 rounded-lg shadow-lg w-[20%]">
                      <div className="text-4xl mb-4">
                        <span role="img" aria-label="No tasks">😴</span>
                      </div>
                      <p className="text-gray-600">No tasks yet</p>
                    </div>
                  </div>

                )}
                {listtasks.map((t) => (
                  <TaskCard key={t.id} task={t} setListTasks={setListTasks} setAllTasks={setAllTasks}/>
                ))}
              </div>
            )}
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
