import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./Home";
import ResultPage from "./Result";
import LoadingPage from "./components/Loading";
import Navbar from "./components/Navbar";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Home page: detection starts here */}
        <Route path="/" element={<App />} />

        {/* Loading page: receive result via state */}
        <Route path="/loading" element={<LoadingPage />} />

        {/* Result page: receive result via state */}
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
