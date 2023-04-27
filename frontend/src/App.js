import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { AppProvider } from "./contexts/AppContext";
import Home from "./containers/Home";
import { Login, ProtectedRoute } from "./components";
import { fetchUser } from "./utils/fetchUser";

const App = () => {
  const navigate = useNavigate();
  const user = fetchUser();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute user={user}>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppProvider>
  );
};

export default App;
