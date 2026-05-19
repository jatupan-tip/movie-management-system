import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import Login from '../pages/Login';
import Movies from '../pages/Movies';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/movies"
          element={<Movies />}
        />
      </Routes>
    </BrowserRouter>
  );
}