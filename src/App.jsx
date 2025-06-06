import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/layout";
import History from "./components/History";
import Home from "./components/Home";
import Profile from "./components/Profile";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        
        {/* Routes WITH layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/historique" element={<History />} />
        </Route>

      </Routes>
    </HashRouter>
  );
}
