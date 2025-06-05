import React from "react";
import { HashRouter } from "react-router-dom";
import Layout from "./layouts/layout";
import '@fortawesome/fontawesome-free/css/all.min.css';


export default function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}
