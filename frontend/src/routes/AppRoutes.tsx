import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Movies from "../pages/movies/Movies";
import Register from "../pages/Register";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/movies" element={<Movies />} />
      </Routes>
    </BrowserRouter>
  );
}
