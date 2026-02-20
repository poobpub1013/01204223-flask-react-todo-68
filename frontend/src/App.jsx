import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TodoList from "./TodoList";
import LoginForm from "./LoginForm";
import PrivateRoute from "./PrivateRoute";   // ✅ เพิ่มบรรทัดนี้
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 🔒 Protected Route */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <TodoList />
              </PrivateRoute>
            }
          />

          {/* 🔓 Public Route */}
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;